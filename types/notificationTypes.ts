import { UnknownInputParams } from "expo-router";

export interface Notification {
  id: string; // big int as a string to handle large IDs safely
  user_id: string; // Assuming varchar(255) translates to string
  data: NotificationData; // JSON data as a flexible object type
  read_at: Date | null; // Timestamp as Date object, or null if unread
  title: string; // Notification title as a string
  body: string; // Notification body as a string
  created_at: Date; // Created timestamp as Date object
  updated_at: Date; // Updated timestamp as Date object
}

export interface NotificationData {
  to: string; // User ID as a string
  data: NotificationDataData; // JSON data as a flexible object type
}

export interface NotificationDataData {
  type: string; // Notification type as a string
  route: string; // Route as a string
  params: UnknownInputParams; // JSON data as a flexible object type
}
