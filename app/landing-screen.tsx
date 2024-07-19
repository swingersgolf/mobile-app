import { View, StyleSheet } from 'react-native';
import NavButton from '@/components/NavButton';
import BannerLogo from '@/assets/branding/BannerLogo.svg';

export default function SignIn() {
  return (
    <View style={styles.container}>
      <BannerLogo width={300} height={75} />
      <View style={styles.buttonsContainer}>
        <NavButton text='Sign In' route='/sign-in' />
        <NavButton text='Create Account' route='/create-account' outline />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    gap: 4,
    paddingHorizontal: 12,
  },
});
