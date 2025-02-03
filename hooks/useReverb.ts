import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

type MessageEvent = {
  event: string;
  data?: unknown;
};

type UseReverbProps = {
  messageGroupId: string;
};

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

export function useReverb({ messageGroupId }: UseReverbProps) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [socketId, setSocketId] = useState<string | null>(null);

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
        const messageData: MessageEvent = JSON.parse(event.data);
        console.log("📩 Received event:", messageData);

        if (messageData.event === "pusher:ping") {
          ws.send(JSON.stringify({ event: "pusher:pong" }));
        }

        if (messageData.event === "pusher:connection_established") {
          console.log("MESSAGE DATA: ", messageData);
          const newSocketId = JSON.parse(messageData.data as string).socket_id;
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

        if (messageData.event === "message.sent") {
          console.log("📨 New private message:", messageData.data);
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
      ws.close();
    };
  }, [messageGroupId, token, wsUrl]); // Re-run effect when messageGroupId changes

  return { socket, socketId };
}
