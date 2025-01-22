import { useAuth } from "@/contexts/AuthContext";
import {
  Text,
  View,
  ScrollView,
  Image,
  RefreshControl,
  TouchableOpacity,
  // FlatList,
} from "react-native";
import accountStyles from "@/styles/accountStyles";
import { convertCamelCaseToLabel, labelFromStatus } from "@/utils/text";
import Spinner from "@/components/Spinner";
import GlobalStyles from "@/styles/GlobalStyles";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { PreferenceIcon } from "@/utils/icon";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/constants/Colors";
import { router } from "expo-router";
import PlaceholderProfilePicture from "@/assets/images/profile-picture-placeholder.png";

const AccountScreen = () => {
  const {
    user,
    profile,
    preferences,
    fetchPreferences,
    fetchProfile,
    fetchUser,
    updateProfilePicture,
  } = useAuth();

  const [refreshing, setRefreshing] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUser();
    await fetchProfile();
    await fetchPreferences();
    setRefreshing(false);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access media library is required!");
      return;
    }

    const newImage = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!newImage.canceled) {
      console.log("New image", newImage);
      updateProfilePicture(newImage.assets[0].uri);
    }
  };

  const handleImageError = () => {
    setImageError(true); // Set to true when image fails to load
  };

  // const myRounds = [
  //   {
  //     id: 1,
  //     date: "2025-01-18",
  //     time_range: "morning",
  //     course: "Sunnyvale Golf Course",
  //     preferences: [
  //       { id: 1, name: "No smoking", status: "preferred" },
  //       { id: 2, name: "No pets", status: "disliked" },
  //     ],
  //     golfers: [
  //       {
  //         id: "g1",
  //         name: "John Doe",
  //         status: "accepted",
  //         photo: "https://example.com/photos/john.jpg",
  //       },
  //       {
  //         id: "g2",
  //         name: "Jane Smith",
  //         status: "pending",
  //         photo: null,
  //       },
  //     ],
  //     golfer_count: 2,
  //     group_size: 4,
  //     user: {
  //       id: "u1",
  //       name: "Alice Johnson",
  //       status: "accepted",
  //       photo: "https://example.com/photos/alice.jpg",
  //     },
  //     host_id: "u1",
  //     distance: 5.3,
  //   },
  //   {
  //     id: 2,
  //     date: "2025-01-20",
  //     time_range: "afternoon",
  //     course: "Pebble Beach Golf Links",
  //     preferences: [
  //       { id: 3, name: "Cart required", status: "indifferent" },
  //       { id: 4, name: "Quiet play", status: "preferred" },
  //     ],
  //     golfers: [
  //       {
  //         id: "g3",
  //         name: "Robert Lee",
  //         status: "rejected",
  //         photo: "https://example.com/photos/robert.jpg",
  //       },
  //       {
  //         id: "g4",
  //         name: "Emily Davis",
  //         status: "accepted",
  //         photo: "https://example.com/photos/emily.jpg",
  //       },
  //     ],
  //     golfer_count: 3,
  //     group_size: 4,
  //     user: {
  //       id: "u2",
  //       name: "Chris Walker",
  //       status: "accepted",
  //       photo: null,
  //     },
  //     host_id: "u2",
  //     distance: 18.7,
  //   },
  //   {
  //     id: 3,
  //     date: "2025-01-20",
  //     time_range: "afternoon",
  //     course: "Pebble Beach Golf Links",
  //     preferences: [
  //       { id: 3, name: "Cart required", status: "indifferent" },
  //       { id: 4, name: "Quiet play", status: "preferred" },
  //     ],
  //     golfers: [
  //       {
  //         id: "g3",
  //         name: "Robert Lee",
  //         status: "rejected",
  //         photo: "https://example.com/photos/robert.jpg",
  //       },
  //       {
  //         id: "g4",
  //         name: "Emily Davis",
  //         status: "accepted",
  //         photo: "https://example.com/photos/emily.jpg",
  //       },
  //     ],
  //     golfer_count: 3,
  //     group_size: 4,
  //     user: {
  //       id: "u2",
  //       name: "Chris Walker",
  //       status: "accepted",
  //       photo: null,
  //     },
  //     host_id: "u2",
  //     distance: 18.7,
  //   },
  // ];

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      style={accountStyles.scrollContainer}
      contentContainerStyle={accountStyles.scrollContainerContent}
    >
      {!user || !profile ? (
        <View style={accountStyles.spinnerContainer}>
          <Spinner />
        </View>
      ) : (
        <>
          <View
            style={[
              accountStyles.infoContainer,
              accountStyles.pictureContainer,
            ]}
          >
            <TouchableOpacity onPress={pickImage}>
              <View style={accountStyles.profilePicture}>
                <Image
                  source={
                    imageError || !profile?.photo
                      ? PlaceholderProfilePicture
                      : { uri: profile.photo }
                  }
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 9999,
                  }}
                  resizeMode="cover"
                  onError={handleImageError}
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* My Rounds Info */}
          {/* {myRounds && myRounds.length > 0 && (
            <View style={accountStyles.infoContainer}>
              <Text style={GlobalStyles.h2}>My Rounds</Text>
              <FlatList
                data={myRounds}
                horizontal
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={accountStyles.roundCard}
                    onPress={() =>
                      router.replace({
                        pathname: "/(home)/(round)/details",
                        params: item.id,
                      })
                    }
                  >
                    <Text style={GlobalStyles.h3}>{item.course}</Text>
                    <Text style={GlobalStyles.body}>{item.date}</Text>
                    <Text style={GlobalStyles.body}>
                      {convertCamelCaseToLabel(item.time_range)}
                    </Text>
                  </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={accountStyles.horizontalFlatlist}
              />
            </View>
          )} */}

          {/* User info */}
          <View style={accountStyles.infoContainer}>
            <Text style={GlobalStyles.h2}>User</Text>
            <View style={accountStyles.infoSection}>
              {user &&
                Object.entries(user)
                  .filter(([key]) => key !== "id" && key !== "expo_push_token")
                  .map(([key, value]) => (
                    <View key={`user-${key}`} style={accountStyles.info}>
                      <Text style={GlobalStyles.body}>
                        {convertCamelCaseToLabel(key)}
                      </Text>
                      <Text style={GlobalStyles.body}>
                        {value ? value : "Not set"}
                      </Text>
                    </View>
                  ))}
            </View>
          </View>

          {/* Profile Info */}
          <View style={accountStyles.infoContainer}>
            <View style={accountStyles.headerContainer}>
              <Text style={GlobalStyles.h2}>Profile</Text>
              <TouchableOpacity onPress={() => router.push("edit-profile")}>
                <MaterialIcons
                  name="edit"
                  size={16}
                  color={colors.neutral.dark}
                />
              </TouchableOpacity>
            </View>
            <View style={accountStyles.infoSection}>
              {profile &&
                Object.entries(profile)
                  .filter(
                    ([key]) =>
                      key !== "latitude" &&
                      key !== "longitude" &&
                      key !== "photo",
                  )
                  .map(([key, value]) => (
                    <View key={`profile-${key}`} style={accountStyles.info}>
                      <Text style={GlobalStyles.body}>
                        {convertCamelCaseToLabel(key)}
                      </Text>
                      <Text style={GlobalStyles.body}>
                        {value ? value : "Not set"}
                      </Text>
                    </View>
                  ))}
            </View>
          </View>

          <View style={accountStyles.infoContainer}>
            <View style={accountStyles.headerContainer}>
              <Text style={GlobalStyles.h2}>Preferences</Text>
              <TouchableOpacity onPress={() => router.push("edit-preferences")}>
                <MaterialIcons
                  name="edit"
                  size={16}
                  color={colors.neutral.dark}
                />
              </TouchableOpacity>
            </View>
            <View style={accountStyles.infoSection}>
              {preferences && preferences.length > 0 ? (
                preferences.map((preference) => (
                  <View
                    key={`preferences-${preference.preference_id}}`}
                    style={accountStyles.info}
                  >
                    <View style={accountStyles.preferenceLabel}>
                      <PreferenceIcon name={preference.preference_name} />
                      <Text style={GlobalStyles.body}>
                        {convertCamelCaseToLabel(preference.preference_name)}
                      </Text>
                    </View>

                    <Text style={GlobalStyles.body}>
                      {labelFromStatus(preference.status)
                        ? labelFromStatus(preference.status)
                        : "Not set"}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={GlobalStyles.body}>No preferences set</Text>
              )}
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default AccountScreen;
