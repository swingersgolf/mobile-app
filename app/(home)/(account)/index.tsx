import { useAuth } from "@/contexts/AuthContext";
import {
  Text,
  View,
  ScrollView,
  Image,
  RefreshControl,
  TouchableOpacity,
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
import ProfilePicturePlaceholder from "@/assets/images/profile-picture-placeholder.png";

const AccountScreen = () => {
  const {
    user,
    profile,
    preferences,
    fetchPreferences,
    fetchProfile,
    fetchUser,
    setProfilePicture,
  } = useAuth();

  const [refreshing, setRefreshing] = useState(false);

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

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const newImageUri = result.assets[0].uri;
      setProfilePicture(newImageUri); // Update via AuthContext
    }
  };

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
                    profile.picture
                      ? { uri: profile.picture }
                      : ProfilePicturePlaceholder
                  }
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 9999,
                  }}
                  resizeMode="cover"
                />
              </View>
            </TouchableOpacity>
          </View>

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
                      key !== "picture",
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
