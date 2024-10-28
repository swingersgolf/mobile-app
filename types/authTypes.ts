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
