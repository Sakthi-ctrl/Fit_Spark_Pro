import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView 
} from "react-native";
import { useAppStore } from "../store/useAppStore";
import { COLORS, SIZES } from "../styles/theme";

export default function HomeDashboard() {
  const user = useAppStore((state) => state.user);
  const setView = useAppStore((state) => state.setView);
  const todayChallengeCompleted = useAppStore((state) => state.todayChallengeCompleted);
  const toggleChallenge = useAppStore((state) => state.toggleChallenge);
  const streak = useAppStore((state) => state.streak);
  const foodLogs = useAppStore((state) => state.foodLogs);

  const [heartRate, setHeartRate] = useState(72);

  useEffect(() => {
    const hrInterval = setInterval(() => {
      setHeartRate((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2
        return Math.min(Math.max(prev + delta, 62), 92);
      });
    }, 1500);

    return () => clearInterval(hrInterval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        
        {/* Dynamic Header Greeting */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greetingMini}>WELCOME BACK</Text>
            <Text style={styles.greetingName}>
              Hey, <Text style={{ color: COLORS.primary }}>{user?.name || "Athlete"}</Text>
            </Text>
          </View>
          
          <View style={styles.streakRow}>
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>🔥 {streak}d</Text>
            </View>
            <TouchableOpacity 
              onPress={() => setView("profile")}
              style={styles.profileIndicator}
            >
              <Text style={styles.profileInitial}>
                {user?.name ? user.name[0].toUpperCase() : "A"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Statistics Grid */}
        <View style={styles.statsGrid}>
          {/* Calories */}
          <View style={styles.statCard}>
            <View style={styles.statCardHeader}>
              <Text style={styles.statEmoji}>🔥</Text>
              <Text style={styles.statLabel}>Burned</Text>
            </View>
            <View style={styles.statValueRow}>
              <Text style={styles.statVal}>480</Text>
              <Text style={styles.statUnit}> kcal</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressBar, { width: "60%", backgroundColor: COLORS.primary }]} />
            </View>
          </View>

          {/* Steps */}
          <View style={styles.statCard}>
            <View style={styles.statCardHeader}>
              <Text style={styles.statEmoji}>👣</Text>
              <Text style={styles.statLabel}>Steps</Text>
            </View>
            <View style={styles.statValueRow}>
              <Text style={styles.statVal}>8,420</Text>
              <Text style={styles.statUnit}> / 10k</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressBar, { width: "84%", backgroundColor: COLORS.secondary }]} />
            </View>
          </View>

          {/* Time */}
          <View style={styles.statCard}>
            <View style={styles.statCardHeader}>
              <Text style={styles.statEmoji}>⏳</Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>
            <View style={styles.statValueRow}>
              <Text style={styles.statVal}>45</Text>
              <Text style={styles.statUnit}> mins</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressBar, { width: "75%", backgroundColor: "#FFF" }]} />
            </View>
          </View>

          {/* Heart Rate */}
          <View style={styles.statCard}>
            <View style={styles.statCardHeader}>
              <Text style={[styles.statEmoji, { color: COLORS.red }]}>❤️</Text>
              <Text style={styles.statLabel}>Heart</Text>
            </View>
            <View style={styles.statValueRow}>
              <Text style={styles.statVal}>{heartRate}</Text>
              <Text style={[styles.statUnit, { color: COLORS.red, fontWeight: "900" }]}> bpm</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressBar, { width: "50%", backgroundColor: COLORS.red }]} />
            </View>
          </View>
        </View>

        {/* Quick actions panel */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionHeader}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            {[
              { label: "Workout", view: "workouts", icon: "🏋️", color: COLORS.primary },
              { label: "Nutrition", view: "nutrition", icon: "🍏", color: COLORS.secondary },
              { label: "Analytics", view: "analytics", icon: "📈", color: "#FFF" },
              { label: "AI Coach", view: "ai-trainer", icon: "🧠", color: COLORS.primary },
            ].map((act, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => setView(act.view)}
                style={styles.actionBtn}
                activeOpacity={0.8}
              >
                <Text style={[styles.actionIcon, { color: act.color }]}>{act.icon}</Text>
                <Text style={styles.actionLabel}>{act.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Today's Challenge */}
        <View style={styles.sectionBox}>
          <TouchableOpacity
            onPress={toggleChallenge}
            style={[
              styles.challengeCard,
              todayChallengeCompleted ? styles.challengeCardActive : null
            ]}
            activeOpacity={0.9}
          >
            <View style={styles.challengeLeft}>
              <View style={styles.challengeTitleRow}>
                <Text style={styles.challengeAlert}>⭐ DAILY CHALLENGE</Text>
              </View>
              <Text style={styles.challengeGoal}>100 Dynamic Squats</Text>
              <Text style={styles.challengeDesc}>Gain a +100XP level points boost on completion.</Text>
            </View>
            
            <View style={styles.checkIndicator}>
              {todayChallengeCompleted ? (
                <Text style={styles.checkIcon}>✓</Text>
              ) : (
                <View style={styles.checkEmpty} />
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Workout recommends slider */}
        <View style={styles.sectionBox}>
          <View style={styles.recommendsHeaderRow}>
            <Text style={styles.sectionHeader}>Featured Splits</Text>
            <TouchableOpacity onPress={() => setView("workouts")}>
              <Text style={styles.catalogLink}>Catalog →</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {[
              { title: "Iron Hypertrophy", level: "Advanced", time: "50m", tag: "Muscle", icon: "🏋️" },
              { title: "Metabolic Shred", level: "Intermediate", time: "30m", tag: "Fat Loss", icon: "🔥" },
              { title: "Calisthenic Flow", level: "Beginner", time: "35m", tag: "Home", icon: "🧘" },
            ].map((prog, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => setView("workouts")}
                style={styles.recommendCard}
                activeOpacity={0.85}
              >
                <View style={styles.recommendTagBox}>
                  <Text style={styles.recommendTag}>{prog.tag.toUpperCase()}</Text>
                </View>
                <Text style={styles.recommendIcon}>{prog.icon}</Text>
                <View>
                  <Text style={styles.recommendMeta}>{prog.level} • {prog.time}</Text>
                  <Text style={styles.recommendTitle}>{prog.title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Sync panel */}
        <View style={[styles.sectionBox, { marginBottom: 20 }]}>
          <View style={styles.wearableBanner}>
            <View style={styles.wearableLeft}>
              <Text style={styles.wearableIcon}>⌚</Text>
              <View>
                <Text style={styles.wearableTitle}>Active Wearable Sync</Text>
                <Text style={styles.wearableDesc}>Apple Watch connected and tracking live biometrics.</Text>
              </View>
            </View>
            <View style={styles.activeDot} />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    padding: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingTop: 10,
  },
  greetingMini: {
    fontSize: 9,
    fontWeight: "900",
    color: COLORS.textSecondary,
    letterSpacing: 1.5,
  },
  greetingName: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFF",
    letterSpacing: -0.5,
    marginTop: 2,
  },
  streakRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  streakBadge: {
    backgroundColor: "rgba(249, 115, 22, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(249, 115, 22, 0.25)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 99,
    marginRight: 10,
  },
  streakText: {
    fontSize: 11,
    fontWeight: "900",
    color: COLORS.orange,
  },
  profileIndicator: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  profileInitial: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    width: "48%",
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    padding: 16,
    height: 120,
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  statEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  statValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 6,
  },
  statVal: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FFF",
  },
  statUnit: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: "bold",
  },
  progressTrack: {
    width: "100%",
    height: 3,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 2,
    marginTop: 8,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
  },
  sectionBox: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: "900",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionBtn: {
    width: "23%",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  actionIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: COLORS.textSecondary,
  },
  challengeCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: "rgba(217, 255, 74, 0.15)",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  challengeCardActive: {
    backgroundColor: "rgba(217, 255, 74, 0.03)",
  },
  challengeLeft: {
    flex: 1,
    marginRight: 16,
  },
  challengeTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  challengeAlert: {
    fontSize: 8,
    fontWeight: "900",
    color: COLORS.primary,
    letterSpacing: 1,
  },
  challengeGoal: {
    fontSize: 14,
    fontWeight: "900",
    color: "#FFF",
    letterSpacing: -0.2,
  },
  challengeDesc: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  checkIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "rgba(217, 255, 74, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  checkIcon: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  checkEmpty: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  recommendsHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  catalogLink: {
    fontSize: 10,
    fontWeight: "900",
    color: COLORS.primary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  horizontalScroll: {
    paddingRight: 20,
  },
  recommendCard: {
    width: 160,
    height: 180,
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    padding: 16,
    justifyContent: "space-between",
    marginRight: 14,
  },
  recommendTagBox: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.primary,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  recommendTag: {
    fontSize: 8,
    fontWeight: "900",
    color: "#000",
  },
  recommendIcon: {
    fontSize: 32,
    alignSelf: "center",
  },
  recommendMeta: {
    fontSize: 9,
    fontWeight: "bold",
    color: COLORS.textSecondary,
  },
  recommendTitle: {
    fontSize: 12,
    fontWeight: "900",
    color: "#FFF",
    marginTop: 2,
  },
  wearableBanner: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  wearableLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 16,
  },
  wearableIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  wearableTitle: {
    fontSize: 11,
    fontWeight: "900",
    color: "#FFF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  wearableDesc: {
    fontSize: 9,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.secondary,
  },
});
