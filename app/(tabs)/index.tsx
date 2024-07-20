import { Text, View, StyleSheet } from 'react-native';
import { useSession } from '../../ctx';

const Index = () => {
  const { signOut } = useSession();
  return (
    <View style={styles.container}>
      <Text
        onPress={() => {
          // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
          signOut();
        }}>
        Sign Out
      </Text>
    </View>
  );
}

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
