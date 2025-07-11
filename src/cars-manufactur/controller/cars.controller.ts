import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CarsService } from '../services/cars.service';
import { Manufacturer } from '../models/manufacturer.model';

@ApiTags('Fabricantes de Vehículos')
@Controller('cars-manufacturers')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Obtener lista de fabricantes de vehículos',
    description: 'Retorna una lista completa de todos los fabricantes de vehículos disponibles en la base de datos NHTSA'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de fabricantes obtenida exitosamente',
    type: [Object]
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Error interno del servidor al obtener datos de fabricantes' 
  })
  async getCarsManufacturers(): Promise<Manufacturer[]> {
    return this.carsService.getCarsManufacturers();
  }
}
