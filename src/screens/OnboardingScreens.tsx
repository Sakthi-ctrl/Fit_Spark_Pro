import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  SafeAreaView 
} from "react-native";
import { useAppStore } from "../store/useAppStore";
import { COLORS, SIZES } from "../styles/theme";

export default function OnboardingScreens() {
  const setView = useAppStore((state) => state.setView);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Elevate Your",
      subtitle: "Training Level",
      description: "Step into the future of fitness. Access curated elite workout modules designed to sculpt, tone, and challenge your boundaries.",
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop",
      badge: "⚡ ELITE MODULES",
    },
    {
      title: "AI Personal",
      subtitle: "Fitness Coach",
      description: "Get real-time answers, tailored routine edits, and injury avoidance guidance powered by advanced intelligence 24/7.",
      image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=400&auto=format&fit=crop",
      badge: "🧠 COACH SPARKY",
    },
    {
      title: "Intelligent Diet",
      subtitle: "& Meal Tracking",
      description: "Log foods with a tap. Monitor macro distributions, hydration status, and generate AI-guided meals to hit your goals.",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=400&auto=format&fit=crop",
      badge: "🍏 SMART SCANNER",
    },
    {
      title: "Live Wearable",
      subtitle: "Health Sync",
      description: "Sync Apple Watch, Fitbit, or Samsung Health to track heart rates, daily steps, and workout burn volumes dynamically.",
      image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=400&auto=format&fit=crop",
      badge: "⌚ SMART SYNC",
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setView("auth");
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const activeStep = steps[currentStep];

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <View style={styles.logoRow}>
          <Text style={styles.logoSpark}>⚡</Text>
          <Text style={styles.logoTitle}>
            FIT<Text style={{ color: COLORS.primary }}>SPARK</Text>
          </Text>
        </View>

        {currentStep < steps.length - 1 && (
          <TouchableOpacity 
            onPress={() => setView("auth")}
            style={styles.skipBtn}
          >
            <Text style={styles.skipBtnText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Main Image Slider View */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: activeStep.image }}
          style={styles.slideImage}
          resizeMode="cover"
        />
        
        {/* Floating Accent Badge */}
        <View style={styles.floatingBadge}>
          <Text style={styles.floatingBadgeText}>{activeStep.badge}</Text>
        </View>
      </View>

      {/* Slide Explanatory Content */}
      <View style={styles.contentWrapper}>
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>
            {activeStep.title}{" "}
            <Text style={styles.subtitleText}>{activeStep.subtitle}</Text>
          </Text>
          <Text style={styles.descText}>{activeStep.description}</Text>
        </View>

        {/* Stepper Dots & Action Buttons */}
        <View style={styles.controlRow}>
          {/* Indicator dots */}
          <View style={styles.dotsRow}>
            {steps.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.dot,
                  idx === currentStep ? styles.dotActive : null
                ]}
              />
            ))}
          </View>

          {/* Nav buttons */}
          <View style={styles.btnRow}>
            {currentStep > 0 && (
              <TouchableOpacity 
                onPress={handlePrev}
                style={styles.backBtn}
              >
                <Text style={styles.backBtnText}>Back</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              onPress={handleNext}
              style={styles.nextBtn}
              activeOpacity={0.85}
            >
              <Text style={styles.nextBtnText}>
                {currentStep === steps.length - 1 ? "Get Started" : "Next"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "space-between",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoSpark: {
    fontSize: 16,
    marginRight: 4,
  },
  logoTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#FFF",
    letterSpacing: -0.5,
  },
  skipBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  skipBtnText: {
    fontSize: 10,
    fontWeight: "900",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  imageWrapper: {
    width: SIZES.width - 48,
    height: 340,
    borderRadius: SIZES.radius,
    overflow: "hidden",
    alignSelf: "center",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    position: "relative",
  },
  slideImage: {
    width: "100%",
    height: "100%",
  },
  floatingBadge: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  floatingBadgeText: {
    fontSize: 9,
    fontWeight: "900",
    color: COLORS.primary,
    letterSpacing: 1,
  },
  contentWrapper: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    marginTop: 20,
  },
  textContainer: {
    height: 120,
  },
  titleText: {
    fontSize: 22,
    fontWeight: "400",
    color: "#FFF",
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  subtitleText: {
    fontSize: 26,
    fontWeight: "900",
    color: COLORS.primary,
  },
  descText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginTop: 10,
  },
  controlRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
  },
  dotsRow: {
    flexDirection: "row",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    marginRight: 6,
  },
  dotActive: {
    width: 20,
    backgroundColor: COLORS.primary,
  },
  btnRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: {
    marginRight: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  backBtnText: {
    fontSize: 12,
    fontWeight: "900",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  nextBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 99,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  nextBtnText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#000",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
