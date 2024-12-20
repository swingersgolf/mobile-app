import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { colors } from "@/constants/Colors";
import { getTimeElapsed } from "@/utils/date";
import ProfilePicturePlaceholder from "@/assets/images/profile-picture-placeholder.png";
import { router } from "expo-router";

const MessagesScreen = () => {
  const messages = [
    {
      id: 1,
      sender: "Alice Johnson",
      lastMessage: "Hey, how's it going?",
      lastMessageTimestamp: "2024-12-20T10:15:30Z",
    },
    {
      id: 2,
      sender: "Bob Smith",
      lastMessage: "Did you finish the report?",
      lastMessageTimestamp: "2022-12-20T11:45:00Z",
    },
    {
      id: 3,
      sender: "Charlie Brown",
      lastMessage: "Sure, let's catch up tomorrow.",
      lastMessageTimestamp: "2024-08-19T08:25:10Z",
    },
    {
      id: 4,
      sender: "Dana White",
      lastMessage: "Long time no see! Hope you're doing well.",
      lastMessageTimestamp: "2024-11-18T18:35:45Z",
    },
    {
      id: 5,
      sender: "Evelyn Wright",
      lastMessage: "Yes, I'll be there at 7 PM.",
      lastMessageTimestamp: "2012-12-20T07:20:15Z",
    },
    {
      id: 6,
      sender: "Franklin Adams",
      lastMessage: "Please let me know if you have any updates on the project.",
      lastMessageTimestamp: "2023-12-19T14:10:50Z",
    },
    {
      id: 7,
      sender: "Grace Lee",
      lastMessage: "That's great news! Congratulations!",
      lastMessageTimestamp: "2023-12-19T16:40:05Z",
    },
    {
      id: 8,
      sender: "Henry Morgan",
      lastMessage: "Can we reschedule the meeting to next week?",
      lastMessageTimestamp: "2023-12-18T12:30:00Z",
    },
    {
      id: 9,
      sender: "Irene Carter",
      lastMessage: "Okay, see you then!",
      lastMessageTimestamp: "2023-12-17T09:45:25Z",
    },
    {
      id: 10,
      sender: "Jack Wilson",
      lastMessage: "Hey, just checking in. Have a minute?",
      lastMessageTimestamp: "2023-12-20T06:50:10Z",
    },
    {
      id: 11,
      sender: "Karen Hill",
      lastMessage: "Can you send me the details, please?",
      lastMessageTimestamp: "2023-12-19T20:10:30Z",
    },
    {
      id: 12,
      sender: "Leonard Cooper",
      lastMessage: "I'll call you later to discuss the plans.",
      lastMessageTimestamp: "2023-12-19T22:05:00Z",
    },
    {
      id: 13,
      sender: "Monica Bell",
      lastMessage: "Haha, that's so funny!",
      lastMessageTimestamp: "2023-12-18T15:25:45Z",
    },
    {
      id: 14,
      sender: "Nathan Young",
      lastMessage: "Yes, I'll take care of it by tomorrow.",
      lastMessageTimestamp: "2023-12-18T08:10:30Z",
    },
    {
      id: 15,
      sender: "Olivia Davis",
      lastMessage: "I just got your message. Let me check and get back to you.",
      lastMessageTimestamp: "2023-12-20T13:55:15Z",
    },
    {
      id: 16,
      sender: "Paul Walker",
      lastMessage: "Hey, how are you doing? It's been a while!",
      lastMessageTimestamp: "2023-12-17T19:35:00Z",
    },
    {
      id: 17,
      sender: "Quinn Taylor",
      lastMessage: "Sure thing. I'll handle it.",
      lastMessageTimestamp: "2023-12-20T09:20:40Z",
    },
    {
      id: 18,
      sender: "Rachel Green",
      lastMessage:
        "Long message ahead: Let's discuss the itinerary in detail. We need to finalize the schedule by the end of the week to ensure everything is on track. Let me know your availability.",
      lastMessageTimestamp: "2023-12-18T14:55:30Z",
    },
    {
      id: 19,
      sender: "Steve Brown",
      lastMessage: "I'll get back to you on this shortly.",
      lastMessageTimestamp: "2023-12-20T05:40:10Z",
    },
    {
      id: 20,
      sender: "Tina Lopez",
      lastMessage: "Quick reminder: Don't forget about the deadline tomorrow!",
      lastMessageTimestamp: "2023-12-19T17:25:15Z",
    },
  ];

  const handleMessagePress = ({ id }: { id: number }) => {
    router.push({
      pathname: "messages-chat",
      params: { messageId: id },
    });
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              padding: 10,
              gap: 10,
              height: 70,
              width: "100%",
              flexDirection: "row",
              display: "flex",
              alignItems: "center",
              backgroundColor: colors.background.primary,
            }}
            onPress={() => handleMessagePress({ id: item.id })}
          >
            {/* Host profile picture */}
            <View>
              <Image
                source={ProfilePicturePlaceholder}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 9999,
                }}
                resizeMode="cover"
              />
            </View>
            {/* Message details */}
            <View style={{ flex: 1 }}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontWeight: "500",
                }}
              >
                {item.sender}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    flexShrink: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.lastMessage}
                </Text>
                {item.lastMessageTimestamp && (
                  <Text
                    style={{
                      color: colors.neutral.medium,
                      marginLeft: 4,
                      flexShrink: 0,
                    }}
                  >
                    {getTimeElapsed(new Date(item.lastMessageTimestamp))}
                  </Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default MessagesScreen;
