import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  Modal
} from "react-native";
import { useAppStore, FoodItem } from "../store/useAppStore";
import { COLORS, SIZES } from "../styles/theme";

export default function NutritionTracker() {
  const foodLogs = useAppStore((state) => state.foodLogs);
  const addFood = useAppStore((state) => state.addFood);
  const waterLogged = useAppStore((state) => state.waterLogged);
  const waterGoal = useAppStore((state) => state.waterGoal);
  const addWater = useAppStore((state) => state.addWater);
  const caloriesGoal = useAppStore((state) => state.caloriesGoal);

  const [searchQuery, setSearchQuery] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scannerStatus, setScannerStatus] = useState("Aligning lens...");

  const preDefinedFoods: Omit<FoodItem, "id">[] = [
    { name: "Double Scoop Whey Shake", calories: 280, protein: 50, carbs: 6, fat: 3, mealType: "Snack" },
    { name: "Brown Rice with Turkey Mince", calories: 510, protein: 38, carbs: 60, fat: 10, mealType: "Lunch" },
    { name: "Almond Butter & Banana", calories: 240, protein: 6, carbs: 28, fat: 12, mealType: "Breakfast" },
    { name: "Baked Salmon & Broccoli", calories: 450, protein: 42, carbs: 12, fat: 24, mealType: "Dinner" },
  ];

  // Calculate Macros
  const loggedCalories = foodLogs.reduce((sum, item) => sum + item.calories, 0);
  const loggedProtein = foodLogs.reduce((sum, item) => sum + item.protein, 0);
  const loggedCarbs = foodLogs.reduce((sum, item) => sum + item.carbs, 0);
  const loggedFat = foodLogs.reduce((sum, item) => sum + item.fat, 0);

  const targetProtein = 160;
  const targetCarbs = 260;
  const targetFat = 80;

  const handleAddCustomFood = (food: Omit<FoodItem, "id">) => {
    addFood(food);
  };

  const handleLaunchScanner = () => {
    setShowScanner(true);
    setScanProgress(0);
    setScannerStatus("Scanning laser alignments...");

    setTimeout(() => {
      setScanProgress(50);
      setScannerStatus("Decoding barcode matrix...");
    }, 1000);

    setTimeout(() => {
      setScanProgress(100);
      setScannerStatus("Whey Shake Loaded!");
    }, 2000);

    setTimeout(() => {
      addFood({
        name: "Premium Elite Whey Isolate (Vanilla)",
        calories: 320,
        protein: 55,
        carbs: 4,
        fat: 2,
        mealType: "Snack",
      });
      setShowScanner(false);
    }, 2700);
  };

  const filteredFoods = preDefinedFoods.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header bar */}
        <View style={styles.headerBar}>
          <View>
            <Text style={styles.miniLabel}>DIETARY JOURNAL</Text>
            <Text style={styles.titleText}>
              NUTRITION <Text style={{ color: COLORS.primary }}>TRACKER</Text>
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleLaunchScanner}
            style={styles.scanBtn}
            activeOpacity={0.8}
          >
            <Text style={styles.scanBtnText}>📸 SCAN BARCODE</Text>
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <View style={styles.searchBox}>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            placeholder="Search healthy oats, eggs, rice split..."
            placeholderTextColor="rgba(255,255,255,0.25)"
          />
        </View>

        {/* Calories details macros card */}
        <View style={styles.sectionBox}>
          <View style={styles.macrosCard}>
            <View style={styles.macrosTop}>
              <View>
                <Text style={styles.macroMini}>CALORIE BUDGET</Text>
                <Text style={styles.caloriesCount}>{loggedCalories}</Text>
                <Text style={styles.caloriesTotal}>/ {caloriesGoal} kcal</Text>
              </View>

              <View style={styles.macrosRing}>
                <Text style={styles.ringPercentage}>{Math.round((loggedCalories / caloriesGoal) * 100)}%</Text>
                <Text style={styles.ringLabel}>BUDGET</Text>
              </View>
            </View>

            {/* Macro bars */}
            <View style={styles.macroBarsRow}>
              <View style={styles.barGroup}>
                <View style={styles.barHeader}>
                  <Text style={styles.barLabel}>PROTEIN</Text>
                  <Text style={styles.barVal}>{loggedProtein}g / 160g</Text>
                </View>
                <View style={styles.track}>
                  <View style={[styles.bar, { width: `${Math.min((loggedProtein / targetProtein) * 100, 100)}%`, backgroundColor: COLORS.primary }]} />
                </View>
              </View>

              <View style={styles.barGroup}>
                <View style={styles.barHeader}>
                  <Text style={styles.barLabel}>CARBS</Text>
                  <Text style={styles.barVal}>{loggedCarbs}g / 260g</Text>
                </View>
                <View style={styles.track}>
                  <View style={[styles.bar, { width: `${Math.min((loggedCarbs / targetCarbs) * 100, 100)}%`, backgroundColor: COLORS.secondary }]} />
                </View>
              </View>

              <View style={styles.barGroup}>
                <View style={styles.barHeader}>
                  <Text style={styles.barLabel}>FATS</Text>
                  <Text style={styles.barVal}>{loggedFat}g / 80g</Text>
                </View>
                <View style={styles.track}>
                  <View style={[styles.bar, { width: `${Math.min((loggedFat / targetFat) * 100, 100)}%`, backgroundColor: "#FFF" }]} />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Hydration tracking bar */}
        <View style={styles.sectionBox}>
          <View style={styles.waterCard}>
            <View>
              <Text style={styles.waterTitle}>💧 Water Log</Text>
              <Text style={styles.waterValue}>{waterLogged} ml</Text>
              <Text style={styles.waterTotal}>Goal: {waterGoal} ml</Text>
            </View>

            <View style={styles.waterBtnRow}>
              <TouchableOpacity
                onPress={() => addWater(250)}
                style={styles.waterAddBtn}
              >
                <Text style={styles.waterAddText}>+250ml</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => addWater(500)}
                style={styles.waterAddBtn}
              >
                <Text style={styles.waterAddText}>+500ml</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Search Results list */}
        {searchQuery ? (
          <View style={styles.sectionBox}>
            <Text style={styles.sectionHeader}>Search Results</Text>
            {filteredFoods.map((food, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => {
                  handleAddCustomFood(food);
                  setSearchQuery("");
                }}
                style={styles.resultItem}
                activeOpacity={0.8}
              >
                <View>
                  <Text style={styles.resultMeal}>{food.mealType.toUpperCase()}</Text>
                  <Text style={styles.resultName}>{food.name}</Text>
                  <Text style={styles.resultMacros}>P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g</Text>
                </View>
                <View style={styles.resultRight}>
                  <Text style={styles.resultCals}>{food.calories} kcal</Text>
                  <View style={styles.addCircle}>
                    <Text style={styles.addIcon}>+</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}

        {/* Logged meals history */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionHeader}>Logged Meals Today</Text>
          {foodLogs.length > 0 ? (
            foodLogs.map((log) => (
              <View key={log.id} style={styles.logItem}>
                <View style={styles.logLeft}>
                  <View style={styles.logAvatar}>
                    <Text style={styles.logEmoji}>🍲</Text>
                  </View>
                  <View>
                    <Text style={styles.logName}>{log.name}</Text>
                    <Text style={styles.logMeal}>{log.mealType.toUpperCase()}</Text>
                  </View>
                </View>

                <View style={styles.logRight}>
                  <Text style={styles.logCals}>{log.calories} kcal</Text>
                  <Text style={styles.logMacros}>P: {log.protein}g C: {log.carbs}g</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyLogsText}>No food entries logged for today yet.</Text>
          )}
        </View>

      </ScrollView>

      {/* Simulated Scanner Viewfinder modal */}
      <Modal
        visible={showScanner}
        animationType="slide"
        transparent
      >
        <View style={styles.scannerOverlayBg}>
          <View style={styles.scannerWrapper}>
            <View style={styles.scannerHeaderRow}>
              <Text style={styles.scannerTitle}>ACTIVE CODE SCANNER</Text>
              <TouchableOpacity 
                onPress={() => setShowScanner(false)}
                style={styles.closeScanner}
              >
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Viewfinder bounds */}
            <View style={styles.viewfinderSquare}>
              {/* Laser line simulator */}
              <View style={styles.laserLine} />
              
              <Text style={styles.cameraIndicator}>📸 LENS ACTIVE</Text>
            </View>

            <View style={styles.scannerStatusBox}>
              <Text style={styles.scannerStatusText}>{scannerStatus}</Text>
              <Text style={styles.scannerDescText}>Center the product barcode inside viewfinder square.</Text>
              
              {/* Loader */}
              <View style={styles.scanTrack}>
                <View style={[styles.scanBar, { width: `${scanProgress}%` }]} />
              </View>
            </View>
          </View>
        </View>
      </Modal>

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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  scanBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  scanBtnText: {
    fontSize: 9,
    fontWeight: "900",
    color: "#000",
  },
  searchBox: {
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: "#FFF",
    fontSize: 13,
  },
  sectionBox: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: "900",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  macrosCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    padding: 16,
  },
  macrosTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  macroMini: {
    fontSize: 8,
    fontWeight: "900",
    color: COLORS.textSecondary,
    letterSpacing: 1,
  },
  caloriesCount: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFF",
    marginTop: 4,
  },
  caloriesTotal: {
    fontSize: 11,
    fontWeight: "bold",
    color: COLORS.textSecondary,
  },
  macrosRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.01)",
  },
  ringPercentage: {
    fontSize: 14,
    fontWeight: "900",
    color: COLORS.primary,
  },
  ringLabel: {
    fontSize: 6,
    fontWeight: "bold",
    color: COLORS.textSecondary,
  },
  macroBarsRow: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
    paddingTop: 16,
  },
  barGroup: {
    marginBottom: 12,
  },
  barHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 8,
    fontWeight: "900",
    color: COLORS.textSecondary,
  },
  barVal: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#FFF",
  },
  track: {
    width: "100%",
    height: 4,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 2,
  },
  bar: {
    height: "100%",
    borderRadius: 2,
  },
  waterCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  waterTitle: {
    fontSize: 12,
    fontWeight: "900",
    color: COLORS.blue,
  },
  waterValue: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFF",
    marginTop: 4,
  },
  waterTotal: {
    fontSize: 9,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  waterBtnRow: {
    flexDirection: "row",
  },
  waterAddBtn: {
    backgroundColor: "rgba(96, 165, 250, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(96, 165, 250, 0.25)",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginLeft: 8,
  },
  waterAddText: {
    fontSize: 10,
    fontWeight: "900",
    color: COLORS.blue,
  },
  resultItem: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  resultMeal: {
    fontSize: 7,
    fontWeight: "900",
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  resultName: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#FFF",
    marginTop: 2,
  },
  resultMacros: {
    fontSize: 9,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  resultRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  resultCals: {
    fontSize: 11,
    fontWeight: "900",
    color: COLORS.primary,
    marginRight: 10,
  },
  addCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  addIcon: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  logItem: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  logLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  logAvatar: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.04)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  logEmoji: {
    fontSize: 16,
  },
  logName: {
    fontSize: 11,
    fontWeight: "900",
    color: "#FFF",
  },
  logMeal: {
    fontSize: 8,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: "bold",
  },
  logRight: {
    alignItems: "flex-end",
  },
  logCals: {
    fontSize: 11,
    fontWeight: "900",
    color: "#FFF",
  },
  logMacros: {
    fontSize: 8,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  emptyLogsText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginVertical: 12,
  },
  scannerOverlayBg: {
    flex: 1,
    backgroundColor: "rgba(7, 7, 8, 0.96)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  scannerWrapper: {
    width: "100%",
    maxWidth: 320,
    alignItems: "center",
  },
  scannerHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 32,
  },
  scannerTitle: {
    fontSize: 12,
    fontWeight: "900",
    color: COLORS.primary,
    letterSpacing: 1,
  },
  closeScanner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    color: "#FFF",
    fontSize: 12,
  },
  viewfinderSquare: {
    width: 240,
    height: 240,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "rgba(217, 255, 74, 0.4)",
    backgroundColor: "rgba(255,255,255,0.01)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  laserLine: {
    position: "absolute",
    width: "100%",
    height: 2,
    backgroundColor: COLORS.primary,
  },
  cameraIndicator: {
    fontSize: 8,
    fontWeight: "900",
    color: "rgba(255,255,255,0.3)",
    letterSpacing: 1,
    position: "absolute",
    bottom: 12,
  },
  scannerStatusBox: {
    width: "100%",
    alignItems: "center",
    marginTop: 32,
  },
  scannerStatusText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#FFF",
  },
  scannerDescText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: "center",
  },
  scanTrack: {
    width: "100%",
    height: 3,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 2,
    marginTop: 16,
    overflow: "hidden",
  },
  scanBar: {
    height: "100%",
    backgroundColor: COLORS.primary,
  },
});
