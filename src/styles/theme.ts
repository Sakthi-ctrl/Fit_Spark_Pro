import { StyleSheet, Dimensions } from "react-native";

export const COLORS = {
  background: "#0B0B0D",
  card: "#1A1A1F",
  primary: "#D9FF4A",
  secondary: "#A8FF60",
  textPrimary: "#FFFFFF",
  textSecondary: "#A1A1AA",
  border: "#2E2E35",
  success: "#4ade80",
  danger: "#f87171",
  blue: "#60a5fa",
  orange: "#f97316",
  red: "#ef4444",
};

export const SIZES = {
  width: Dimensions.get("window").width,
  height: Dimensions.get("window").height,
  radius: 24,
};

export const themeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  glassCard: {
    backgroundColor: "rgba(26, 26, 31, 0.75)",
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  neonCard: {
    backgroundColor: "rgba(26, 26, 31, 0.85)",
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: "rgba(217, 255, 74, 0.15)",
    padding: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  btnPrimary: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimaryText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
});
