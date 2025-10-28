import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DriverTripOffers } from './driver_trip_offers.entity';
import { Repository } from 'typeorm';
import { CreateDriverTripOffersDto } from './dto/create_driver_trip_offers.dto';

@Injectable()
export class DriverTripOffersService {

    constructor(@InjectRepository(DriverTripOffers) private driverTripOffersRepository: Repository<DriverTripOffers>) {}

    create(driverTripOffer: CreateDriverTripOffersDto) {
        const newData = this.driverTripOffersRepository.create(driverTripOffer);
        return this.driverTripOffersRepository.save(newData);
    }_

}
