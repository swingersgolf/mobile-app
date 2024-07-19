import { Text, View, Pressable } from 'react-native';
import { Link } from 'expo-router';
import NavButton from '@/components/NavButton';

export default function SignIn() {
  return (
    <View className='flex-1 justify-center items-center'>
      <Text className='text-lg mb-4'>
        Landing Screen
      </Text>
      <NavButton text='Sign In' route='/sign-in'/>
      <NavButton text='Create Account' route='/create-account' outline/>
    </View>
  );
}
