import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Modal
} from "react-native";
import { useAppStore } from "../store/useAppStore";
import { COLORS, SIZES } from "../styles/theme";

export default function WorkoutDetailPage() {
  const setView = useAppStore((state) => state.setView);
  const workout = useAppStore((state) => state.activeWorkout);
  const completeWorkout = useAppStore((state) => state.completeWorkout);

  const [isPlaying, setIsPlaying] = useState(false);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(60);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [showCompletionOverlay, setShowCompletionOverlay] = useState(false);

  if (!workout) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>ERROR</Text>
        <Text style={styles.errorText}>No active workout selected.</Text>
        <TouchableOpacity onPress={() => setView("workouts")} style={styles.errorBtn}>
          <Text style={styles.errorBtnText}>Catalog</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Active Timer Clock ticking
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlaying && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0) {
      handleNextExercise();
    }
    return () => clearInterval(timer);
  }, [isPlaying, secondsRemaining]);

  const handleStartWorkout = () => {
    setIsPlaying(true);
    setSecondsRemaining(60);
    setActiveExerciseIndex(0);
    setCompletedExercises([]);
  };

  const handleNextExercise = () => {
    const nextIdx = activeExerciseIndex + 1;
    setCompletedExercises((prev) => [...prev, activeExerciseIndex]);
    
    if (nextIdx < workout.exercises.length) {
      setActiveExerciseIndex(nextIdx);
      setSecondsRemaining(60);
    } else {
      setIsPlaying(false);
      setShowCompletionOverlay(true);
    }
  };

  const handleCompleteWorkout = () => {
    completeWorkout(workout);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const progressPercentage = (completedExercises.length / workout.exercises.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      
      {/* 1. MAIN DETAIL / LIST VIEW */}
      {!isPlaying && !showCompletionOverlay && (
        <View style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header cover mockup banner */}
            <View style={styles.detailHero}>
              <TouchableOpacity 
                onPress={() => setView("workouts")}
                style={styles.floatingBack}
              >
                <Text style={styles.floatingBackText}>←</Text>
              </TouchableOpacity>
              
              <Text style={styles.heroCategory}>{workout.category.toUpperCase()}</Text>
              <Text style={styles.heroTitle}>{workout.title}</Text>
            </View>

            {/* Quick Metrics grid */}
            <View style={styles.metricsGrid}>
              <View style={styles.metricItem}>
                <Text style={styles.metricIcon}>⏳</Text>
                <Text style={styles.metricLabel}>Duration</Text>
                <Text style={styles.metricVal}>{workout.duration} mins</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricIcon}>🔥</Text>
                <Text style={styles.metricLabel}>Estimated</Text>
                <Text style={styles.metricVal}>{workout.calories} kcal</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricIcon}>🏋️</Text>
                <Text style={styles.metricLabel}>Equipment</Text>
                <Text style={styles.metricVal}>{workout.equipment.split(" ")[0]}</Text>
              </View>
            </View>

            {/* Exercises Lists */}
            <View style={styles.sectionHeaderBox}>
              <Text style={styles.sectionTitle}>Exercises List ({workout.exercises.length})</Text>
            </View>

            <View style={styles.exerciseBox}>
              {workout.exercises.map((ex, idx) => (
                <View key={idx} style={styles.exerciseItem}>
                  <View style={styles.exLeft}>
                    <View style={styles.exIndexBadge}>
                      <Text style={styles.exIndexText}>{idx + 1}</Text>
                    </View>
                    <View>
                      <Text style={styles.exName}>{ex.name}</Text>
                      <Text style={styles.exRepText}>{ex.reps}</Text>
                    </View>
                  </View>
                  <Text style={styles.exPlayIcon}>▶</Text>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Absolute Bottom Start Button */}
          <View style={styles.bottomBarFixed}>
            <TouchableOpacity
              onPress={handleStartWorkout}
              style={styles.startBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.startBtnText}>Launch Live Workout</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 2. ACTIVE WORKOUT TIMER VIEW */}
      {isPlaying && (
        <View style={styles.playerContainer}>
          <View style={styles.playerTop}>
            <TouchableOpacity 
              onPress={() => setIsPlaying(false)}
              style={styles.exitBtn}
            >
              <Text style={styles.exitBtnText}>Exit Routine</Text>
            </TouchableOpacity>
            
            <View style={styles.playerTopRight}>
              <View style={styles.liveIndicator}>
                <Text style={styles.liveText}>LIVE</Text>
              </View>
              <TouchableOpacity 
                onPress={() => setIsAudioMuted(!isAudioMuted)}
                style={styles.muteBtn}
              >
                <Text style={styles.muteText}>{isAudioMuted ? "🔇" : "🔊"}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Central Clock */}
          <View style={styles.clockWrapper}>
            <View style={styles.clockCircle}>
              <Text style={styles.clockTime}>{formatTime(secondsRemaining)}</Text>
              <Text style={styles.clockTimeLabel}>Seconds Left</Text>
            </View>

            {/* Drill Instructions */}
            <View style={styles.drillInstructions}>
              <View style={styles.drillIndexBadge}>
                <Text style={styles.drillIndexText}>DRILL {activeExerciseIndex + 1} OF {workout.exercises.length}</Text>
              </View>
              <Text style={styles.drillTitle}>{workout.exercises[activeExerciseIndex].name}</Text>
              <Text style={styles.drillReps}>{workout.exercises[activeExerciseIndex].reps}</Text>
            </View>
          </View>

          {/* Up Next Bar */}
          <View style={styles.upNextCard}>
            <Text style={styles.upNextLabel}>UP NEXT:</Text>
            <Text style={styles.upNextName}>
              {activeExerciseIndex + 1 < workout.exercises.length 
                ? workout.exercises[activeExerciseIndex + 1].name 
                : "Routines Finished (Cool Down)"}
            </Text>
          </View>

          {/* Player controls */}
          <View style={styles.controlsRow}>
            <TouchableOpacity 
              onPress={() => setIsPlaying(false)}
              style={styles.controlSquare}
            >
              <Text style={styles.controlBtnText}>⏹</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setIsPlaying(!isPlaying)}
              style={styles.controlPlay}
            >
              <Text style={[styles.controlBtnText, { color: "#000" }]}>{isPlaying ? "⏸" : "▶"}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleNextExercise}
              style={styles.controlDone}
            >
              <Text style={[styles.controlBtnText, { color: "#000" }]}>✓</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 3. WORKOUT COMPLETE OVERLAY SCREEN */}
      <Modal
        visible={showCompletionOverlay}
        animationType="fade"
        transparent
      >
        <View style={styles.overlayBg}>
          <View style={styles.completeContent}>
            <Text style={styles.trophyIcon}>🏆</Text>
            <Text style={styles.completeTitle}>Routines Completed!</Text>
            <Text style={styles.completeDesc}>
              Incredible determination! You pushed through the limits and successfully completed the workout.
            </Text>

            <View style={styles.rewardsGrid}>
              <View style={styles.rewardItem}>
                <Text style={styles.rewardEmoji}>⚡</Text>
                <Text style={styles.rewardLabel}>XP Gained</Text>
                <Text style={styles.rewardVal}>+150 XP</Text>
              </View>
              <View style={styles.rewardItem}>
                <Text style={styles.rewardEmoji}>🔥</Text>
                <Text style={styles.rewardLabel}>Streak</Text>
                <Text style={styles.rewardVal}>+1 Day</Text>
              </View>
            </View>

            <TouchableOpacity 
              onPress={handleCompleteWorkout}
              style={styles.recordBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.recordBtnText}>Record & Continue</Text>
            </TouchableOpacity>
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
  errorContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: COLORS.primary,
    letterSpacing: 1.5,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  errorBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginTop: 16,
  },
  errorBtnText: {
    fontWeight: "900",
    color: "#000",
  },
  detailHero: {
    height: 200,
    backgroundColor: "#121217",
    padding: 24,
    justifyContent: "flex-end",
  },
  floatingBack: {
    position: "absolute",
    top: 24,
    left: 24,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  floatingBackText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  heroCategory: {
    fontSize: 9,
    fontWeight: "900",
    color: COLORS.primary,
    letterSpacing: 1.2,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFF",
    marginTop: 4,
    letterSpacing: -0.5,
  },
  metricsGrid: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
    backgroundColor: "#121217",
  },
  metricItem: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
    marginHorizontal: 4,
  },
  metricIcon: {
    fontSize: 16,
  },
  metricLabel: {
    fontSize: 8,
    fontWeight: "700",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 4,
  },
  metricVal: {
    fontSize: 11,
    fontWeight: "900",
    color: "#FFF",
    marginTop: 2,
  },
  sectionHeaderBox: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "900",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  exerciseBox: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  exerciseItem: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  exLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  exIndexBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  exIndexText: {
    fontSize: 11,
    fontWeight: "900",
    color: COLORS.primary,
  },
  exName: {
    fontSize: 12,
    fontWeight: "900",
    color: "#FFF",
  },
  exRepText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  exPlayIcon: {
    fontSize: 12,
    color: COLORS.primary,
  },
  bottomBarFixed: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
  },
  startBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  startBtnText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  playerContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 24,
    justifyContent: "space-between",
  },
  playerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
  },
  exitBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 99,
  },
  exitBtnText: {
    fontSize: 10,
    fontWeight: "900",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
  },
  playerTopRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  liveIndicator: {
    backgroundColor: "rgba(168, 255, 96, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(168, 255, 96, 0.25)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginRight: 10,
  },
  liveText: {
    fontSize: 8,
    fontWeight: "900",
    color: COLORS.secondary,
    letterSpacing: 1,
  },
  muteBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  muteText: {
    fontSize: 14,
  },
  clockWrapper: {
    alignItems: "center",
    marginVertical: 40,
  },
  clockCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 6,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.01)",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  clockTime: {
    fontSize: 36,
    fontWeight: "900",
    color: "#FFF",
    letterSpacing: -1,
  },
  clockTimeLabel: {
    fontSize: 8,
    fontWeight: "900",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginTop: 4,
  },
  drillInstructions: {
    alignItems: "center",
    marginTop: 32,
  },
  drillIndexBadge: {
    backgroundColor: "rgba(217, 255, 74, 0.1)",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: "rgba(217, 255, 74, 0.2)",
  },
  drillIndexText: {
    fontSize: 8,
    fontWeight: "900",
    color: COLORS.primary,
    letterSpacing: 1,
  },
  drillTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FFF",
    marginTop: 10,
    textAlign: "center",
    letterSpacing: -0.2,
  },
  drillReps: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 6,
  },
  upNextCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    padding: 16,
    marginBottom: 20,
  },
  upNextLabel: {
    fontSize: 8,
    fontWeight: "900",
    color: COLORS.textSecondary,
    letterSpacing: 1,
  },
  upNextName: {
    fontSize: 12,
    fontWeight: "900",
    color: "#FFF",
    marginTop: 4,
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  controlSquare: {
    width: "28%",
    backgroundColor: "rgba(239, 68, 68, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  controlPlay: {
    width: "36%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  controlDone: {
    width: "28%",
    backgroundColor: COLORS.secondary,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  controlBtnText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.red,
  },
  overlayBg: {
    flex: 1,
    backgroundColor: "rgba(7, 7, 8, 0.95)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  completeContent: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    padding: 24,
    width: "100%",
    maxWidth: 320,
    alignItems: "center",
  },
  trophyIcon: {
    fontSize: 48,
  },
  completeTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FFF",
    marginTop: 16,
    textAlign: "center",
  },
  completeDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 16,
    marginTop: 8,
  },
  rewardsGrid: {
    flexDirection: "row",
    marginTop: 20,
    width: "100%",
  },
  rewardItem: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    paddingVertical: 10,
    alignItems: "center",
    marginHorizontal: 6,
  },
  rewardEmoji: {
    fontSize: 16,
  },
  rewardLabel: {
    fontSize: 8,
    fontWeight: "bold",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    marginTop: 2,
  },
  rewardVal: {
    fontSize: 12,
    fontWeight: "900",
    color: COLORS.primary,
    marginTop: 2,
  },
  recordBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    width: "100%",
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24,
  },
  recordBtnText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
