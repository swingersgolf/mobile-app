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

interface PublicAccount {
  date_of_birth: string | null;
  name: string;
  preferences: Attribute[];
}

interface RoundDetails {
  id: number;
  date: string;
  time_range: "early_bird" | "morning" | "afternoon" | "twilight";
  course: string;
  preferences: Attribute[];
  golfers: Golfer[];
  golfer_count: number;
  group_size: number;
  user: Golfer;
  host_id: string;
  distance: number;
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

export type { Round, RoundDetails, Attribute, Golfer, PublicAccount };
