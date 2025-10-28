import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DriverTripOffers } from './driver_trip_offers.entity';
import { CreateDriverTripOffersDto } from './dto/create_driver_trip_offers.dto';

@Injectable()
export class DriverTripOffersService {

  constructor(
    @InjectRepository(DriverTripOffers)
    private readonly driverTripOffersRepository: Repository<DriverTripOffers>,
  ) {}

  async create(driverTripOffer: CreateDriverTripOffersDto) {
    const newData = this.driverTripOffersRepository.create(driverTripOffer);
    return await this.driverTripOffersRepository.save(newData);
  }

  async findByClientRequest(id_client_request: number) {
    return await this.driverTripOffersRepository.find({
      where: { id_client_request },
      relations: ['clientRequests', 'driver'], // opcional
    });
  }
}

