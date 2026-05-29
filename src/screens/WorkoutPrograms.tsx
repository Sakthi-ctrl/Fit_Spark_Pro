import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView 
} from "react-native";
import { useAppStore, WorkoutItem } from "../store/useAppStore";
import { COLORS, SIZES } from "../styles/theme";

export default function WorkoutPrograms() {
  const setView = useAppStore((state) => state.setView);
  const setActiveWorkout = useAppStore((state) => state.setActiveWorkout);

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = [
    "All",
    "Strength Training",
    "Fat Loss",
    "Muscle Building",
    "Cardio",
    "Yoga",
    "HIIT",
    "CrossFit",
    "Home Workout"
  ];

  const workoutsDatabase: WorkoutItem[] = [
    {
      id: "w1",
      title: "Iron Chest & Triceps",
      duration: 50,
      calories: 450,
      difficulty: "Advanced",
      category: "Muscle Building",
      equipment: "Barbells & Dumbbells",
      exercises: [
        { name: "Barbell Bench Press", reps: "4 sets x 8-10 reps" },
        { name: "Incline Dumbbell Flyes", reps: "3 sets x 12 reps" },
        { name: "Cable Chest Crossovers", reps: "3 sets x 15 reps" },
        { name: "Dumbbell Overhead Extension", reps: "4 sets x 10 reps" },
        { name: "Tricep Rope Pushdowns", reps: "3 sets x 12-15 reps" },
      ]
    },
    {
      id: "w2",
      title: "Metabolic HIIT Burner",
      duration: 30,
      calories: 380,
      difficulty: "Intermediate",
      category: "HIIT",
      equipment: "None (Bodyweight)",
      exercises: [
        { name: "Jumping Jacks", reps: "45 sec work / 15 sec rest" },
        { name: "Burpees", reps: "45 sec work / 15 sec rest" },
        { name: "Mountain Climbers", reps: "45 sec work / 15 sec rest" },
        { name: "Kettlebell Swings (or Jump Squats)", reps: "45 sec work / 15 sec rest" },
        { name: "Plank Shoulder Taps", reps: "45 sec work / 15 sec rest" },
      ]
    },
    {
      id: "w3",
      title: "Barbell Squat Base",
      duration: 60,
      calories: 520,
      difficulty: "Advanced",
      category: "Strength Training",
      equipment: "Power Rack & Barbells",
      exercises: [
        { name: "Barbell Back Squats", reps: "5 sets x 5 reps" },
        { name: "Romanian Deadlifts", reps: "4 sets x 8 reps" },
        { name: "Leg Press Machine", reps: "3 sets x 10 reps" },
        { name: "Bulgarian Split Squats", reps: "3 sets x 10 reps per leg" },
        { name: "Standing Calf Raises", reps: "4 sets x 15 reps" },
      ]
    },
    {
      id: "w4",
      title: "Fat Shred Cardio Circuit",
      duration: 35,
      calories: 400,
      difficulty: "Intermediate",
      category: "Fat Loss",
      equipment: "Treadmill or None",
      exercises: [
        { name: "Sprint Intervals", reps: "10 sets x 30 sec sprints" },
        { name: "Medicine Ball Slams", reps: "4 sets x 15 reps" },
        { name: "Dumbbell Thrusters", reps: "4 sets x 12 reps" },
        { name: "Bicycle Crunches", reps: "3 sets x 20 reps" },
      ]
    },
    {
      id: "w5",
      title: "Vinyasa Core Yoga Flow",
      duration: 40,
      calories: 190,
      difficulty: "Beginner",
      category: "Yoga",
      equipment: "Yoga Mat",
      exercises: [
        { name: "Sun Salutation A", reps: "5 rounds" },
        { name: "Warrior II to Triangle Pose", reps: "3 rounds per side" },
        { name: "Crow Pose Practice", reps: "5 attempts" },
        { name: "Boat Pose Hold", reps: "3 sets x 30 sec holds" },
        { name: "Savasana meditation", reps: "5 minutes" },
      ]
    },
    {
      id: "w6",
      title: "No-Equipment Home Abs",
      duration: 20,
      calories: 160,
      difficulty: "Beginner",
      category: "Home Workout",
      equipment: "None",
      exercises: [
        { name: "Standard Crunches", reps: "3 sets x 20 reps" },
        { name: "Flutter Kicks", reps: "3 sets x 30 sec" },
        { name: "Russian Twists", reps: "3 sets x 25 reps" },
        { name: "Plank Hold", reps: "3 sets x 60 sec holds" },
      ]
    },
    {
      id: "w7",
      title: "CrossFit Titan WOD",
      duration: 45,
      calories: 490,
      difficulty: "Advanced",
      category: "CrossFit",
      equipment: "Barbell & Pull-Up Bar",
      exercises: [
        { name: "Clean & Jerks", reps: "5 rounds x 5 reps" },
        { name: "Kipping Pull-ups", reps: "5 rounds x 10 reps" },
        { name: "Double Unders (Jump Rope)", reps: "5 rounds x 50 reps" },
        { name: "Toes-to-Bar", reps: "5 rounds x 12 reps" },
      ]
    }
  ];

  const handleSelectWorkout = (workout: WorkoutItem) => {
    setActiveWorkout(workout);
    setView("workout-detail");
  };

  const filteredWorkouts = workoutsDatabase.filter((w) => {
    const matchCategory = activeCategory === "All" || w.category === activeCategory;
    const matchSearch = w.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        w.equipment.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header & Searches */}
      <View style={styles.headerSection}>
        <View>
          <Text style={styles.miniLabel}>CHOOSE YOUR PATH</Text>
          <Text style={styles.titleText}>
            WORKOUT <Text style={{ color: COLORS.primary }}>CATALOG</Text>
          </Text>
        </View>

        {/* Input search */}
        <View style={styles.searchWrapper}>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            placeholder="Search dumbbell, chest, home abs..."
            placeholderTextColor="rgba(255,255,255,0.25)"
          />
        </View>
      </View>

      {/* Categories Horizontal */}
      <View style={styles.tabsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScroll}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCategory(cat)}
              style={[
                styles.tabBtn,
                activeCategory === cat ? styles.tabBtnActive : null
              ]}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.tabText,
                activeCategory === cat ? styles.tabTextActive : null
              ]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Routines cards Scroll */}
      <ScrollView 
        contentContainerStyle={styles.cardsScroll}
        showsVerticalScrollIndicator={false}
      >
        {filteredWorkouts.length > 0 ? (
          filteredWorkouts.map((w) => (
            <TouchableOpacity
              key={w.id}
              onPress={() => handleSelectWorkout(w)}
              style={styles.workoutCard}
              activeOpacity={0.9}
            >
              <View style={styles.cardTop}>
                <View>
                  <Text style={styles.cardCategory}>{w.category.toUpperCase()}</Text>
                  <Text style={styles.cardTitle}>{w.title}</Text>
                </View>
                
                <View style={[
                  styles.difficultyBadge,
                  w.difficulty === "Advanced" ? styles.diffAdvanced : w.difficulty === "Intermediate" ? styles.diffInter : styles.diffBegin
                ]}>
                  <Text style={[
                    styles.difficultyText,
                    w.difficulty === "Advanced" ? styles.textAdv : w.difficulty === "Intermediate" ? styles.textInter : styles.textBegin
                  ]}>{w.difficulty.toUpperCase()}</Text>
                </View>
              </View>

              <View style={styles.cardBottom}>
                <View style={styles.metaRow}>
                  <Text style={styles.metaIcon}>⏳</Text>
                  <Text style={styles.metaVal}>{w.duration} mins</Text>
                  <Text style={styles.metaIcon}>🔥</Text>
                  <Text style={styles.metaVal}>{w.calories} kcal</Text>
                </View>

                <View style={styles.equipmentBadge}>
                  <Text style={styles.equipmentText}>{w.equipment.split(" ")[0].toUpperCase()}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>No matching routines found.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerSection: {
    paddingHorizontal: 24,
    paddingTop: 16,
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
  searchWrapper: {
    marginTop: 16,
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
  tabsContainer: {
    height: 48,
    marginTop: 16,
  },
  tabsScroll: {
    paddingHorizontal: 20,
  },
  tabBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 99,
    marginRight: 8,
    height: 36,
    justifyContent: "center",
  },
  tabBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabText: {
    fontSize: 11,
    fontWeight: "bold",
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: "#000",
  },
  cardsScroll: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  workoutCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    padding: 16,
    height: 140,
    justifyContent: "space-between",
    marginBottom: 16,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardCategory: {
    fontSize: 8,
    fontWeight: "900",
    color: COLORS.primary,
    letterSpacing: 1.2,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#FFF",
    marginTop: 4,
    letterSpacing: -0.2,
  },
  difficultyBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  diffAdvanced: {
    backgroundColor: "rgba(239, 68, 68, 0.08)",
    borderColor: "rgba(239, 68, 68, 0.2)",
  },
  diffInter: {
    backgroundColor: "rgba(168, 255, 96, 0.08)",
    borderColor: "rgba(168, 255, 96, 0.2)",
  },
  diffBegin: {
    backgroundColor: "rgba(96, 165, 250, 0.08)",
    borderColor: "rgba(96, 165, 250, 0.2)",
  },
  difficultyText: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  textAdv: { color: COLORS.red },
  textInter: { color: COLORS.secondary },
  textBegin: { color: COLORS.blue },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
    paddingTop: 12,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  metaVal: {
    fontSize: 10,
    fontWeight: "bold",
    color: COLORS.textSecondary,
    marginRight: 12,
  },
  equipmentBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  equipmentText: {
    fontSize: 8,
    fontWeight: "900",
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    height: 300,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyIcon: {
    fontSize: 36,
    opacity: 0.3,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 12,
  },
});
