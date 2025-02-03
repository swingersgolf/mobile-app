import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalSearchParams } from "expo-router";
import {
  RefreshControl,
  FlatList,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import GlobalStyles from "@/styles/GlobalStyles";
import { colors } from "@/constants/Colors";
import { useReverb } from "@/app/hooks/useReverb";

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

const MessagesChatScreen = () => {
  const { user, token } = useAuth();
  const { messageGroupId } = useLocalSearchParams();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [messagesFetched, setMessagesFetched] = useState(false); // Track if messages have been fetched

  useReverb({
    messageGroupId: messageGroupId.toString(),
  });

  const fetchMessages = useCallback(async () => {
    if (!messageGroupId || !token) return;

    try {
      setLoading(true); // Start loading
      const response = await axios.get(`${apiUrl}/v1/message`, {
        params: { message_group_id: messageGroupId },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessages(response.data.data); // Set the messages array
      setMessagesFetched(true); // Set messagesFetched to true after first load
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Failed to load messages.");
    } finally {
      setLoading(false); // Stop loading
    }
  }, [messageGroupId, token, apiUrl]);

  // Call fetchMessages when the screen comes into focus only if it hasn't been fetched yet
  useFocusEffect(
    useCallback(() => {
      if (!messagesFetched) {
        fetchMessages(); // Fetch only once on initial page load
      }
    }, [messagesFetched, fetchMessages]),
  );

  // Handle refresh functionality
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMessages(); // Fetch messages again on pull-to-refresh
    setRefreshing(false);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !token || !messageGroupId) return;

    setSending(true);
    try {
      await axios.post(
        `${apiUrl}/v1/message`,
        {
          message_group_id: messageGroupId,
          message: message.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <FlatList
        data={messages}
        contentContainerStyle={{ padding: 10, gap: 5 }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              alignSelf: item.user.id === user?.id ? "flex-end" : "flex-start",
            }}
          >
            <Text
              style={{
                textAlign: item.user.id === user?.id ? "right" : "left",
                fontSize: 12,
                color: colors.neutral.medium,
              }}
            >
              {item.user.firstname}&nbsp;{item.user.lastname}
            </Text>

            <View
              style={{
                padding: 10,
                backgroundColor:
                  item.user.id === user?.id
                    ? colors.primary.light
                    : colors.neutral.light,
                borderRadius: 10,
                maxWidth: "75%",
                alignSelf:
                  item.user.id === user?.id ? "flex-end" : "flex-start",
              }}
            >
              <Text style={GlobalStyles.body}>{item.message}</Text>
            </View>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.select({ ios: 100, android: 500 })}
        style={{
          width: "100%",
          padding: 10,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.background.primary,
          bottom: 10,
        }}
      >
        <View
          style={{
            padding: 10,
            borderWidth: 1,
            borderColor: colors.neutral.medium,
            borderRadius: 10,
            width: "100%",
            position: "relative",
            height: 40,
          }}
        >
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            placeholderTextColor={colors.neutral.medium}
            style={[{ width: "100%", height: "100%" }, GlobalStyles.body]}
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            style={{
              position: "absolute",
              right: 5,
              top: 19,
              transform: [{ translateY: "-50%" }],
            }}
            disabled={sending || !message.trim()}
          >
            {sending ? (
              <ActivityIndicator size="small" color={colors.primary.light} />
            ) : (
              <MaterialIcons
                name="telegram"
                size={30}
                color={
                  message.trim() ? colors.primary.light : colors.neutral.medium
                }
              />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default MessagesChatScreen;
