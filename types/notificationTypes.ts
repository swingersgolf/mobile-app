export interface Notification {
  id: string; // big int as a string to handle large IDs safely
  user_id: string; // Assuming varchar(255) translates to string
  data: NotificationData; // JSON data as a flexible object type
  read_at: Date | null; // Timestamp as Date object, or null if unread
  created_at: Date; // Created timestamp as Date object
  updated_at: Date; // Updated timestamp as Date object
}

export interface NotificationData {
  to: string; // User ID as a string
  title: string; // Notification title as a string
  body: string; // Notification body as a string
  data: Record<string, unknown>; // JSON data as a flexible object type
}
