import { Text, View, Pressable } from 'react-native';
import { Link } from 'expo-router';

export default function SignIn() {
  return (
    <View className='flex-1 justify-center items-center'>
      <Text className='text-lg mb-4'>
        Landing Screen
      </Text>
      <Link href="/sign-in" asChild>
        <Pressable className='mb-2'>
          <Text className='text-blue-500'>Sign In</Text>
        </Pressable>
      </Link>
      <Link href="/create-account" asChild>
        <Pressable>
          <Text className='text-blue-500'>Create Account</Text>
        </Pressable>
      </Link>
    </View>
  );
}
