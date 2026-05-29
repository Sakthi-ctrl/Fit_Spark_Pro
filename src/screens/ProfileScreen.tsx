import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  TextInput,
  Image,
  Modal
} from "react-native";
import { useAppStore, CommunityPost } from "../store/useAppStore";
import { COLORS, SIZES } from "../styles/theme";

export default function ProfileScreen() {
  const user = useAppStore((state) => state.user);
  const setView = useAppStore((state) => state.setView);
  const logout = useAppStore((state) => state.logout);
  
  const streak = useAppStore((state) => state.streak);
  const xp = useAppStore((state) => state.xp);
  const badges = useAppStore((state) => state.badges);
  const subscriptionTier = useAppStore((state) => state.subscriptionTier);
  
  const communityPosts = useAppStore((state) => state.communityPosts);
  const likePost = useAppStore((state) => state.likePost);
  const addComment = useAppStore((state) => state.addComment);
  const createPost = useAppStore((state) => state.createPost);

  // States
  const [showSettings, setShowSettings] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [activePostCommentsId, setActivePostCommentsId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState("");

  const handleCreatePost = () => {
    if (!postContent.trim()) return;
    createPost(user?.name || "Athlete", postContent);
    setPostContent("");
  };

  const handleSendComment = (postId: string) => {
    if (!commentInput.trim()) return;
    addComment(postId, user?.name || "Athlete", commentInput);
    setCommentInput("");
  };

  const activePost = communityPosts.find((p) => p.id === activePostCommentsId);

  return (
    <SafeAreaView style={styles.container}>
      
      {/* 1. BASE PROFILE VIEW */}
      {!showSettings && (
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Card */}
          <View style={styles.profileHeaderBox}>
            <View style={styles.headerTop}>
              <Text style={styles.miniLabel}>ATHLETE PROFILE</Text>
              <TouchableOpacity 
                onPress={() => setShowSettings(true)}
                style={styles.settingsBtn}
              >
                <Text style={styles.settingsIcon}>⚙️</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.avatarRow}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>
                  {user?.name ? user.name[0].toUpperCase() : "A"}
                </Text>
              </View>

              <View style={styles.avatarDetails}>
                <View style={styles.nameRow}>
                  <Text style={styles.athleteName}>{user?.name || "Athlete"}</Text>
                  {subscriptionTier !== "Free" ? (
                    <View style={styles.tierBadge}>
                      <Text style={styles.tierText}>{subscriptionTier.toUpperCase()}</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={styles.athleteEmail}>{user?.email || "sathyan@fitspark.com"}</Text>
              </View>
            </View>

            {/* Biometric Stats */}
            <View style={styles.biometricsRow}>
              <View style={styles.bioItem}>
                <Text style={styles.bioLabel}>HEIGHT</Text>
                <Text style={styles.bioVal}>{user?.height || 180} cm</Text>
              </View>
              <View style={[styles.bioItem, styles.bioBorder]}>
                <Text style={styles.bioLabel}>WEIGHT</Text>
                <Text style={styles.bioVal}>{user?.weight || 78} kg</Text>
              </View>
              <View style={styles.bioItem}>
                <Text style={styles.bioLabel}>GOAL</Text>
                <Text style={[styles.bioVal, { color: COLORS.primary }]} numberOfLines={1}>{user?.goal || "Muscle"}</Text>
              </View>
            </View>
          </View>

          {/* Subscription Manager */}
          <View style={styles.sectionBox}>
            <View style={styles.planManager}>
              <View>
                <Text style={styles.planMini}>MEMBERSHIP STATUS</Text>
                <Text style={styles.planStatusText}>
                  {subscriptionTier === "Free" ? "Free Spark Tier" : `FitSpark ${subscriptionTier} Member`}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setView("subscription")}
                style={styles.manageBtn}
              >
                <Text style={styles.manageText}>
                  {subscriptionTier === "Free" ? "UPGRADE" : "MANAGE"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Interactive Social Community Feed */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>Community Feed</Text>

            {/* Post creator */}
            <View style={styles.postCreator}>
              <TextInput
                value={postContent}
                onChangeText={setPostContent}
                style={styles.postInput}
                placeholder="Share your daily training achievements..."
                placeholderTextColor="rgba(255,255,255,0.25)"
              />
              <TouchableOpacity
                onPress={handleCreatePost}
                style={styles.postBtn}
              >
                <Text style={styles.postBtnText}>+</Text>
              </TouchableOpacity>
            </View>

            {/* Posts Grid */}
            <View style={styles.postsList}>
              {communityPosts.map((post) => (
                <View key={post.id} style={styles.postCard}>
                  
                  {/* Author */}
                  <View style={styles.authorRow}>
                    <Image source={{ uri: post.avatar }} style={styles.authorAvatar as any} />
                    <View>
                      <Text style={styles.authorName}>{post.author}</Text>
                      <Text style={styles.timeLabel}>{post.timeAgo}</Text>
                    </View>
                  </View>

                  <Text style={styles.postContentText}>{post.content}</Text>

                  {post.workoutName ? (
                    <View style={styles.postTagBox}>
                      <Text style={styles.postTagText}>🏋️ WORKOUT: {post.workoutName.toUpperCase()}</Text>
                    </View>
                  ) : null}

                  {/* Actions Row */}
                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      onPress={() => likePost(post.id)}
                      style={styles.actionItem}
                    >
                      <Text style={[styles.actionIcon, post.likedByUser ? styles.likedIcon : null]}>
                        {post.likedByUser ? "❤️" : "🤍"}
                      </Text>
                      <Text style={[styles.actionVal, post.likedByUser ? styles.likedText : null]}>{post.likes}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => setActivePostCommentsId(post.id)}
                      style={styles.actionItem}
                    >
                      <Text style={styles.actionIcon}>💬</Text>
                      <Text style={styles.actionVal}>{post.comments.length}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.actionItem, { marginLeft: "auto" }]}>
                      <Text style={styles.actionIcon}>🔗</Text>
                    </TouchableOpacity>
                  </View>

                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      )}

      {/* 2. SETTINGS VIEW */}
      {showSettings && (
        <View style={styles.settingsView}>
          <View style={styles.settingsHeader}>
            <Text style={styles.settingsTitle}>SETTINGS</Text>
            <TouchableOpacity
              onPress={() => setShowSettings(false)}
              style={styles.closeSettingsBtn}
            >
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.settingsBody}>
            <View style={styles.settingsCard}>
              <Text style={styles.settingsLabel}>Security Code OTP</Text>
              <View style={styles.otpLabelBadge}>
                <Text style={styles.otpLabelText}>4920</Text>
              </View>
            </View>

            <View style={styles.settingsCard}>
              <Text style={styles.settingsLabel}>Account Sync</Text>
              <Text style={[styles.settingsLabel, { color: COLORS.secondary, fontWeight: "900" }]}>Active</Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                logout();
                setShowSettings(false);
              }}
              style={styles.logoutBtn}
            >
              <Text style={styles.logoutBtnText}>Deauthorize Session</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 3. COMMUNITY COMMENTS DRAWER SHEET */}
      <Modal
        visible={activePost !== undefined}
        animationType="slide"
        transparent
      >
        {activePost && (
          <View style={styles.drawerOverlayBg}>
            <View style={styles.drawerCard}>
              <View style={styles.drawerHeaderRow}>
                <View>
                  <Text style={styles.drawerMini}>COMMENTS FEED</Text>
                  <Text style={styles.drawerTitleText}>Post by {activePost.author}</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => setActivePostCommentsId(null)}
                  style={styles.closeDrawer}
                >
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Comments Scroll */}
              <ScrollView 
                contentContainerStyle={styles.drawerScroll}
                showsVerticalScrollIndicator={false}
              >
                {activePost.comments.length > 0 ? (
                  activePost.comments.map((comm, idx) => (
                    <View key={idx} style={styles.commentItem}>
                      <View style={styles.commentHeaderRow}>
                        <Text style={styles.commentAuthor}>{comm.author}</Text>
                        <View style={styles.dotDivider} />
                        <Text style={styles.commentTime}>Just now</Text>
                      </View>
                      <Text style={styles.commentBody}>{comm.content}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.emptyCommentsText}>Be the first to join the conversation.</Text>
                )}
              </ScrollView>

              {/* Comment sender */}
              <View style={styles.commentInputRow}>
                <TextInput
                  value={commentInput}
                  onChangeText={setCommentInput}
                  style={styles.commentInputField}
                  placeholder="Add a public comment..."
                  placeholderTextColor="rgba(255,255,255,0.25)"
                />
                <TouchableOpacity
                  onPress={() => handleSendComment(activePost.id)}
                  style={styles.commentSendBtn}
                >
                  <Text style={styles.sendIconText}>➔</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
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
  profileHeaderBox: {
    backgroundColor: "#121217",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    borderRadius: SIZES.radius,
    padding: 20,
    marginBottom: 20,
    marginTop: 10,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  miniLabel: {
    fontSize: 9,
    fontWeight: "900",
    color: COLORS.textSecondary,
    letterSpacing: 1.5,
  },
  settingsBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.04)",
    alignItems: "center",
    justifyContent: "center",
  },
  settingsIcon: {
    fontSize: 14,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "rgba(217, 255, 74, 0.05)",
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.primary,
  },
  avatarDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  athleteName: {
    fontSize: 16,
    fontWeight: "900",
    color: "#FFF",
    letterSpacing: -0.2,
  },
  tierBadge: {
    backgroundColor: COLORS.primary,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginLeft: 8,
  },
  tierText: {
    fontSize: 7,
    fontWeight: "900",
    color: "#000",
  },
  athleteEmail: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  biometricsRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
    paddingTop: 16,
  },
  bioItem: {
    flex: 1,
    alignItems: "center",
  },
  bioBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  bioLabel: {
    fontSize: 8,
    fontWeight: "900",
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  bioVal: {
    fontSize: 11,
    fontWeight: "900",
    color: "#FFF",
    marginTop: 4,
  },
  sectionBox: {
    marginBottom: 20,
  },
  planManager: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  planMini: {
    fontSize: 8,
    fontWeight: "900",
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  planStatusText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#FFF",
    marginTop: 2,
  },
  manageBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  manageText: {
    fontSize: 9,
    fontWeight: "900",
    color: "#000",
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "900",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  postCreator: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  postInput: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    color: "#FFF",
    fontSize: 12,
    marginRight: 10,
  },
  postBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  postBtnText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  postsList: {
    marginTop: 12,
    paddingBottom: 40,
  },
  postCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    padding: 16,
    marginBottom: 16,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    marginRight: 12,
  },
  authorName: {
    fontSize: 11,
    fontWeight: "900",
    color: "#FFF",
  },
  timeLabel: {
    fontSize: 8,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: "bold",
  },
  postContentText: {
    fontSize: 12,
    color: "#FFF",
    lineHeight: 18,
  },
  postTagBox: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(217, 255, 74, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(217, 255, 74, 0.15)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginTop: 12,
  },
  postTagText: {
    fontSize: 8,
    fontWeight: "900",
    color: COLORS.primary,
  },
  actionsRow: {
    flexDirection: "row",
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
    paddingTop: 12,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  actionIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  actionVal: {
    fontSize: 11,
    fontWeight: "bold",
    color: COLORS.textSecondary,
  },
  likedIcon: {
    color: COLORS.red,
  },
  likedText: {
    color: COLORS.red,
    fontWeight: "bold",
  },
  settingsView: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 24,
  },
  settingsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
    paddingBottom: 16,
    paddingTop: 10,
  },
  settingsTitle: {
    fontSize: 12,
    fontWeight: "900",
    color: COLORS.primary,
    letterSpacing: 1.5,
  },
  closeSettingsBtn: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 99,
  },
  closeBtnText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  settingsBody: {
    marginTop: 24,
  },
  settingsCard: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  settingsLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFF",
  },
  otpLabelBadge: {
    backgroundColor: "rgba(217, 255, 74, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(217, 255, 74, 0.2)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  otpLabelText: {
    fontSize: 10,
    fontWeight: "900",
    color: COLORS.primary,
  },
  logoutBtn: {
    backgroundColor: "rgba(239, 68, 68, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24,
  },
  logoutBtnText: {
    color: COLORS.red,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  drawerOverlayBg: {
    flex: 1,
    backgroundColor: "rgba(7, 7, 8, 0.85)",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  drawerCard: {
    width: "100%",
    backgroundColor: "#121217",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 24,
    maxHeight: "75%",
  },
  drawerHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
    paddingBottom: 16,
  },
  drawerMini: {
    fontSize: 8,
    fontWeight: "900",
    color: COLORS.textSecondary,
  },
  drawerTitleText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#FFF",
    marginTop: 2,
  },
  closeDrawer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    color: "#FFF",
    fontSize: 10,
  },
  drawerScroll: {
    paddingVertical: 16,
  },
  commentItem: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
  },
  commentHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  commentAuthor: {
    fontSize: 10,
    fontWeight: "900",
    color: COLORS.primary,
  },
  dotDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginHorizontal: 8,
  },
  commentTime: {
    fontSize: 8,
    color: COLORS.textSecondary,
  },
  commentBody: {
    fontSize: 11,
    color: "#FFF",
    lineHeight: 16,
  },
  emptyCommentsText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginVertical: 20,
  },
  commentInputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
    paddingTop: 16,
  },
  commentInputField: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    color: "#FFF",
    fontSize: 11,
    marginRight: 10,
  },
  commentSendBtn: {
    backgroundColor: COLORS.primary,
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  sendIconText: {
    fontSize: 14,
    color: "#000",
  },
});
