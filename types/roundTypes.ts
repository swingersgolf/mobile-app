interface Attribute {
  id: number;
  name: string;
  status: "preferred" | "disliked" | "indifferent";
}

interface Golfer {
  id: string;
  name: string;
  status: "accepted" | "pending" | "rejected";
}

interface RoundDetails {
  id: number;
  when: string;
  course: string;
  preferences: Attribute[];
  golfers: Golfer[];
  golfer_count: number;
  group_size: number;
  user: Golfer;
  host_id: string;
}

interface Round {
  id: number;
  when: string;
  course: string;
  preferences: Attribute[];
  golfers: Golfer[];
  golfer_count: number;
  group_size: number;
}

export type { Round, RoundDetails, Attribute, Golfer };
