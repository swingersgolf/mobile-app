interface Attribute {
  id: number;
  name: string;
}

interface User {
  id: string;
  name: string;
}

export default interface Round {
  course: string;
  when: string;
  attributes: Attribute[];
  users: User[];
}

export type { Attribute, User };
