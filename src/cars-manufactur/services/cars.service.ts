import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, catchError, map, throwError } from 'rxjs';
import { Manufacturer, NHTSAResponse } from '../models/manufacturer.model';

@Injectable()
export class CarsService {
  private readonly API_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles/GetAllManufacturers?format=json';
  constructor(private readonly httpService: HttpService) {}

  async getCarsManufacturers(): Promise<Manufacturer[]> {
    try {
      const data = await lastValueFrom(
        this.httpService.get<NHTSAResponse>(this.API_URL).pipe(
          map((res) => res.data),
          catchError((err) => {
            return throwError(() => new HttpException(
              'Error al obtener datos de fabricantes de vehículos',
              HttpStatus.BAD_GATEWAY
            ));
          })
        )
      );
      return await Promise.all(data.Results.map((item) => this.mapToManufacturer(item)));
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async mapToManufacturer(item: any): Promise<Manufacturer> {
    return {
      country: this.removeTextBetweenParentheses(item.Country), 
      countryCode: await this.getCountryCode(item.Country),
      flagUrl: await this.getFlagUrl(item.Country),
      commonName: item.Mfr_CommonName ?? this.cleanName(item.Mfr_Name),
      legalName: item.Mfr_Name,
      vehicleTypes: (item.VehicleTypes || []).map((vehicleType) => ({ name: vehicleType.Name }))
    };
  } 

  private cleanName(name: string): string {
    return name
      .replace(/\b(,?\s*(inc|co|company|corporation|ltd|llc|gmbh|s\.a\.?|ag))\.?\b/gi, '')
      .replace(/\s{2,}/g, ' ') 
      .replace(/\s*,\s*/g, ' ') 
      .replace(/\./g, '') 
      .trim()
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private removeTextBetweenParentheses(text: string): string {
    if (!text) return '';
    return text.replace(/\(.*?\)/g, '').trim();
  }

  private async getFlagUrl(country: string): Promise<string> {
    const countryCode = await this.getCountryCode(country);
    return `https://flagcdn.com/w80/${countryCode.toLowerCase()}.png`;
  }

  private async getCountryCode(country: string): Promise<string> {
    if (!country) return '';
    
    try {
      // Limpiar el nombre del país antes de hacer la consulta
      const cleanCountry = this.removeTextBetweenParentheses(country).trim();
      if (!cleanCountry) return '';

      const response = await lastValueFrom(
        this.httpService.get<any>(`https://restcountries.com/v3.1/name/${encodeURIComponent(cleanCountry)}?fields=cca2`).pipe(
          catchError((err) => {
            console.warn(`No se pudo obtener código de país para: ${cleanCountry}`, err.message);
            return throwError(() => new Error(`País no encontrado: ${cleanCountry}`));
          })
        )
      );

      // Validar que la respuesta tenga datos
      if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
        console.warn(`No se encontró código de país para: ${cleanCountry}`);
        return '';
      }

      return response.data[0].cca2 || '';
    } catch (error) {
      console.warn(`Error al obtener código de país para ${country}:`, error.message);
      return ''; // Retornar string vacío en lugar de fallar
    }
  }
}
