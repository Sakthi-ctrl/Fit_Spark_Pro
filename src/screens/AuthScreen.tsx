import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { useAppStore } from "../store/useAppStore";
import { COLORS } from "../styles/theme";

type AuthMode = "login" | "register" | "otp";

export default function AuthScreen() {
  const setView = useAppStore((state) => state.setView);
  const setUser = useAppStore((state) => state.setUser);
  const otpCode = useAppStore((state) => state.otpCode);
  const otpDigits = useAppStore((state) => state.otpDigits);
  const setOtpDigits = useAppStore((state) => state.setOtpDigits);

  const [mode, setMode] = useState<AuthMode>("login");
  const [registerStep, setRegisterStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Input states
  const [email, setEmail] = useState("sathyan@fitspark.com");
  const [password, setPassword] = useState("password123");
  const [name, setName] = useState("Sathyan");
  const [age, setAge] = useState("26");
  const [gender, setGender] = useState("Male");
  const [weight, setWeight] = useState("78");
  const [height, setHeight] = useState("180");
  const [goal, setGoal] = useState("Muscle Building");

  const handleLoginSubmit = () => {
    if (!email || !password) {
      setErrorMsg("Please fill in all credentials");
      return;
    }
    setErrorMsg("");
    setSuccessMsg(`Verification code sent to ${email}`);
    setMode("otp");
  };

  const handleRegisterSubmit = () => {
    if (registerStep < 3) {
      setRegisterStep(registerStep + 1);
      return;
    }
    setSuccessMsg("Dispatched verification OTP");
    setMode("otp");
  };

  const handleOtpKey = (num: string) => {
    setErrorMsg("");
    const emptyIndex = otpDigits.findIndex((d) => d === "");
    if (emptyIndex !== -1) {
      const nextDigits = [...otpDigits];
      nextDigits[emptyIndex] = num;
      setOtpDigits(nextDigits);
      
      if (emptyIndex === 3) {
        const fullCode = nextDigits.join("");
        if (fullCode === otpCode) {
          setUser({
            name: mode === "register" ? name : "Sathyan",
            email: email,
            age: parseInt(age) || 26,
            gender: gender,
            weight: parseFloat(weight) || 78,
            height: parseFloat(height) || 180,
            goal: goal,
          });
          setSuccessMsg("");
          setView("dashboard");
        } else {
          setErrorMsg("Invalid OTP code. Please enter 4920.");
        }
      }
    }
  };

  const handleOtpBackspace = () => {
    const nextDigits = [...otpDigits];
    for (let i = 3; i >= 0; i--) {
      if (nextDigits[i] !== "") {
        nextDigits[i] = "";
        break;
      }
    }
    setOtpDigits(nextDigits);
    setErrorMsg("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header controls */}
          <View style={styles.topHeader}>
            <TouchableOpacity
              onPress={() => {
                if (mode === "otp") setMode(registerStep > 1 ? "register" : "login");
                else if (mode === "register" && registerStep > 1) setRegisterStep(registerStep - 1);
                else setView("onboarding");
              }}
              style={styles.backButton}
            >
              <Text style={styles.backBtnText}>←</Text>
            </TouchableOpacity>
            
            <Text style={styles.headerLabel}>
              {mode === "otp" ? "SECURITY CHECK" : mode === "login" ? "SIGN IN" : `SIGN UP ${registerStep}/3`}
            </Text>
            
            <View style={{ width: 36 }} />
          </View>

          {/* Form wrapper */}
          <View style={styles.formWrapper}>
            
            {/* 1. LOGIN MODE */}
            {mode === "login" && (
              <View style={styles.spaceColumn}>
                <View style={styles.titleContainer}>
                  <Text style={styles.heroText}>
                    WELCOME <Text style={{ color: COLORS.primary }}>BACK ATHLETE</Text>
                  </Text>
                  <Text style={styles.descText}>Unlock tailored plans and intelligent coaching.</Text>
                </View>

                {errorMsg ? <Text style={styles.errorBanner}>{errorMsg}</Text> : null}

                <View style={styles.inputsBox}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.fieldLabel}>Email Address</Text>
                    <TextInput
                      value={email}
                      onChangeText={setEmail}
                      style={styles.inputField}
                      placeholder="e.g. ath@fitspark.com"
                      placeholderTextColor="rgba(255,255,255,0.25)"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.fieldLabel}>Account Password</Text>
                    <TextInput
                      value={password}
                      onChangeText={setPassword}
                      style={styles.inputField}
                      placeholder="••••••••"
                      placeholderTextColor="rgba(255,255,255,0.25)"
                      secureTextEntry
                    />
                  </View>

                  <TouchableOpacity
                    onPress={handleLoginSubmit}
                    style={styles.actionButton}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.actionBtnText}>Authorize Account</Text>
                  </TouchableOpacity>
                </View>

                {/* Third Party Shortcuts */}
                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR LOGIN VIA</Text>
                  <View style={styles.dividerLine} />
                </View>

                <View style={styles.thirdPartyRow}>
                  <TouchableOpacity
                    onPress={() => {
                      setUser({ name: "Sathyan", email: "sathyan@google.com", age: 26, gender: "Male", weight: 78, height: 180, goal: "Muscle Building" });
                      setView("dashboard");
                    }}
                    style={styles.thirdPartyBtn}
                  >
                    <Text style={styles.thirdPartyText}>Google</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setUser({ name: "Sathyan", email: "sathyan@apple.com", age: 26, gender: "Male", weight: 78, height: 180, goal: "Muscle Building" });
                      setView("dashboard");
                    }}
                    style={styles.thirdPartyBtn}
                  >
                    <Text style={styles.thirdPartyText}>Apple ID</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* 2. REGISTER MODE */}
            {mode === "register" && (
              <View style={styles.spaceColumn}>
                <View style={styles.titleContainer}>
                  <Text style={styles.heroText}>
                    BECOME A <Text style={{ color: COLORS.primary }}>FITSPARK MEMBER</Text>
                  </Text>
                  <Text style={styles.descText}>Let us customize a high-performance system for you.</Text>
                </View>

                {registerStep === 1 && (
                  <View style={styles.inputsBox}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.fieldLabel}>Full Name</Text>
                      <TextInput
                        value={name}
                        onChangeText={setName}
                        style={styles.inputField}
                        placeholder="e.g. Sathyan"
                        placeholderTextColor="rgba(255,255,255,0.25)"
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.fieldLabel}>Email Address</Text>
                      <TextInput
                        value={email}
                        onChangeText={setEmail}
                        style={styles.inputField}
                        placeholder="e.g. ath@fitspark.com"
                        placeholderTextColor="rgba(255,255,255,0.25)"
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.fieldLabel}>Password</Text>
                      <TextInput
                        value={password}
                        onChangeText={setPassword}
                        style={styles.inputField}
                        placeholder="••••••••"
                        placeholderTextColor="rgba(255,255,255,0.25)"
                        secureTextEntry
                      />
                    </View>
                  </View>
                )}

                {registerStep === 2 && (
                  <View style={styles.inputsBox}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.fieldLabel}>Age</Text>
                      <TextInput
                        value={age}
                        onChangeText={setAge}
                        style={styles.inputField}
                        placeholder="e.g. 26"
                        placeholderTextColor="rgba(255,255,255,0.25)"
                        keyboardType="numeric"
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.fieldLabel}>Biological Gender</Text>
                      <View style={styles.genderRow}>
                        {["Male", "Female", "Other"].map((g) => (
                          <TouchableOpacity
                            key={g}
                            onPress={() => setGender(g)}
                            style={[
                              styles.genderBtn,
                              gender === g ? styles.genderBtnActive : null
                            ]}
                          >
                            <Text style={[
                              styles.genderText,
                              gender === g ? styles.genderTextActive : null
                            ]}>{g}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>
                )}

                {registerStep === 3 && (
                  <View style={styles.inputsBox}>
                    <View style={styles.metricsRow}>
                      <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                        <Text style={styles.fieldLabel}>Weight (kg)</Text>
                        <TextInput
                          value={weight}
                          onChangeText={setWeight}
                          style={[styles.inputField, { textAlign: "center", fontWeight: "bold" }]}
                          keyboardType="numeric"
                        />
                      </View>
                      <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.fieldLabel}>Height (cm)</Text>
                        <TextInput
                          value={height}
                          onChangeText={setHeight}
                          style={[styles.inputField, { textAlign: "center", fontWeight: "bold" }]}
                          keyboardType="numeric"
                        />
                      </View>
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.fieldLabel}>Primary Fitness Goal</Text>
                      <View style={styles.goalsGrid}>
                        {["Strength Training", "Fat Loss", "Muscle Building", "Cardio"].map((gl) => (
                          <TouchableOpacity
                            key={gl}
                            onPress={() => setGoal(gl)}
                            style={[
                              styles.goalBtn,
                              goal === gl ? styles.goalBtnActive : null
                            ]}
                          >
                            <Text style={[
                              styles.goalText,
                              goal === gl ? styles.goalTextActive : null
                            ]}>{gl.split(" ")[0].toUpperCase()}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>
                )}

                <TouchableOpacity
                  onPress={handleRegisterSubmit}
                  style={styles.actionButton}
                  activeOpacity={0.8}
                >
                  <Text style={styles.actionBtnText}>
                    {registerStep === 3 ? "Generate Account" : "Next Step"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* 3. OTP VERIFICATION */}
            {mode === "otp" && (
              <View style={[styles.spaceColumn, { alignItems: "center" }]}>
                <View style={styles.titleContainer}>
                  <Text style={[styles.heroText, { textAlign: "center" }]}>
                    VERIFY <Text style={{ color: COLORS.primary }}>IDENTITY</Text>
                  </Text>
                  <Text style={[styles.descText, { textAlign: "center" }]}>
                    We sent a 4-digit code. Enter it below.{"\n"}
                    <Text style={{ opacity: 0.4 }}>Quick hint: Code is 4920</Text>
                  </Text>
                </View>

                {errorMsg ? <Text style={[styles.errorBanner, { width: "100%", textAlign: "center" }]}>{errorMsg}</Text> : null}
                {successMsg ? <Text style={[styles.successBanner, { width: "100%", textAlign: "center" }]}>{successMsg}</Text> : null}

                {/* Display slots */}
                <View style={styles.slotsRow}>
                  {[0, 1, 2, 3].map((idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.otpSlot,
                        otpDigits[idx] !== "" ? styles.otpSlotFilled : null
                      ]}
                    >
                      <Text style={[
                        styles.otpSlotText,
                        otpDigits[idx] !== "" ? styles.otpSlotTextFilled : null
                      ]}>{otpDigits[idx]}</Text>
                    </View>
                  ))}
                </View>

                {/* Secure virtual pad */}
                <View style={styles.keypadGrid}>
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                    <TouchableOpacity
                      key={num}
                      onPress={() => handleOtpKey(num)}
                      style={styles.keypadKey}
                    >
                      <Text style={styles.keyText}>{num}</Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity
                    onPress={() => setOtpDigits(["", "", "", ""])}
                    style={styles.keypadKey}
                  >
                    <Text style={[styles.keyText, { fontSize: 11, color: COLORS.red }]}>CLR</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleOtpKey("0")}
                    style={styles.keypadKey}
                  >
                    <Text style={styles.keyText}>0</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleOtpBackspace}
                    style={styles.keypadKey}
                  >
                    <Text style={[styles.keyText, { fontSize: 11, color: COLORS.textSecondary }]}>DEL</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

          </View>

          {/* Footer switch tabs */}
          {mode !== "otp" && (
            <View style={styles.footerRow}>
              <TouchableOpacity
                onPress={() => {
                  setErrorMsg("");
                  setMode(mode === "login" ? "register" : "login");
                  setRegisterStep(1);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.footerSwitchText}>
                  {mode === "login" ? (
                    <>New to FitSpark? <Text style={{ color: COLORS.primary, fontWeight: "900" }}>SIGN UP FREE</Text></>
                  ) : (
                    <>Already a member? <Text style={{ color: COLORS.primary, fontWeight: "900" }}>LOG IN</Text></>
                  )}
                </Text>
              </TouchableOpacity>
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
    padding: 24,
  },
  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  backBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  headerLabel: {
    fontSize: 10,
    fontWeight: "900",
    color: COLORS.primary,
    letterSpacing: 1.5,
  },
  formWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  spaceColumn: {
    width: "100%",
  },
  titleContainer: {
    marginBottom: 24,
  },
  heroText: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FFF",
    letterSpacing: -1,
    lineHeight: 28,
  },
  descText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 6,
    lineHeight: 16,
  },
  errorBanner: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
    padding: 12,
    borderRadius: 12,
    color: COLORS.red,
    fontSize: 11,
    marginBottom: 16,
  },
  successBanner: {
    backgroundColor: "rgba(217, 255, 74, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(217, 255, 74, 0.15)",
    padding: 12,
    borderRadius: 12,
    color: COLORS.primary,
    fontSize: 11,
    marginBottom: 16,
  },
  inputsBox: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  inputField: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: "#FFF",
    fontSize: 13,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  actionBtnText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  dividerText: {
    fontSize: 9,
    fontWeight: "bold",
    color: COLORS.textSecondary,
    marginHorizontal: 12,
    letterSpacing: 1,
  },
  thirdPartyRow: {
    flexDirection: "row",
  },
  thirdPartyBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    paddingVertical: 14,
    borderRadius: 16,
    marginHorizontal: 6,
  },
  thirdPartyText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFF",
  },
  genderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  genderBtn: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginHorizontal: 4,
  },
  genderBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  genderText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFF",
  },
  genderTextActive: {
    color: "#000",
  },
  metricsRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  goalsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  goalBtn: {
    width: "48%",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  goalBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  goalText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#FFF",
    letterSpacing: 0.5,
  },
  goalTextActive: {
    color: "#000",
  },
  slotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 32,
  },
  otpSlot: {
    width: 52,
    height: 60,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    marginHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  otpSlotFilled: {
    borderColor: COLORS.primary,
    backgroundColor: "rgba(217, 255, 74, 0.03)",
  },
  otpSlotText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFF",
  },
  otpSlotTextFilled: {
    color: COLORS.primary,
  },
  keypadGrid: {
    width: "100%",
    maxWidth: 280,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  keypadKey: {
    width: "30%",
    aspectRatio: 1.5,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  keyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
  footerRow: {
    alignItems: "center",
    marginTop: 32,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
    paddingTop: 20,
  },
  footerSwitchText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
});
