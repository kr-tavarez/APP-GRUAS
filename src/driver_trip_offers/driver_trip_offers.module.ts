import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverTripOffers } from './driver_trip_offers.entity';
import { DriverTripOffersService } from './driver_trip_offers.service';
import { DriverTripOffersController } from './driver_trip_offers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DriverTripOffers])],
  providers: [DriverTripOffersService],
  controllers: [DriverTripOffersController],
  exports: [DriverTripOffersService], // <-- IMPORTANTE
})
export class DriverTripOffersModule {}
