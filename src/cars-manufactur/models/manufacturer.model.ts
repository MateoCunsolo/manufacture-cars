export interface VehicleType {
  name: string;
}

export interface Manufacturer {
  country: string;
  countryCode: string;
  flagUrl: string;
  commonName: string;
  legalName: string;
  vehicleTypes: VehicleType[];
}

export interface NHTSAResponse {
  Results: Array<{
    Country: string;
    Mfr_CommonName: string;
    Mfr_Name: string;
    VehicleTypes?: Array<{ IsPrimary: boolean; Name: string }>;
  }>;
} 