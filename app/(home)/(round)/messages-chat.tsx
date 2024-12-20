import { colors } from "@/constants/Colors";
import {
  FlatList,
  KeyboardAvoidingView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";

const MessagesChatScreen = () => {
  // const { messageId } = useLocalSearchParams();
  // const { user } = useAuth();
  const user = {
    id: 1,
    name: "John Doe",
  };

  const [message, setMessage] = useState(""); // State to store the typed message
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "John Doe",
      message: "Hey, how are you?",
    },
    {
      id: 2,
      sender: "Jane Doe",
      message: "I'm good, thanks!",
    },
    {
      id: 3,
      sender: "John Doe",
      message: "Do you want to meet up?",
    },
    {
      id: 4,
      sender: "Jane Doe",
      message: "Sure, when?",
    },
    {
      id: 5,
      sender: "John Doe",
      message: "How about tomorrow?",
    },
    {
      id: 6,
      sender: "Jane Doe",
      message: "Sounds good!",
    },
    {
      id: 7,
      sender: "John Doe",
      message: "See you then!",
    },
    {
      id: 8,
      sender: "Jane Doe",
      message:
        "Bye! yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy",
    },
    {
      id: 9,
      sender: "John Doe",
      message: "Bye!",
    },
    {
      id: 10,
      sender: "Jane Doe",
      message: "Bye!",
    },
    {
      id: 11,
      sender: "John Doe",
      message: "Bye!",
    },
    {
      id: 12,
      sender: "Jane Doe",
      message: "Bye!",
    },
    {
      id: 13,
      sender: "John Doe",
      message: "Bye!",
    },
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1, // Increment the message id
        sender: user.name,
        message: message,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage(""); // Clear the input field after sending the message
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <FlatList
        data={messages}
        inverted
        contentContainerStyle={{
          padding: 10,
          gap: 5,
        }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              alignSelf: item.sender === user.name ? "flex-end" : "flex-start",
            }}
          >
            <Text
              style={{
                textAlign: item.sender === user.name ? "right" : "left",
                fontSize: 12,
                color: colors.neutral.medium,
              }}
            >
              {item.sender}
            </Text>

            <View
              style={{
                padding: 10,
                backgroundColor:
                  item.sender === user.name
                    ? colors.primary.light
                    : colors.neutral.medium,
                borderRadius: 10,
                maxWidth: "75%",
                alignSelf:
                  item.sender === user.name ? "flex-end" : "flex-start",
              }}
            >
              <Text>{item.message}</Text>
            </View>
          </View>
        )}
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
            style={{ width: "100%", height: "100%" }}
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            style={{
              position: "absolute",
              right: 5,
              top: 20,
              transform: [{ translateY: "-50%" }],
            }}
            disabled={!message.trim()}
          >
            <MaterialIcons
              name="telegram"
              size={30}
              color={
                message.trim() ? colors.primary.light : colors.neutral.medium
              }
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default MessagesChatScreen;
