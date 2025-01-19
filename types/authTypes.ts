export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  birthdate: string;
}

export interface Profile {
  handicap?: number;
  postalCode?: string;
  longitude?: number;
  latitude?: number;
  photo?: string;
}

export interface Preference {
  status: string;
  preference_id: number;
  preference_name: string;
}

export interface Preferences {
  preferences: Preference[];
}
