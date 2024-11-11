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
}

export interface Preference {
  status: string;
  preference_id: string;
  preference_name: string;
}
