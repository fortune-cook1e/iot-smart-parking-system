import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth';
import { HelloWave } from '@/components/hello-wave';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();
  const [activeFeature, setActiveFeature] = useState(0);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // If already authenticated, navigate to the main page
    // if (isAuthenticated) {
    //   router.replace('/(tabs)/parking');
    //   return;
    // }

    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();

    // Rotating animation loop
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 25000,
        useNativeDriver: true,
      })
    ).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -15,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Shimmer animation
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    // switch active feature every 3 seconds
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 3);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  const handleGetStarted = () => {
    // add button press animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    router.push('/login');
  };

  if (isLoading) {
    return null;
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.decorativeCircle1,
              {
                transform: [{ rotate: spin }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.decorativeCircle2,
              {
                transform: [{ rotate: spin }],
              },
            ]}
          />

          {/* Logo  */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }, { translateY: slideAnim }, { perspective: 1000 }],
              },
            ]}
          >
            <Animated.View
              style={[
                styles.logoCircle,
                {
                  transform: [{ translateY: floatAnim }],
                },
              ]}
            >
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.1)']}
                style={styles.logoGradient}
              >
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                  <Ionicons name="car-sport" size={60} color="#fff" />
                </Animated.View>
              </LinearGradient>
              {/* Shimmer effect */}
              <Animated.View
                style={[
                  styles.shimmer,
                  {
                    transform: [{ translateX: shimmerTranslate }],
                  },
                ]}
              />
            </Animated.View>
            <Text style={styles.title}>
              Smart <Text style={styles.titleAccent}>Parking</Text>
            </Text>
            <View style={styles.subtitleContainer}>
              <Ionicons name="location" size={16} color="rgba(255, 255, 255, 0.9)" />
              <Text style={styles.subtitle}>Your Perfect Parking Solution</Text>
            </View>
          </Animated.View>

          {/* Feature cards -  */}
          <Animated.View
            style={[
              styles.featuresContainer,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <View style={styles.featureRow}>
              <View style={styles.featureMiniCard}>
                <View style={styles.featureMiniIcon}>
                  <Ionicons name="location" size={28} color="#667eea" />
                </View>
                <Text style={styles.featureMiniTitle}>Real-time</Text>
              </View>

              <View style={styles.featureMiniCard}>
                <View style={styles.featureMiniIcon}>
                  <Ionicons name="notifications" size={28} color="#667eea" />
                </View>
                <Text style={styles.featureMiniTitle}>Alerts</Text>
              </View>

              <View style={styles.featureMiniCard}>
                <View style={styles.featureMiniIcon}>
                  <Ionicons name="time" size={28} color="#667eea" />
                </View>
                <Text style={styles.featureMiniTitle}>Save Time</Text>
              </View>
            </View>
          </Animated.View>

          {/* CTA Buttons */}
          <Animated.View
            style={[
              styles.ctaContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleGetStarted}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#fff', '#f8f8f8']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.buttonContent}>
                  <Text style={styles.primaryButtonText}>Get Started</Text>
                  <Ionicons name="arrow-forward-circle" size={26} color="#667eea" />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push('/(tabs)/parking')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#fff', '#f8f8f8']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.buttonContent}>
                  <Text style={styles.primaryButtonText}>Go to Parking</Text>
                  <Ionicons name="arrow-forward-circle" size={26} color="#667eea" />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleGetStarted}
              activeOpacity={0.7}
            >
              <View style={styles.secondaryButtonContent}>
                <Ionicons name="log-in-outline" size={20} color="#fff" />
                <Text style={styles.secondaryButtonText}>Sign In</Text>
              </View>
            </TouchableOpacity> */}
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 350,
    height: 350,
    borderRadius: 175,
    overflow: 'hidden',
    top: -120,
    right: -120,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    overflow: 'hidden',
    bottom: 80,
    left: -80,
  },
  decorativeCircle3: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    top: height / 2,
    right: -50,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  logoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logoGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 70,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: 100,
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  titleAccent: {
    color: '#FFE66D',
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    fontWeight: '600',
  },
  featuresContainer: {
    marginBottom: 30,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  featureMiniCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  featureMiniIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureMiniTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  featureCard: {
    borderRadius: 24,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  featureCardActive: {
    shadowColor: '#4158D0',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  featureCardGradient: {
    padding: 28,
    borderRadius: 24,
  },
  featureIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featureTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  featureDescription: {
    fontSize: 15,
    color: '#666',
    lineHeight: 24,
    fontWeight: '500',
  },
  activeIndicator: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  activeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  ctaContainer: {
    marginTop: 30,
    marginBottom: 30,
  },
  primaryButton: {
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 14,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 28,
    borderRadius: 18,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  buttonGlow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: -1,
  },
  primaryButtonText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#667eea',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    paddingVertical: 16,
  },
  secondaryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  secondaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  secondaryButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
  swipeHint: {
    alignItems: 'center',
    marginTop: 30,
  },
  swipeHintText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
    marginTop: 4,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  dotContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dotActive: {
    backgroundColor: '#fff',
    width: 24,
  },
  footerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
});
