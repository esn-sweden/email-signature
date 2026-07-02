export interface ESNOrgApi {
  label: string;
  code: string;
  email: string;
  website: string;
  country: string;
  cc: string;
  state: string;
  joined: string;
  address: {
    street_address: string;
    address_line1: string;
    address_line2: string;
    locality: string;
    postal_code: string;
    cc: string;
    country: string;
  };
  cities: [{ name: string; cc: string }];
  geolocation: {
    lat: number;
    lng: number;
    lat_sin: number;
    lat_cos: number;
    lng_rad: number;
  };

  university_name: string;
  university_website: string;
  updated: string;
  facebook: string;
  instagram: string;
  twitter: string;
  video: string;
  logo: string;
  status: boolean;
}
