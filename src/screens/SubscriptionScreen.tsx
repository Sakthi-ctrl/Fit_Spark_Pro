import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Modal,
  TextInput,
  ActivityIndicator
} from "react-native";
import { useAppStore } from "../store/useAppStore";
import { COLORS, SIZES } from "../styles/theme";

interface Plan {
  id: "Basic" | "Pro" | "Elite";
  title: string;
  price: string;
  popular: boolean;
  color: string;
  textColor: string;
  features: string[];
}

export default function SubscriptionScreen() {
  const setView = useAppStore((state) => state.setView);
  const subscribe = useAppStore((state) => state.subscribe);
  const currentTier = useAppStore((state) => state.subscriptionTier);

  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("424");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const plans: Plan[] = [
    {
      id: "Basic",
      title: "Spark Basic",
      price: "$9.99",
      popular: false,
      color: "rgba(255, 255, 255, 0.03)",
      textColor: "#FFF",
      features: [
        "Access to Curated Workout Catalog",
        "Standard Meal Nutrition Logs",
        "Weekly Progress Summaries",
        "Google Fit & Samsung Sync",
      ],
    },
    {
      id: "Pro",
      title: "Spark Pro",
      price: "$19.99",
      popular: true,
      color: "rgba(217, 255, 74, 0.05)",
      textColor: COLORS.primary,
      features: [
        "Everything in Basic",
        "Unlimited ChatGPT AI Coach",
        "Full Macro Goal Generators",
        "Apple Watch & Fitbit Core Sync",
        "Unlock Standard Medals Locker",
      ],
    },
    {
      id: "Elite",
      title: "Spark Elite",
      price: "$39.99",
      popular: false,
      color: "rgba(168, 85, 247, 0.05)",
      textColor: "#c084fc",
      features: [
        "Everything in Pro",
        "AI Voice Coach wave integration",
        "1-on-1 Human Coach Review",
        "Exclusive VIP Social Feed share",
        "Real-Time Cardiac Analysis alerts",
      ],
    },
  ];

  const handleOpenStripe = (plan: Plan) => {
    setSelectedPlan(plan);
    setPaymentSuccess(false);
    setPaymentProcessing(false);
  };

  const handleCheckout = () => {
    setPaymentProcessing(true);

    setTimeout(() => {
      setPaymentProcessing(false);
      setPaymentSuccess(true);
    }, 2000);
  };

  const handleCompleteUpgrade = () => {
    if (selectedPlan) {
      subscribe(selectedPlan.id);
      setSelectedPlan(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header navigation bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity 
            onPress={() => setView("profile")}
            style={styles.backBtn}
          >
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>PREMIUM UPGRADE</Text>
          <View style={{ width: 36 }} />
        </View>

        <View style={styles.heroBox}>
          <Text style={styles.heroTitle}>UNLOCK FITSPARK PRO</Text>
          <Text style={styles.heroDesc}>
            Choose the membership tier built for your goals and step up your metrics today.
          </Text>
        </View>

        {/* Swipe cards */}
        <View style={styles.plansWrapper}>
          {plans.map((plan) => (
            <View 
              key={plan.id} 
              style={[
                styles.planCard, 
                { backgroundColor: plan.color },
                plan.popular ? styles.cardProGlow : null
              ]}
            >
              <View style={styles.planCardHeader}>
                <View>
                  {plan.popular ? (
                    <View style={styles.recommendLabel}>
                      <Text style={styles.recommendLabelText}>RECOMMENDED</Text>
                    </View>
                  ) : null}
                  <Text style={[styles.planTitle, { color: plan.textColor }]}>{plan.title.toUpperCase()}</Text>
                </View>

                <View style={styles.planPriceBox}>
                  <Text style={styles.planPrice}>{plan.price}</Text>
                  <Text style={styles.planPriceUnit}>/mo</Text>
                </View>
              </View>

              {/* Features check list */}
              <View style={styles.featuresList}>
                {plan.features.map((feat, idx) => (
                  <View key={idx} style={styles.featureItem}>
                    <Text style={styles.featureCheck}>✓</Text>
                    <Text style={styles.featureText}>{feat}</Text>
                  </View>
                ))}
              </View>

              {/* Subscribe button action */}
              <TouchableOpacity
                onPress={() => handleOpenStripe(plan)}
                disabled={currentTier === plan.id}
                style={[
                  styles.subscribeBtn,
                  currentTier === plan.id ? styles.subscribeBtnDisabled : null
                ]}
                activeOpacity={0.8}
              >
                <Text style={styles.subscribeBtnText}>
                  {currentTier === plan.id ? "Active Plan" : `Upgrade to ${plan.id}`}
                </Text>
              </TouchableOpacity>

            </View>
          ))}
        </View>
      </ScrollView>

      {/* Stripe payment mockup sheet */}
      <Modal
        visible={selectedPlan !== null}
        animationType="slide"
        transparent
      >
        <View style={styles.modalOverlayBg}>
          <View style={styles.stripeCard}>
            
            {/* Header close */}
            {!paymentSuccess && !paymentProcessing ? (
              <TouchableOpacity 
                onPress={() => setSelectedPlan(null)}
                style={styles.closeModalBtn}
              >
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            ) : null}

            {/* 1. Stripe payment form */}
            {!paymentSuccess && selectedPlan && (
              <View style={styles.formContainer}>
                <View style={styles.stripeHeader}>
                  <Text style={styles.stripeLogoText}>stripe</Text>
                  <Text style={styles.stripeTitle}>SECURE CHECKOUT</Text>
                </View>

                <View style={styles.briefBox}>
                  <Text style={styles.briefLabel}>{selectedPlan.title.toUpperCase()}</Text>
                  <Text style={styles.briefVal}>{selectedPlan.price} / month</Text>
                </View>

                <View style={styles.inputsGrid}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.fieldLabel}>Card Number</Text>
                    <TextInput
                      value={cardNumber}
                      onChangeText={setCardNumber}
                      style={[styles.inputField, { fontWeight: "bold", letterSpacing: 1 }]}
                      keyboardType="numeric"
                      editable={!paymentProcessing}
                    />
                  </View>

                  <View style={styles.rowInputs}>
                    <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                      <Text style={styles.fieldLabel}>Expiry</Text>
                      <TextInput
                        value={cardExpiry}
                        onChangeText={setCardExpiry}
                        style={[styles.inputField, { textAlign: "center" }]}
                        placeholder="MM/YY"
                        keyboardType="numeric"
                        editable={!paymentProcessing}
                      />
                    </View>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                      <Text style={styles.fieldLabel}>CVC</Text>
                      <TextInput
                        value={cardCvc}
                        onChangeText={setCardCvc}
                        style={[styles.inputField, { textAlign: "center" }]}
                        placeholder="CVC"
                        secureTextEntry
                        keyboardType="numeric"
                        editable={!paymentProcessing}
                      />
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={handleCheckout}
                  disabled={paymentProcessing}
                  style={styles.payBtn}
                  activeOpacity={0.8}
                >
                  {paymentProcessing ? (
                    <ActivityIndicator size="small" color="#000" />
                  ) : (
                    <Text style={styles.payBtnText}>Pay {selectedPlan.price}</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {/* 2. Success Upgrade screen */}
            {paymentSuccess && selectedPlan && (
              <View style={styles.successContainer}>
                <Text style={styles.successEmoji}>🎉</Text>
                <Text style={styles.successTitle}>Upgrade Complete!</Text>
                <Text style={styles.successDesc}>
                  You are now upgraded to <Text style={{ fontWeight: "bold", color: "#FFF" }}>{selectedPlan.title}</Text> status. Enjoy elite workout metrics.
                </Text>

                <TouchableOpacity
                  onPress={handleCompleteUpgrade}
                  style={styles.completeUpgradeBtn}
                >
                  <Text style={styles.completeUpgradeText}>Start Training</Text>
                </TouchableOpacity>
              </View>
            )}

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
  backBtn: {
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
  headerTitle: {
    fontSize: 10,
    fontWeight: "900",
    color: COLORS.primary,
    letterSpacing: 1.5,
  },
  heroBox: {
    alignItems: "center",
    marginVertical: 16,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FFF",
    letterSpacing: -0.5,
  },
  heroDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 16,
    maxWidth: 280,
  },
  plansWrapper: {
    marginTop: 16,
    paddingBottom: 40,
  },
  planCard: {
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    padding: 20,
    marginBottom: 20,
  },
  cardProGlow: {
    borderColor: "rgba(217, 255, 74, 0.15)",
  },
  planCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
    paddingBottom: 16,
  },
  recommendLabel: {
    backgroundColor: COLORS.primary,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  recommendLabelText: {
    fontSize: 8,
    fontWeight: "900",
    color: "#000",
  },
  planTitle: {
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: -0.2,
  },
  planPriceBox: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  planPrice: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFF",
  },
  planPriceUnit: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: "bold",
  },
  featuresList: {
    marginVertical: 20,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  featureCheck: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "bold",
    marginRight: 10,
    marginTop: 1,
  },
  featureText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 16,
    flex: 1,
  },
  subscribeBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  subscribeBtnDisabled: {
    backgroundColor: "rgba(168, 255, 96, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(168, 255, 96, 0.2)",
  },
  subscribeBtnText: {
    color: "#000",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  modalOverlayBg: {
    flex: 1,
    backgroundColor: "rgba(7, 7, 8, 0.85)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  stripeCard: {
    backgroundColor: "#121217",
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 24,
    width: "100%",
    maxWidth: 320,
    position: "relative",
  },
  closeModalBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.04)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    color: "#FFF",
    fontSize: 10,
  },
  formContainer: {
    width: "100%",
  },
  stripeHeader: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
    paddingBottom: 16,
  },
  stripeLogoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    marginRight: 10,
  },
  stripeTitle: {
    fontSize: 10,
    fontWeight: "900",
    color: COLORS.textSecondary,
    letterSpacing: 1,
  },
  briefBox: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    padding: 12,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16,
  },
  briefLabel: {
    fontSize: 9,
    fontWeight: "900",
    color: COLORS.textSecondary,
  },
  briefVal: {
    fontSize: 11,
    fontWeight: "900",
    color: "#FFF",
  },
  inputsGrid: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 9,
    fontWeight: "900",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  inputField: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: "#FFF",
    fontSize: 13,
  },
  rowInputs: {
    flexDirection: "row",
  },
  payBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  payBtnText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  successContainer: {
    alignItems: "center",
    paddingVertical: 16,
  },
  successEmoji: {
    fontSize: 48,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFF",
    marginTop: 16,
  },
  successDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 16,
    marginTop: 8,
  },
  completeUpgradeBtn: {
    backgroundColor: COLORS.secondary,
    borderRadius: 16,
    width: "100%",
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24,
  },
  completeUpgradeText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
