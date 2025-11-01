import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { SocketModule } from './socket/socket.module';
import { DriversPositionModule } from './drivers_position/drivers_position.module';
import { ClientRequestsModule } from './client_requests/client_requests.module';
import { TimeAndDistanceValuesModule } from './time_and_distance_values/time_and_distance_values.module';
import { DriverTripOffersModule } from './driver_trip_offers/driver_trip_offers.module';
import { DriverCarInfoModule } from './driver_car_info/driver_car_info.module';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
      ssl: process.env.DATABASE_URL.includes("railway") ? { rejectUnauthorized: false } : false,
    }),

    UsersModule,
    AuthModule,
    RolesModule,
    SocketModule,
    DriversPositionModule,
    ClientRequestsModule,
    TimeAndDistanceValuesModule,
    DriverTripOffersModule,
    DriverCarInfoModule,
    FirebaseModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
