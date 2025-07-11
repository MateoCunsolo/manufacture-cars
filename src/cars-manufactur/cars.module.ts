import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CarsService } from './services/cars.service';
import { CarsController } from './controller/cars.controller';

@Module({
  imports: [HttpModule],
  controllers: [CarsController],
  providers: [CarsService],
})
export class CarsModule {}
