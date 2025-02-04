import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

interface MessageEvent {
  event: string;
  data: string;
}

interface UseReverbProps {
  messageGroupId: string;
}

async function getAuthSignature(
  channelName: string,
  socketId: string,
  token: string | null,
): Promise<{ auth: string } | null> {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_LARAVEL_HOST}/broadcasting/auth`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          socket_id: socketId,
          channel_name: channelName,
        }),
      },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Authentication failed:", error);
    return null;
  }
}

interface Message {
  id: number;
  message: string;
  message_group_id: number;
  user: {
    id: string;
    firstname: string;
    lastname: string;
  };
  created_at: string;
  updated_at: string;
}

export function useReverb({ messageGroupId }: UseReverbProps) {
  const [, setSocket] = useState<WebSocket | null>(null);
  const [, setSocketId] = useState<string | null>(null);
  const [messageData, setMessageData] = useState<Message | null>(null); // ✅ Added state for message data

  const wsUrl = `${process.env.EXPO_PUBLIC_REVERB_SCHEME}://${process.env.EXPO_PUBLIC_REVERB_HOST}:${process.env.EXPO_PUBLIC_REVERB_PORT}/app/${process.env.EXPO_PUBLIC_REVERB_APP_KEY}`;
  const { token } = useAuth();

  useEffect(() => {
    const ws = new WebSocket(wsUrl);
    setSocket(ws);

    ws.onopen = () => {
      console.log("CONNECTED TO REVERB WEBSOCKET SERVER");
    };

    ws.onmessage = async (event) => {
      try {
        console.log("EVENT DATA: ", event.data);
        const message: MessageEvent = JSON.parse(event.data);
        console.log("📩 Received event:", message);

        if (message.event === "pusher:ping") {
          ws.send(JSON.stringify({ event: "pusher:pong" }));
        }

        if (message.event === "pusher:connection_established") {
          console.log("MESSAGE DATA: ", message);
          const newSocketId = JSON.parse(message.data).socket_id;
          setSocketId(newSocketId);
          console.log(`🔑 Received socket_id: ${newSocketId}`);

          const privateChannel = `private-message-group.${messageGroupId}`;
          const authResponse = await getAuthSignature(
            privateChannel,
            newSocketId,
            token,
          );

          if (!authResponse) {
            console.error("❌ Could not authenticate private channel.");
            return;
          }

          ws.send(
            JSON.stringify({
              event: "pusher:subscribe",
              data: { channel: privateChannel, auth: authResponse.auth },
            }),
          );
          console.log(`📡 Subscribed to ${privateChannel} channel`);
        }

        if (message.event === "message.sent") {
          console.log("📨 New private message:", message.data);
          setMessageData(JSON.parse(message.data)); // ✅ Store the received message in state
        }
      } catch (error) {
        console.error("❌ Error parsing message:", error);
      }
    };

    ws.onerror = (error) => console.error("❌ WebSocket error:", error);
    ws.onclose = () => {
      console.log("❌ Connection closed. Reconnecting in 5 seconds...");
      setTimeout(() => setSocket(new WebSocket(wsUrl)), 5000);
    };

    return () => {
      console.log("Closing websocket");
      ws.close();
    };
  }, [messageGroupId, token, wsUrl]); // Re-run effect when messageGroupId changes

  return { messageData }; // ✅ Returning messageData
}
