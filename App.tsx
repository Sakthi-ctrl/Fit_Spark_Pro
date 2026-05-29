import React from "react";
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView 
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useAppStore } from "./src/store/useAppStore";
import { COLORS } from "./src/styles/theme";

// Screens imports
import SplashScreen from "./src/screens/SplashScreen";
import OnboardingScreens from "./src/screens/OnboardingScreens";
import AuthScreen from "./src/screens/AuthScreen";
import HomeDashboard from "./src/screens/HomeDashboard";
import WorkoutPrograms from "./src/screens/WorkoutPrograms";
import WorkoutDetailPage from "./src/screens/WorkoutDetailPage";
import AITrainer from "./src/screens/AITrainer";
import NutritionTracker from "./src/screens/NutritionTracker";
import ProgressAnalytics from "./src/screens/ProgressAnalytics";
import SubscriptionScreen from "./src/screens/SubscriptionScreen";
import ProfileScreen from "./src/screens/ProfileScreen";

export default function App() {
  const currentView = useAppStore((state) => state.currentView);
  const setView = useAppStore((state) => state.setView);

  const renderActiveScreen = () => {
    switch (currentView) {
      case "splash":
        return <SplashScreen />;
      case "onboarding":
        return <OnboardingScreens />;
      case "auth":
      case "otp":
        return <AuthScreen />;
      case "dashboard":
        return <HomeDashboard />;
      case "workouts":
        return <WorkoutPrograms />;
      case "workout-detail":
        return <WorkoutDetailPage />;
      case "ai-trainer":
        return <AITrainer />;
      case "nutrition":
        return <NutritionTracker />;
      case "analytics":
        return <ProgressAnalytics />;
      case "subscription":
        return <SubscriptionScreen />;
      case "profile":
        return <ProfileScreen />;
      default:
        return <HomeDashboard />;
    }
  };

  const isTabBarVisible = [
    "dashboard",
    "workouts",
    "ai-trainer",
    "nutrition",
    "profile"
  ].includes(currentView);

  const tabs = [
    { view: "dashboard", label: "Home", icon: "🏠" },
    { view: "workouts", label: "Workouts", icon: "🏋️" },
    { view: "ai-trainer", label: "AI Coach", icon: "🧠" },
    { view: "nutrition", label: "Diet", icon: "🍏" },
    { view: "profile", label: "Profile", icon: "👤" },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Active Screen Viewport */}
      <View style={styles.screenWrapper}>
        {renderActiveScreen()}
      </View>

      {/* Global Tab Drawer */}
      {isTabBarVisible && (
        <SafeAreaView style={styles.tabSafeArea}>
          <View style={styles.tabBar}>
            {tabs.map((tab) => {
              const isActive = currentView === tab.view || (tab.view === "workouts" && currentView === "workout-detail");
              return (
                <TouchableOpacity
                  key={tab.view}
                  onPress={() => setView(tab.view)}
                  style={styles.tabBtn}
                  activeOpacity={0.8}
                >
                  <View style={[
                    styles.tabIconBg,
                    isActive ? styles.tabIconBgActive : null
                  ]}>
                    <Text style={styles.tabIconText}>{tab.icon}</Text>
                  </View>
                  <Text style={[
                    styles.tabLabelText,
                    isActive ? styles.tabLabelTextActive : null
                  ]}>{tab.label}</Text>

                  {isActive && <View style={styles.activeDot} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </SafeAreaView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  screenWrapper: {
    flex: 1,
    width: "100%",
  },
  tabSafeArea: {
    backgroundColor: "#121217",
  },
  tabBar: {
    height: 64,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
    backgroundColor: "#121217",
    paddingBottom: 4,
  },
  tabBtn: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 54,
    position: "relative",
  },
  tabIconBg: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  tabIconBgActive: {
    backgroundColor: "rgba(217, 255, 74, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(217, 255, 74, 0.15)",
  },
  tabIconText: {
    fontSize: 16,
  },
  tabLabelText: {
    fontSize: 8,
    fontWeight: "bold",
    color: COLORS.textSecondary,
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tabLabelTextActive: {
    color: COLORS.primary,
  },
  activeDot: {
    position: "absolute",
    top: -2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },
});
