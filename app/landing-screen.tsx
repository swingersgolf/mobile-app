import { Text, View } from 'react-native';
import NavButton from '@/components/NavButton';
import BannerLogo from '@/assets/images/BannerLogo.svg';

export default function SignIn() {
  return (
    <View className='flex-1 justify-center items-center'>
      <BannerLogo width={250}/>
      <NavButton text='Sign In' route='/sign-in'/>
      <NavButton text='Create Account' route='/create-account' outline/>
    </View>
  );
}
