import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import AuthForm from '@/components/AuthForm';

export default function LoginScreen() {
  const router = useRouter();

  const handleAuthSuccess = () => {
    // Navigate to the parking screen after successful login/register
    router.push('/(tabs)/parking');
  };

  return (
    <View style={styles.container}>
      <AuthForm onSuccess={handleAuthSuccess} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
