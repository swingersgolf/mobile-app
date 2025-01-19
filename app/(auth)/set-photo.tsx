import { View, Text, Image } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as ImagePicker from "expo-image-picker";
import * as Yup from "yup";
import accountStyles from "@/styles/accountStyles";
import TextButton from "@/components/TextButton";
import { colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import Alert, { InFormAlert } from "@/components/Alert";
import { router } from "expo-router";
import GlobalStyles from "@/styles/GlobalStyles";
import PlaceholderProfilePicture from "@/assets/images/profile-picture-placeholder.png";

const setPhotoSchema = Yup.object().shape({
  photo: Yup.string().required("A profile photo is required."),
});

const SetPhotoScreen = () => {
  const { profile, updateProfilePicture } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    trigger,
  } = useForm({
    resolver: yupResolver(setPhotoSchema),
    defaultValues: {
      photo: profile?.photo || "",
    },
  });

  const pickImageFromLibrary = async () => {
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
      setValue("photo", result.assets[0].uri);
      trigger("photo"); // Trigger validation for the "photo" field
    }
  };

  const takePhotoWithCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access the camera is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setValue("photo", result.assets[0].uri);
      trigger("photo"); // Trigger validation for the "photo" field
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleSaveChanges = async (data: { photo: string }) => {
    setLoading(true);
    setError("");
    console.log(data.photo);
    try {
      await updateProfilePicture(data.photo);
      router.push("set-profile");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(
          error.response.data.message ||
            "Failed to update profile photo. Please try again.",
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={accountStyles.container}>
      {!profile || loading ? (
        <View style={accountStyles.spinnerContainer}>
          <Spinner />
        </View>
      ) : (
        <>
          <View>
            <Text style={GlobalStyles.h1}>Set Your Photo</Text>
          </View>

          <Controller
            control={control}
            name="photo"
            render={({ field: { value } }) => (
              <View style={accountStyles.pictureContainer}>
                <Image
                  source={
                    imageError || !value
                      ? PlaceholderProfilePicture
                      : { uri: value }
                  }
                  style={{
                    width: 240,
                    height: 240,
                    borderRadius: 9999,
                  }}
                  resizeMode="cover"
                  onError={handleImageError}
                />
              </View>
            )}
          />

          <View style={accountStyles.buttonContainer}>
            <TextButton
              text="Choose from Library"
              onPress={pickImageFromLibrary}
              textColor={colors.button.secondary.text}
              backgroundColor={colors.button.primary.background}
              outline
            />
            <TextButton
              text="Take a Photo"
              onPress={takePhotoWithCamera}
              textColor={colors.button.secondary.text}
              backgroundColor={colors.button.secondary.background}
              outline
            />
          </View>

          {errors.photo && <InFormAlert error={errors.photo.message} />}
          {error && <Alert error={error} />}

          <View style={accountStyles.buttonContainer}>
            <TextButton
              text="Continue"
              onPress={handleSubmit(handleSaveChanges)}
              textColor={
                isValid ? colors.button.primary.text : colors.neutral.dark
              }
              backgroundColor={
                isValid
                  ? colors.button.primary.background
                  : colors.neutral.medium
              }
              disabled={!isValid}
            />
          </View>
        </>
      )}
    </View>
  );
};

export default SetPhotoScreen;
