import { router } from "expo-router";
import { Pressable } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';

const BackButton = () => {
    return (
        <Pressable onPress={() => router.back()}>
            <FontAwesome size={28} name="chevron-left" color="gray" />
        </Pressable>
    );
};

export default BackButton;
