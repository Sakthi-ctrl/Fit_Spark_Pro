import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ImageBackground, 
  TouchableOpacity, 
  ActivityIndicator 
} from "react-native";
import { useAppStore } from "../store/useAppStore";
import { COLORS } from "../styles/theme";

export default function SplashScreen() {
  const setView = useAppStore((state) => state.setView);
  const [taglineProgress, setTaglineProgress] = useState("");
  const tagline = "Transform Your Body. Elevate Your Life.";

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < tagline.length) {
        setTaglineProgress((prev) => prev + tagline[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 50);

    const timer = setTimeout(() => {
      setView("onboarding");
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [setView]);

  return (
    <ImageBackground
      source={{ uri: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop" }}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      {/* Dynamic dark overlays */}
      <View style={styles.overlay} />

      <View style={styles.headerSpacer} />

      {/* Brand & taglines */}
      <View style={styles.brandContainer}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>
            FIT<Text style={styles.logoTextHighlight}>SPARK</Text>
            <Text style={styles.logoTextMini}> PRO</Text>
          </Text>
        </View>

        <View style={styles.taglineBox}>
          <Text style={styles.taglineText}>
            {taglineProgress}
            <Text style={styles.cursor}>|</Text>
          </Text>
        </View>
      </View>

      {/* Loader indicator */}
      <View style={styles.footerContainer}>
        <ActivityIndicator size="small" color={COLORS.primary} style={styles.loader} />
        
        <TouchableOpacity
          onPress={() => setView("onboarding")}
          style={styles.skipButton}
          activeOpacity={0.8}
        >
          <Text style={styles.skipText}>Tap to Skip</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(11, 11, 13, 0.75)",
  },
  headerSpacer: {
    height: 40,
  },
  brandContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoBadge: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: "rgba(217, 255, 74, 0.2)",
  },
  logoText: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFF",
    letterSpacing: -1,
  },
  logoTextHighlight: {
    color: COLORS.primary,
  },
  logoTextMini: {
    fontSize: 10,
    fontWeight: "bold",
    color: COLORS.secondary,
  },
  taglineBox: {
    marginTop: 20,
    height: 50,
    justifyContent: "center",
  },
  taglineText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    textAlign: "center",
  },
  cursor: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
  footerContainer: {
    width: "100%",
    alignItems: "center",
    paddingBottom: 40,
  },
  loader: {
    marginBottom: 24,
  },
  skipButton: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 99,
  },
  skipText: {
    fontSize: 10,
    fontWeight: "900",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
});
