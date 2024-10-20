interface Attribute {
  id: number;
  name: string;
  status: "preferred" | "disliked" | "indifferent";
}

interface Golfer {
  id: string;
  name: string;
}

interface RoundDetails {
  id: number;
  when: string;
  course: string;
  preferences: Attribute[];
  golfers: Golfer[];
  golfer_count: number;
  spots: number;
  user: Golfer;
}

interface Round {
  id: number;
  when: string;
  course: string;
  preferences: Attribute[];
  golfers: Golfer[];
  golfer_count: number;
  spots: number;
}

export type { Round, RoundDetails, Attribute, Golfer };
