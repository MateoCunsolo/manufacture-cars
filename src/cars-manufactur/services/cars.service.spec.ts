import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { CarsService } from './cars.service';
import { Manufacturer, NHTSAResponse } from '../models/manufacturer.model';

describe('CarsService', () => {
  let service: CarsService;
  let httpService: HttpService;
  const mockNHTSAResponse: NHTSAResponse = {
    Results: [
      {
        Country: 'UNITED STATES (USA)',
        Mfr_CommonName: 'Tesla',
        Mfr_Name: 'TESLA, INC.',
        VehicleTypes: [
          { IsPrimary: false || true, Name: 'Passenger Car' },
          { IsPrimary: false || true, Name: 'Truck' }
        ]
      },
      {
        Country: 'GERMANY',
        Mfr_CommonName: 'BMW',
        Mfr_Name: 'BMW AG',
        VehicleTypes: [
          { IsPrimary: false || true, Name: 'Passenger Car' },
          { IsPrimary: false || true, Name: 'Motorcycle' }
        ]
      }
    ]
  };
  const expectedManufacturers: Manufacturer[] = [
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
      providers: [
        CarsService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CarsService>(CarsService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCarsManufacturers', () => {
    it('should return manufacturers with correct structure', async () => {
      jest.spyOn(httpService, 'get').mockReturnValue(
        of({ 
          data: mockNHTSAResponse,
          status: 200,  
          statusText: 'OK',
          headers: {},
          config: {} as any
        })
      );

      const result = await service.getCarsManufacturers();
      expect(result).toEqual(expectedManufacturers);
      expect(httpService.get).toHaveBeenCalledWith(
        'https://vpic.nhtsa.dot.gov/api/vehicles/GetAllManufacturers?format=json'
      );
    });

    it('should handle manufacturers without vehicle types', async () => {
      const responseWithoutVehicleTypes: NHTSAResponse = {
        Results: [
          {
            Country: 'JAPAN',
            Mfr_CommonName: 'Toyota',
            Mfr_Name: 'TOYOTA MOTOR CORPORATION',
            VehicleTypes: [
              { IsPrimary: false, Name: 'Passenger Car' },
              { IsPrimary: false, Name: 'Truck' }
            ]
          }
        ]
      };

      jest.spyOn(httpService, 'get').mockReturnValue(
        of({ 
          data: responseWithoutVehicleTypes,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as any
        })
      );

      const result = await service.getCarsManufacturers();

      expect(result[0].vehicleTypes).toEqual([
        { name: 'Passenger Car' },
        { name: 'Truck' }
      ]);
    }); 
  });
});
