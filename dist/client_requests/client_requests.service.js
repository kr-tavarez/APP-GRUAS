"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientRequestsService = void 0;
const google_maps_services_js_1 = require("@googlemaps/google-maps-services-js");
const common_1 = require("@nestjs/common");
const time_and_distance_values_service_1 = require("../time_and_distance_values/time_and_distance_values.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const client_requests_entity_1 = require("./client_requests.entity");
const firebase_repository_1 = require("../firebase/firebase.repository");
const API_KEY = 'AIzaSyC3pig6Ac_SqpYuK_Swarr-DgGZlIf5GqE';
let ClientRequestsService = class ClientRequestsService extends google_maps_services_js_1.Client {
    constructor(clientRequestsRepository, timeAndDistanceValuesService, firebaseRepository) {
        super();
        this.clientRequestsRepository = clientRequestsRepository;
        this.timeAndDistanceValuesService = timeAndDistanceValuesService;
        this.firebaseRepository = firebaseRepository;
    }
    async create(clientRequest) {
        try {
            await this.clientRequestsRepository.query(`
                INSERT INTO
                    client_requests(
                        id_client,
                        fare_offered,
                        pickup_description,
                        destination_description,
                        pickup_position,
                        destination_position
                    )
                VALUES(
                    ${clientRequest.id_client},
                    ${clientRequest.fare_offered},
                    '${clientRequest.pickup_description}',
                    '${clientRequest.destination_description}',
                    ST_GeomFromText('POINT(${clientRequest.pickup_lat} ${clientRequest.pickup_lng})', 4326),
                    ST_GeomFromText('POINT(${clientRequest.destination_lat} ${clientRequest.destination_lng})', 4326)
                )
            `);
            const data = await this.clientRequestsRepository.query(`SELECT MAX(id) AS id FROM client_requests`);
            const nearbyDrivers = await this.clientRequestsRepository.query(`
            SELECT
                U.id,
                U.name,
                U.notification_token,
                DP.position,
                ST_Distance_Sphere(DP.position, ST_GeomFromText('POINT(${clientRequest.pickup_lat} ${clientRequest.pickup_lng})', 4326)) AS distance
            FROM
                users AS U
            LEFT JOIN
                drivers_position AS DP
            ON
                U.id = DP.id_driver    
            HAVING
                distance < 10000
            `);
            const notificationTokens = [];
            nearbyDrivers.forEach((driver, index) => {
                if (!notificationTokens.includes(driver.notification_token)) {
                    if (driver.notification_token !== '') {
                        notificationTokens.push(driver.notification_token);
                    }
                }
            });
            console.log('NOTIFICATION TOKEN:', notificationTokens);
            this.firebaseRepository.sendMessageToMultipleDevices({
                "tokens": notificationTokens,
                "notification": {
                    "title": "Solicitud de viaje",
                    "body": clientRequest.pickup_description
                },
                "data": {
                    "id_client_requets": `${data[0].id}`,
                    "type": 'CLIENT_REQUEST',
                },
                "android": {
                    "priority": "high",
                    "ttl": 180
                },
                "apns": {
                    "headers": {
                        "apns-priority": "5",
                        "apns-expiration": "180"
                    }
                }
            });
            return Number(data[0].id);
        }
        catch (error) {
            console.log('Error creando la solicitud del cliente', error);
            throw new common_1.HttpException('Error del servidor', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateDriverAssigned(driverAssigned) {
        try {
            await this.clientRequestsRepository.query(`
                UPDATE
                    client_requests
                SET
                    id_driver_assigned = ${driverAssigned.id_driver_assigned},
                    status = '${client_requests_entity_1.Status.ACCEPTED}',
                    updated_at = NOW(),
                    fare_assigned = ${driverAssigned.fare_assigned}
                WHERE
                    id = ${driverAssigned.id}
            `);
            return true;
        }
        catch (error) {
            console.log('Error creando la solicitud del cliente', error);
            throw new common_1.HttpException('Error del servidor', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateStatus(updateStatusDto) {
        try {
            await this.clientRequestsRepository.query(`
                UPDATE
                    client_requests
                SET
                    status = '${updateStatusDto.status}',
                    updated_at = NOW()
                WHERE
                    id = ${updateStatusDto.id_client_request}
            `);
            return true;
        }
        catch (error) {
            console.log('Error creando la solicitud del cliente', error);
            throw new common_1.HttpException('Error del servidor', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateDriverRating(driverRating) {
        try {
            await this.clientRequestsRepository.query(`
                UPDATE
                    client_requests
                SET
                    driver_rating = '${driverRating.driver_rating}',
                    updated_at = NOW()
                WHERE
                    id = ${driverRating.id_client_request}
            `);
            return true;
        }
        catch (error) {
            console.log('Error creando la solicitud del cliente', error);
            throw new common_1.HttpException('Error del servidor', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateClientRating(driverRating) {
        try {
            await this.clientRequestsRepository.query(`
                UPDATE
                    client_requests
                SET
                    client_rating = '${driverRating.client_rating}',
                    updated_at = NOW()
                WHERE
                    id = ${driverRating.id_client_request}
            `);
            return true;
        }
        catch (error) {
            console.log('Error creando la solicitud del cliente', error);
            throw new common_1.HttpException('Error del servidor', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getByClientRequest(id_client_request) {
        const data = await this.clientRequestsRepository.query(`
        SELECT
            CR.id,
            CR.id_client,
            CR.fare_offered,
            CR.pickup_description,
            CR.destination_description,
            CR.status,
            CR.updated_at,
            CR.pickup_position,
            CR.destination_position,
            CR.fare_assigned,
            CR.id_driver_assigned,
            JSON_OBJECT(
                "name", U.name,
                "lastname", U.lastname,
                "phone", U.phone,
                "image", U.image
            ) AS client,
            JSON_OBJECT(
                "name", D.name,
                "lastname", D.lastname,
                "phone", D.phone,
                "image", D.image
            ) AS driver,
            JSON_OBJECT(
                "brand", DCI.brand,
                "plate", DCI.plate,
                "color", DCI.color
            ) AS car
        FROM 
            client_requests AS CR
        INNER JOIN
            users AS U
        ON
            U.id = CR.id_client
        LEFT JOIN
            users AS D
        ON
            D.id = CR.id_driver_assigned
        LEFT JOIN
            driver_car_info AS DCI
        ON
            DCI.id_driver = CR.id_driver_assigned
        WHERE
            CR.id = ${id_client_request} AND CR.status = '${client_requests_entity_1.Status.ACCEPTED}'
        `);
        return Object.assign(Object.assign({}, data[0]), { 'pickup_lat': data[0].pickup_position.y, 'pickup_lng': data[0].pickup_position.x, 'destination_lat': data[0].destination_position.y, 'destination_lng': data[0].destination_position.x });
    }
    async getByDriverAssigned(id_driver) {
        const data = await this.clientRequestsRepository.query(`
        SELECT
            CR.id,
            CR.id_client,
            CR.fare_offered,
            CR.pickup_description,
            CR.destination_description,
            CR.status,
            CR.updated_at,
            CR.created_at,
            CR.pickup_position,
            CR.destination_position,
            CR.fare_assigned,
            CR.id_driver_assigned,
            CR.driver_rating,
            CR.client_rating,
            JSON_OBJECT(
                "name", U.name,
                "lastname", U.lastname,
                "phone", U.phone,
                "image", U.image
            ) AS client,
            JSON_OBJECT(
                "name", D.name,
                "lastname", D.lastname,
                "phone", D.phone,
                "image", D.image
            ) AS driver,
            JSON_OBJECT(
                "brand", DCI.brand,
                "plate", DCI.plate,
                "color", DCI.color
            ) AS car
        FROM 
            client_requests AS CR
        INNER JOIN
            users AS U
        ON
            U.id = CR.id_client
        LEFT JOIN
            users AS D
        ON
            D.id = CR.id_driver_assigned
        LEFT JOIN
            driver_car_info AS DCI
        ON
            DCI.id_driver = CR.id_driver_assigned
        WHERE
            CR.id_driver_assigned = ${id_driver} AND CR.status = '${client_requests_entity_1.Status.FINISHED}'
        `);
        return data;
    }
    async getByClientAssigned(id_client) {
        const data = await this.clientRequestsRepository.query(`
        SELECT
            CR.id,
            CR.id_client,
            CR.fare_offered,
            CR.pickup_description,
            CR.destination_description,
            CR.status,
            CR.updated_at,
            CR.created_at,
            CR.pickup_position,
            CR.destination_position,
            CR.fare_assigned,
            CR.id_driver_assigned,
            CR.driver_rating,
            CR.client_rating,
            JSON_OBJECT(
                "name", U.name,
                "lastname", U.lastname,
                "phone", U.phone,
                "image", U.image
            ) AS client,
            JSON_OBJECT(
                "name", D.name,
                "lastname", D.lastname,
                "phone", D.phone,
                "image", D.image
            ) AS driver,
            JSON_OBJECT(
                "brand", DCI.brand,
                "plate", DCI.plate,
                "color", DCI.color
            ) AS car
        FROM 
            client_requests AS CR
        INNER JOIN
            users AS U
        ON
            U.id = CR.id_client
        LEFT JOIN
            users AS D
        ON
            D.id = CR.id_driver_assigned
        LEFT JOIN
            driver_car_info AS DCI
        ON
            DCI.id_driver = CR.id_driver_assigned
        WHERE
            CR.id_client = ${id_client} AND CR.status = '${client_requests_entity_1.Status.FINISHED}'
        `);
        return data;
    }
    async getNearbyTripRequest(driver_lat, driver_lng) {
        const data = await this.clientRequestsRepository.query(`
        SELECT
            CR.id,
            CR.id_client,
            CR.fare_offered,
            CR.pickup_description,
            CR.destination_description,
            CR.status,
            CR.updated_at,
            CR.pickup_position,
            CR.destination_position,
            ST_Distance_Sphere(pickup_position, ST_GeomFromText('POINT(${driver_lat} ${driver_lng})', 4326)) AS distance,
            timestampdiff(MINUTE, CR.updated_at, NOW()) AS time_difference,
        JSON_OBJECT(
            "name", U.name,
            "lastname", U.lastname,
            "phone", U.phone,
            "image", U.image
        ) AS client
        FROM 
            client_requests AS CR
        INNER JOIN
            users AS U
        ON
            U.id = CR.id_client
        WHERE
            timestampdiff(MINUTE, CR.updated_at, NOW()) < 5000 AND CR.status = '${client_requests_entity_1.Status.CREATED}'
        HAVING
            distance < 10000
        `);
        if (data.length > 0) {
            const pickup_positions = data.map(d => ({
                lat: d.pickup_position.y,
                lng: d.pickup_position.x
            }));
            const googleResponse = await this.distancematrix({
                params: {
                    mode: google_maps_services_js_1.TravelMode.driving,
                    key: API_KEY,
                    origins: [
                        {
                            lat: driver_lat,
                            lng: driver_lng
                        }
                    ],
                    destinations: pickup_positions
                }
            });
            data.forEach((d, index) => {
                d.google_distance_matrix = googleResponse.data.rows[0].elements[index];
            });
        }
        return data;
    }
    async getTimeAndDistanceClientRequest(origin_lat, origin_lng, destination_lat, destination_lng) {
        const values = await this.timeAndDistanceValuesService.find();
        const kmValue = values[0].km_value;
        const minValue = values[0].min_value;
        const googleResponse = await this.distancematrix({
            params: {
                mode: google_maps_services_js_1.TravelMode.driving,
                key: API_KEY,
                origins: [
                    {
                        lat: origin_lat,
                        lng: origin_lng
                    }
                ],
                destinations: [
                    {
                        lat: destination_lat,
                        lng: destination_lng
                    }
                ]
            }
        });
        const recommendedValue = (kmValue * (googleResponse.data.rows[0].elements[0].distance.value / 1000)) + (minValue * (googleResponse.data.rows[0].elements[0].duration.value / 60));
        return {
            'recommended_value': recommendedValue,
            'destination_addresses': googleResponse.data.destination_addresses[0],
            'origin_addresses': googleResponse.data.origin_addresses[0],
            'distance': {
                'text': googleResponse.data.rows[0].elements[0].distance.text,
                'value': (googleResponse.data.rows[0].elements[0].distance.value / 1000)
            },
            'duration': {
                'text': googleResponse.data.rows[0].elements[0].duration.text,
                'value': (googleResponse.data.rows[0].elements[0].duration.value / 60)
            },
        };
    }
};
ClientRequestsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(client_requests_entity_1.ClientRequests)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        time_and_distance_values_service_1.TimeAndDistanceValuesService,
        firebase_repository_1.FirebaseRepository])
], ClientRequestsService);
exports.ClientRequestsService = ClientRequestsService;
//# sourceMappingURL=client_requests.service.js.map