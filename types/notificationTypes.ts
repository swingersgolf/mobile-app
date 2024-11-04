export interface Notification {
  id: string; // big int as a string to handle large IDs safely
  userId: string; // Assuming varchar(255) translates to string
  type: "round_request" | "round_accepted" | "round_rejected"; // Enum types directly as literals
  data: Record<string, unknown>; // JSON data as a flexible object type
  readAt: Date | null; // Timestamp as Date object, or null if unread
  createdAt: Date; // Created timestamp as Date object
  updatedAt: Date; // Updated timestamp as Date object
}
