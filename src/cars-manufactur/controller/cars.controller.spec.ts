import { Test, TestingModule } from '@nestjs/testing';
import { CarsController } from './cars.controller';
import { CarsService } from '../services/cars.service';
import { Manufacturer } from '../models/manufacturer.model';

describe('CarsController', () => {
  let controller: CarsController;
  let service: CarsService;

  const mockManufacturers: Manufacturer[] = [
    {
      country: 'UNITED STATES (USA)',
      countryCode: 'USA',
      flagUrl: 'https://flagcdn.com/w80/usa.png',
      commonName: 'Tesla',
      legalName: 'TESLA, INC.',
      vehicleTypes: [
        { name: 'Passenger Car' },
        { name: 'Truck' }
      ]
    },
    {
      country: 'GERMANY',
      countryCode: 'DEU',
      flagUrl: 'https://flagcdn.com/w80/deu.png',
      commonName: 'BMW',
      legalName: 'BMW AG',
      vehicleTypes: [
        { name: 'Passenger Car' },
        { name: 'Motorcycle' }
      ]
    }
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarsController],
      providers: [
        {
          provide: CarsService,
          useValue: {
            getCarsManufacturers: jest.fn().mockResolvedValue(mockManufacturers),
          },
        },
      ],
    }).compile();

    controller = module.get<CarsController>(CarsController);
    service = module.get<CarsService>(CarsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCarsManufacturers', () => {
    it('should return an array of manufacturers', async () => {
      const result = await controller.getCarsManufacturers();
      expect(result).toEqual(mockManufacturers);
      expect(service.getCarsManufacturers).toHaveBeenCalledTimes(1);
    });

    it('should return the correct structure for manufacturers', async () => {
      const result = await controller.getCarsManufacturers();
      expect(result[0]).toHaveProperty('country');
      expect(result[0]).toHaveProperty('countryCode');
      expect(result[0]).toHaveProperty('flagUrl');
      expect(result[0]).toHaveProperty('commonName');
      expect(result[0]).toHaveProperty('legalName');
      expect(result[0]).toHaveProperty('vehicleTypes');
      expect(Array.isArray(result[0].vehicleTypes)).toBe(true);
    });
  });
});
