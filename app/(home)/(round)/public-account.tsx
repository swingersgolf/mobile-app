import { Text, View, ScrollView, Image, RefreshControl } from "react-native";
import accountStyles from "@/styles/accountStyles";
import { convertCamelCaseToLabel, labelFromStatus } from "@/utils/text";
import Spinner from "@/components/Spinner";
import SampleProfilePicture from "@/assets/images/sample_profile_picture.webp";
import GlobalStyles from "@/styles/GlobalStyles";
import { useCallback, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { PreferenceIcon } from "@/utils/icon";
import { PublicAccount } from "@/types/roundTypes";

const PublicAccountScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [publicAccount, setPublicAccount] = useState<PublicAccount | null>(
    null,
  );
  const { userId } = useLocalSearchParams();
  const { token } = useAuth();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const fetchPublicAccount = useCallback(async () => {
    try {
      console.log(`${apiUrl}/v1/public-account/${userId}`);
      const response = await axios.get(
        `${apiUrl}/v1/public-account/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setPublicAccount(response.data.data);
    } catch (error) {
      console.error("Error fetching account:", error);
    }
  }, [apiUrl, token, userId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPublicAccount();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchPublicAccount();
    }, [fetchPublicAccount]),
  );

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      style={accountStyles.scrollContainer}
      contentContainerStyle={accountStyles.scrollContainerContent}
    >
      {!publicAccount ? (
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
            <View style={accountStyles.profilePicture}>
              <Image
                source={SampleProfilePicture}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 9999,
                }}
                resizeMode="cover"
              />
            </View>
          </View>
          <View style={accountStyles.infoContainer}>
            <View style={accountStyles.headerContainer}>
              <Text style={GlobalStyles.h2}>Account</Text>
            </View>
            <View style={accountStyles.infoSection}>
              {publicAccount &&
                Object.entries(publicAccount)
                  .filter(([key]) => key !== "preferences")
                  .map(([key, value]) => (
                    <View key={`Account-${key}`} style={accountStyles.info}>
                      <Text style={GlobalStyles.body}>
                        {convertCamelCaseToLabel(key)}
                      </Text>
                      <Text style={GlobalStyles.body}>
                        {" "}
                        {value ? String(value) : "Not set"}
                      </Text>
                    </View>
                  ))}
            </View>
          </View>
          <View style={accountStyles.infoContainer}>
            <View style={accountStyles.headerContainer}>
              <Text style={GlobalStyles.h2}>Preferences</Text>
            </View>
            <View style={accountStyles.infoSection}>
              {publicAccount &&
              publicAccount.preferences &&
              publicAccount.preferences.length > 0 ? (
                publicAccount.preferences.map((preference) => (
                  <View
                    key={`preferences-${preference.id}`}
                    style={accountStyles.info}
                  >
                    <View style={accountStyles.preferenceLabel}>
                      <PreferenceIcon name={preference.name} />
                      <Text style={GlobalStyles.body}>
                        {convertCamelCaseToLabel(preference.name)}
                      </Text>
                    </View>
                    <Text style={GlobalStyles.body}>
                      {labelFromStatus(preference.status) || "Not set"}
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

export default PublicAccountScreen;
