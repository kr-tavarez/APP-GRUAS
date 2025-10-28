import { DriverTripOffersService } from './driver_trip_offers.service';
import { CreateDriverTripOffersDto } from './dto/create_driver_trip_offers.dto';
export declare class DriverTripOffersController {
    private driverTripOffersService;
    constructor(driverTripOffersService: DriverTripOffersService);
    findByClientRequest(id_client_request: number): Promise<any>;
    create(driverTripOffer: CreateDriverTripOffersDto): Promise<import("./driver_trip_offers.entity").DriverTripOffers>;
}
