import TextButton from "@/components/TextButton";
import { colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import { Text, View, ScrollView, Image } from "react-native";
import accountStyles from "@/styles/accountStyles";
import { convertCamelCaseToLabel } from "@/utils/text";
import Spinner from "@/components/Spinner";
import SampleProfilePicture from "@/assets/images/sample_profile_picture.webp";
import GlobalStyles from "@/styles/GlobalStyles";

const AccountScreen = () => {
  const { user, profile } = useAuth();

  return (
    <ScrollView>
      <View style={accountStyles.container}>
        {!user || !profile ? (
          <View style={accountStyles.spinnerContainer}>
            <Spinner />
          </View>
        ) : (
          <>
            <View style={accountStyles.accountContainer}>
              <View
                style={[
                  accountStyles.infoContainer,
                  accountStyles.pictureContainer,
                ]}
              >
                <View style={accountStyles.profilePicture}>
                  {/* <Text>Profile picture</Text> */}
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
              <View style={accountStyles.accountContent}>
                <View style={accountStyles.infoContainer}>
                  <Text style={GlobalStyles.h2}>User</Text>
                  {user &&
                    Object.entries(user).map(([key, value]) => (
                      <View key={key} style={accountStyles.info}>
                        <Text style={GlobalStyles.body}>
                          {convertCamelCaseToLabel(key)}
                        </Text>
                        <Text style={GlobalStyles.body}>{value}</Text>
                      </View>
                    ))}
                </View>
                <View style={accountStyles.infoContainer}>
                  <Text style={GlobalStyles.h2}>Profile</Text>
                  {profile &&
                    Object.entries(profile).map(([key, value]) => (
                      <View key={key} style={accountStyles.info}>
                        <Text style={GlobalStyles.body}>
                          {convertCamelCaseToLabel(key)}
                        </Text>
                        <Text style={GlobalStyles.body}>{value}</Text>
                      </View>
                    ))}
                </View>
              </View>
              <View style={accountStyles.paddedButtonContainer}>
                {user && profile && (
                  <TextButton
                    text={"Edit profile"}
                    onPress={() => router.push("edit")}
                    textColor={colors.neutral.light}
                    backgroundColor={colors.primary.default}
                    fontSize={16}
                  />
                )}
              </View>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default AccountScreen;
