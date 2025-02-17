interface Attribute {
  id: number;
  name: string;
  status: "preferred" | "disliked" | "indifferent";
}

interface Golfer {
  id: string;
  firstname: string;
  lastname: string;
  status: "accepted" | "pending" | "rejected";
  photo: string | null;
}

interface PublicAccount {
  date_of_birth: string | null;
  name: string;
  preferences: Attribute[];
  photo: string | null;
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

interface CreatePostValues {
  golfCourse: string;
  date: string;
  time_range: "early_bird" | "morning" | "afternoon" | "twilight";
  slots: string;
  preferences: {
    [key: string]: string;
  };
}

export type {
  Round,
  RoundDetails,
  Attribute,
  Golfer,
  PublicAccount,
  CreatePostValues,
};
