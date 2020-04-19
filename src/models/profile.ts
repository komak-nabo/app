interface Location {
  type: 'Point';
  coordinates: [number, number];
}
export class Address {
  raw?: string;
  extra?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  location: Location;
}

interface Phone {
  dialCode?: string;
  number: string;
}

export interface Group {
  createdAt?: string;
  name: string;
  url?: string;
}

export interface Profile {
  _id?: string;
  self?: boolean;
  firstName: string;
  lastName: string;
  address: Address;
  role: 'helper' | 'needer';
  phone: Phone;
  group?: Group;
}
