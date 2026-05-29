import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  ActivityIndicator
} from "react-native";
import { useAppStore } from "../store/useAppStore";
import { COLORS, SIZES } from "../styles/theme";

export default function ProgressAnalytics() {
  const xp = useAppStore((state) => state.xp);
  const badges = useAppStore((state) => state.badges);
  const wearables = useAppStore((state) => state.wearables);
  const syncDevice = useAppStore((state) => state.syncDevice);

  const [activeRange, setActiveRange] = useState<"Weekly" | "Monthly">("Weekly");
  const [activeMetric, setActiveMetric] = useState<"Weight" | "Calories">("Calories");
  const [syncingDevice, setSyncingDevice] = useState<string | null>(null);

  const handleSync = (device: "AppleWatch" | "GoogleFit" | "Fitbit" | "SamsungHealth") => {
    setSyncingDevice(device);
    
    setTimeout(() => {
      syncDevice(device);
      setSyncingDevice(null);
    }, 1500);
  };

  const weeklyDataset = activeMetric === "Calories" 
    ? [320, 480, 290, 390, 520, 410, 480] 
    : [78.6, 78.4, 78.3, 78.1, 78.2, 77.9, 78.0];

  const labels = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerBar}>
          <View>
            <Text style={styles.miniLabel}>STATISTICS</Text>
            <Text style={styles.titleText}>
              PROGRESS <Text style={{ color: COLORS.primary }}>CENTER</Text>
            </Text>
          </View>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabToggleRow}>
          <View style={styles.toggleLeft}>
            {["Calories", "Weight"].map((met) => (
              <TouchableOpacity
                key={met}
                onPress={() => setActiveMetric(met as any)}
                style={[
                  styles.metToggleBtn,
                  activeMetric === met ? styles.metToggleBtnActive : null
                ]}
              >
                <Text style={[
                  styles.metToggleText,
                  activeMetric === met ? styles.metToggleTextActive : null
                ]}>{met.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.toggleRight}>
            {["Weekly", "Monthly"].map((rng) => (
              <TouchableOpacity
                key={rng}
                onPress={() => setActiveRange(rng as any)}
                style={[
                  styles.rangeBtn,
                  activeRange === rng ? styles.rangeBtnActive : null
                ]}
              >
                <Text style={[
                  styles.rangeBtnText,
                  activeRange === rng ? styles.rangeBtnTextActive : null
                ]}>{rng}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Custom Visual Bar Graph */}
        <View style={styles.sectionBox}>
          <View style={styles.chartCard}>
            <View style={styles.chartTop}>
              <View>
                <Text style={styles.chartMini}>WEEKLY AVERAGE</Text>
                <Text style={styles.chartAvgText}>
                  {activeMetric === "Calories" ? "420 kcal" : "78.2 kg"}
                </Text>
              </View>
              <View style={styles.trendRow}>
                <Text style={styles.trendText}>📈 +4.2%</Text>
              </View>
            </View>

            {/* Custom bar grid mockup */}
            <View style={styles.chartVisualWrapper}>
              {weeklyDataset.map((val, idx) => {
                const maxVal = activeMetric === "Calories" ? 600 : 82;
                const minVal = activeMetric === "Calories" ? 100 : 75;
                const percentage = ((val - minVal) / (maxVal - minVal)) * 100;

                return (
                  <View key={idx} style={styles.chartColumn}>
                    <View style={styles.columnTrack}>
                      <View style={[styles.columnBar, { height: `${Math.min(percentage, 100)}%` }]} />
                    </View>
                    <Text style={styles.columnLabel}>{labels[idx]}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Achievements Level Card */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Achievements Vault</Text>
          
          <View style={styles.achieveCard}>
            <View style={styles.levelRow}>
              <View>
                <Text style={styles.levelMini}>LEVEL PROGRESS</Text>
                <Text style={styles.levelText}>Tier 2 Elite Athlete</Text>
              </View>
              <Text style={styles.xpText}>{xp} XP</Text>
            </View>

            <View style={styles.levelTrack}>
              <View style={[styles.levelBar, { width: `${(xp % 1000) / 10}%` }]} />
            </View>

            {/* Badges Locker */}
            <View style={styles.badgesLockerGrid}>
              {badges.map((b) => (
                <View key={b.id} style={styles.badgeItem}>
                  <Text style={styles.badgeEmoji}>{b.icon}</Text>
                  <Text style={styles.badgeTitle}>{b.title.toUpperCase()}</Text>
                  <Text style={styles.badgeMeta}>{b.date}</Text>
                </View>
              ))}

              <View style={[styles.badgeItem, { opacity: 0.35 }]}>
                <Text style={styles.badgeEmoji}>🔒</Text>
                <Text style={styles.badgeTitle}>IRON TITAN</Text>
                <Text style={styles.badgeMeta}>Locked</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Wearable syncer controls */}
        <View style={[styles.sectionBox, { marginBottom: 30 }]}>
          <Text style={styles.sectionTitle}>Smart Wearables Sync</Text>
          
          <View style={styles.wearablesGrid}>
            {[
              { id: "AppleWatch", label: "Apple Watch", icon: "⌚" },
              { id: "GoogleFit", label: "Google Fit", icon: "❤️" },
              { id: "Fitbit", label: "Fitbit Spark", icon: "🔋" },
              { id: "SamsungHealth", label: "Samsung Health", icon: "🌀" },
            ].map((device) => {
              const isConnected = wearables[device.id as keyof typeof wearables];
              const isSyncing = syncingDevice === device.id;

              return (
                <View key={device.id} style={styles.wearableCard}>
                  <View style={styles.wearableCardTop}>
                    <Text style={styles.wearableCardEmoji}>{device.icon}</Text>
                    {isSyncing ? (
                      <ActivityIndicator size="small" color={COLORS.primary} />
                    ) : (
                      <View style={[styles.wearableIndicatorDot, isConnected ? styles.dotConnected : null]} />
                    )}
                  </View>

                  <View style={styles.wearableCardBottom}>
                    <Text style={styles.wearableCardLabel}>{device.label}</Text>
                    <TouchableOpacity
                      onPress={() => handleSync(device.id as any)}
                      disabled={isSyncing}
                    >
                      <Text style={styles.syncLinkText}>
                        {isSyncing ? "Syncing..." : isConnected ? "Synced • Sync Now" : "Connect"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
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
  headerBar: {
    marginBottom: 20,
    paddingTop: 10,
  },
  miniLabel: {
    fontSize: 9,
    fontWeight: "900",
    color: COLORS.textSecondary,
    letterSpacing: 1.5,
  },
  titleText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFF",
    letterSpacing: -0.5,
    marginTop: 2,
  },
  tabToggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
  },
  toggleLeft: {
    flexDirection: "row",
  },
  metToggleBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  metToggleBtnActive: {
    backgroundColor: COLORS.primary,
  },
  metToggleText: {
    fontSize: 9,
    fontWeight: "900",
    color: COLORS.textSecondary,
  },
  metToggleTextActive: {
    color: "#000",
  },
  toggleRight: {
    flexDirection: "row",
  },
  rangeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  rangeBtnActive: {
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  rangeBtnText: {
    fontSize: 8,
    color: COLORS.textSecondary,
    fontWeight: "bold",
  },
  rangeBtnTextActive: {
    color: "#FFF",
  },
  sectionBox: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "900",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  chartCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    padding: 16,
  },
  chartTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  chartMini: {
    fontSize: 8,
    fontWeight: "900",
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  chartAvgText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFF",
    marginTop: 2,
  },
  trendRow: {
    backgroundColor: "rgba(217, 255, 74, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(217, 255, 74, 0.15)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  trendText: {
    fontSize: 9,
    fontWeight: "900",
    color: COLORS.primary,
  },
  chartVisualWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 120,
    paddingHorizontal: 8,
  },
  chartColumn: {
    alignItems: "center",
    width: "10%",
  },
  columnTrack: {
    width: 6,
    height: 90,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 3,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  columnBar: {
    width: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  columnLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: COLORS.textSecondary,
    marginTop: 6,
  },
  achieveCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    padding: 16,
  },
  levelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  levelMini: {
    fontSize: 8,
    fontWeight: "900",
    color: COLORS.textSecondary,
  },
  levelText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#FFF",
  },
  xpText: {
    fontSize: 12,
    fontWeight: "900",
    color: COLORS.primary,
  },
  levelTrack: {
    width: "100%",
    height: 6,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 20,
  },
  levelBar: {
    height: "100%",
    backgroundColor: COLORS.primary,
  },
  badgesLockerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
    paddingTop: 16,
  },
  badgeItem: {
    width: "23%",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
    borderRadius: 16,
    paddingVertical: 10,
    alignItems: "center",
  },
  badgeEmoji: {
    fontSize: 20,
  },
  badgeTitle: {
    fontSize: 7,
    fontWeight: "900",
    color: "#FFF",
    marginTop: 6,
    textAlign: "center",
  },
  badgeMeta: {
    fontSize: 6,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  wearablesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  wearableCard: {
    width: "48%",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    padding: 16,
    height: 100,
    justifyContent: "space-between",
    marginBottom: 16,
  },
  wearableCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  wearableCardEmoji: {
    fontSize: 20,
  },
  wearableIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  dotConnected: {
    backgroundColor: COLORS.secondary,
  },
  wearableCardBottom: {
    marginTop: 6,
  },
  wearableCardLabel: {
    fontSize: 10,
    fontWeight: "900",
    color: "#FFF",
  },
  syncLinkText: {
    fontSize: 8,
    fontWeight: "900",
    color: COLORS.primary,
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
