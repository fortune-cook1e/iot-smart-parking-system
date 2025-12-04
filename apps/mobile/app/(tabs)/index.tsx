import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import AuthForm from '@/components/AuthForm';

export default function HomeScreen() {
  const handleAuthSuccess = () => {
    console.log('Authentication successful!');
    // Todo: Navigate to the main app screen or perform other actions
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
