import React, { useState, useRef } from "react";
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

export default function AITrainer() {
  const chatMessages = useAppStore((state) => state.chatMessages);
  const addMessage = useAppStore((state) => state.addMessage);
  const isListening = useAppStore((state) => state.isListening);
  const setListening = useAppStore((state) => state.setListening);

  const [inputVal, setInputVal] = useState("");
  const scrollRef = useRef<ScrollView>(null);

  const quickPrompts = [
    { text: "Injury Prevention Tips", icon: "🛡️" },
    { text: "Dynamic 5-Min Warmup", icon: "🧭" },
    { text: "Optimize Post-Workout Carbs", icon: "🍏" },
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    addMessage(text, "user");
    setInputVal("");
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // AI Replies
    setTimeout(() => {
      let replyText = "Interesting focus! Based on your target goals, let me customize some expert points for you. ";
      const lowercase = text.toLowerCase();

      if (lowercase.includes("injury") || lowercase.includes("pain") || lowercase.includes("knee")) {
        replyText = "Always maintain strict form control. Substitute heavy loaded compound squates for eccentric leg extensions or dynamic lunges, and focus on building strong supporting connective tissues.";
      } else if (lowercase.includes("warmup") || lowercase.includes("warm up") || lowercase.includes("routine")) {
        replyText = "Start with dynamic warmups to raise cardiac rates safely: \n1. Leg Swings: 15/leg\n2. T-Spine rotations: 8/side\n3. World Greatest Stretch: 5/side\nFollow this dynamic routing to lubricate synovial joints.";
      } else if (lowercase.includes("carb") || lowercase.includes("nutrition") || lowercase.includes("protein")) {
        replyText = "Consume 30-40g of fast digesting whey isolate protein paired with 50-80g of complex carbs (such as sweet potatoes or jasmine rice) within 90 minutes post-workout to fuel protein synthesis.";
      } else {
        replyText = "I highly recommend structured hypertrophy programs, hitting at least 2.5L of water intake today, and aiming for 8 hours of deep sleep to maximize muscle fibers recovery.";
      }

      addMessage(replyText, "ai");
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1200);
  };

  const handleToggleVoice = () => {
    if (!isListening) {
      setListening(true);
      setTimeout(() => {
        setListening(false);
        handleSend("Injury prevention dynamic warmup");
      }, 3000);
    } else {
      setListening(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Banner */}
        <View style={styles.coachBanner}>
          <View style={styles.coachLeft}>
            <View style={styles.avatarGlow}>
              <Text style={styles.avatarText}>🤖</Text>
            </View>
            <View>
              <Text style={styles.coachName}>COACH SPARKY ⚡</Text>
              <Text style={styles.coachLabel}>AI PERSONAL TRAINER</Text>
            </View>
          </View>

          <TouchableOpacity 
            onPress={handleToggleVoice}
            style={[
              styles.micBtn,
              isListening ? styles.micBtnActive : null
            ]}
          >
            <Text style={styles.micIcon}>{isListening ? "🎙️" : "🎙️"}</Text>
          </TouchableOpacity>
        </View>

        {/* Voice listening waves */}
        {isListening && (
          <View style={styles.voiceOverlay}>
            <Text style={styles.voiceLabel}>COACH LISTENING FOR VOICE...</Text>
            <View style={styles.waveRow}>
              <View style={[styles.waveBar, { height: 16 }]} />
              <View style={[styles.waveBar, { height: 28 }]} />
              <View style={[styles.waveBar, { height: 20 }]} />
              <View style={[styles.waveBar, { height: 32 }]} />
              <View style={[styles.waveBar, { height: 12 }]} />
            </View>
          </View>
        )}

        {/* Chats Box */}
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.chatsScroll}
          showsVerticalScrollIndicator={false}
        >
          {chatMessages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.msgWrapper,
                msg.sender === "user" ? styles.msgRight : styles.msgLeft
              ]}
            >
              <View style={[
                styles.msgBubble,
                msg.sender === "user" ? styles.bubbleUser : styles.bubbleAI
              ]}>
                <Text style={[
                  styles.msgText,
                  msg.sender === "user" ? styles.textUser : styles.textAI
                ]}>{msg.text}</Text>
              </View>
              <Text style={styles.msgTime}>{msg.timestamp}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Quick prompt selector */}
        {chatMessages.length < 4 && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.promptScroll}
          >
            {quickPrompts.map((p, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => handleSend(p.text)}
                style={styles.promptCard}
              >
                <Text style={styles.promptEmoji}>{p.icon}</Text>
                <Text style={styles.promptText}>{p.text}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Input Bar */}
        <View style={styles.inputArea}>
          <TextInput
            value={inputVal}
            onChangeText={setInputVal}
            style={styles.chatInput}
            placeholder="Ask dynamic warmups, metabolic cards..."
            placeholderTextColor="rgba(255,255,255,0.2)"
          />
          <TouchableOpacity
            onPress={() => handleSend(inputVal)}
            style={styles.sendBtn}
          >
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  coachBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
    backgroundColor: "#121217",
  },
  coachLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarGlow: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
  },
  coachName: {
    fontSize: 12,
    fontWeight: "900",
    color: "#FFF",
    letterSpacing: -0.2,
  },
  coachLabel: {
    fontSize: 8,
    fontWeight: "900",
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  micBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  micBtnActive: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderColor: "rgba(239, 68, 68, 0.25)",
  },
  micIcon: {
    fontSize: 16,
  },
  voiceOverlay: {
    height: 80,
    backgroundColor: "rgba(217, 255, 74, 0.03)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(217, 255, 74, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  voiceLabel: {
    fontSize: 8,
    fontWeight: "900",
    color: COLORS.primary,
    letterSpacing: 1,
    marginBottom: 8,
  },
  waveRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  waveBar: {
    width: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    marginHorizontal: 3,
  },
  chatsScroll: {
    padding: 24,
    paddingBottom: 40,
  },
  msgWrapper: {
    marginBottom: 16,
    maxWidth: "80%",
  },
  msgRight: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  msgLeft: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },
  msgBubble: {
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  bubbleUser: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    borderTopRightRadius: 2,
  },
  bubbleAI: {
    backgroundColor: COLORS.card,
    borderColor: "rgba(255,255,255,0.05)",
    borderTopLeftRadius: 2,
  },
  msgText: {
    fontSize: 12,
    lineHeight: 18,
  },
  textUser: {
    color: "#000",
    fontWeight: "bold",
  },
  textAI: {
    color: "#FFF",
  },
  msgTime: {
    fontSize: 8,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  promptScroll: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  promptCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginRight: 8,
    height: 34,
  },
  promptEmoji: {
    fontSize: 12,
    marginRight: 6,
  },
  promptText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#FFF",
  },
  inputArea: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chatInput: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: "#FFF",
    fontSize: 12,
    marginRight: 10,
  },
  sendBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  sendText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#000",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
