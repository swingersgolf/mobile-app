import { Slot } from 'expo-router';
import BackButton from '@/components/BackButton';
import { SafeAreaView } from 'react-native';
import Icon from '@/assets/branding/Icon.svg';

export default function UnauthorizedLayout() {
  return (
    <>
      <SafeAreaView>
        <BackButton/>
        <Icon height={100} width={100}/>
      </SafeAreaView>
      <Slot />
    </>
  );
}
