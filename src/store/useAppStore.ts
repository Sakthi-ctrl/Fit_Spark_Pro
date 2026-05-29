import { create } from "zustand";

export interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: "Breakfast" | "Lunch" | "Dinner" | "Snack";
}

export interface WorkoutItem {
  id: string;
  title: string;
  duration: number;
  calories: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: "Strength Training" | "Fat Loss" | "Muscle Building" | "Cardio" | "Yoga" | "HIIT" | "CrossFit" | "Home Workout";
  equipment: string;
  exercises: { name: string; reps: string; duration?: string }[];
}

export interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  content: string;
  workoutName?: string;
  likes: number;
  comments: { author: string; content: string }[];
  likedByUser: boolean;
  timeAgo: string;
}

interface AppState {
  currentView: string;
  onboardingStep: number;
  user: {
    name: string;
    email: string;
    age: number;
    gender: string;
    weight: number;
    height: number;
    goal: string;
  } | null;
  otpCode: string;
  otpDigits: string[];
  activeWorkout: WorkoutItem | null;
  workoutHistory: { id: string; title: string; duration: number; calories: number; date: string }[];
  todayChallengeCompleted: boolean;
  waterLogged: number;
  waterGoal: number;
  foodLogs: FoodItem[];
  caloriesGoal: number;
  subscriptionTier: "Free" | "Basic" | "Pro" | "Elite";
  xp: number;
  streak: number;
  badges: { id: string; title: string; icon: string; description: string; date: string }[];
  chatMessages: Message[];
  isListening: boolean;
  communityPosts: CommunityPost[];
  wearables: { AppleWatch: boolean; GoogleFit: boolean; Fitbit: boolean; SamsungHealth: boolean };
  
  // Navigation & Onboarding Actions
  setView: (view: string) => void;
  setOnboardingStep: (step: number) => void;
  
  // Auth Actions
  setOtpDigits: (digits: string[]) => void;
  setUser: (user: AppState["user"]) => void;
  logout: () => void;
  
  // Workout Actions
  setActiveWorkout: (workout: WorkoutItem | null) => void;
  completeWorkout: (workout: WorkoutItem) => void;
  toggleChallenge: () => void;
  
  // Health Metrics & Sync
  addWater: (ml: number) => void;
  addFood: (food: Omit<FoodItem, "id">) => void;
  syncDevice: (device: keyof AppState["wearables"]) => void;
  
  // AI Trainer Actions
  addMessage: (text: string, sender: "user" | "ai") => void;
  setListening: (listening: boolean) => void;
  
  // Community Actions
  likePost: (id: string) => void;
  addComment: (postId: string, author: string, content: string) => void;
  createPost: (author: string, content: string, workoutName?: string) => void;
  
  // Subscription Actions
  subscribe: (tier: "Basic" | "Pro" | "Elite") => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentView: "splash",
  onboardingStep: 0,
  user: {
    name: "Sathyan",
    email: "sathyan@fitspark.com",
    age: 26,
    gender: "Male",
    weight: 78,
    height: 180,
    goal: "Muscle Building",
  },
  otpCode: "4920",
  otpDigits: ["", "", "", ""],
  activeWorkout: null,
  workoutHistory: [
    { id: "h1", title: "Full Body Blast", duration: 45, calories: 380, date: "2 days ago" },
    { id: "h2", title: "HIIT Cardio Burn", duration: 30, calories: 290, date: "4 days ago" },
    { id: "h3", title: "Power Squat Core", duration: 40, calories: 310, date: "1 week ago" },
  ],
  todayChallengeCompleted: false,
  waterLogged: 1250,
  waterGoal: 2500,
  foodLogs: [
    { id: "f1", name: "Avocado Toast & Eggs", calories: 420, protein: 18, carbs: 32, fat: 22, mealType: "Breakfast" },
    { id: "f2", name: "Grilled Chicken & Quinoa", calories: 580, protein: 45, carbs: 45, fat: 12, mealType: "Lunch" },
  ],
  caloriesGoal: 2400,
  subscriptionTier: "Free",
  xp: 1420,
  streak: 5,
  badges: [
    { id: "b1", title: "First Spark", icon: "⚡", description: "Completed initial setup", date: "5 days ago" },
    { id: "b2", title: "Water Warrior", icon: "💧", description: "Reached hydration goals", date: "3 days ago" },
    { id: "b3", title: "Streak Master", icon: "🔥", description: "Maintained a 5-day workout streak", date: "Today" },
  ],
  chatMessages: [
    { id: "m1", sender: "ai", text: "Hey Sathyan! I am Sparky, your AI Coach. Ready to crush some targets today? Ask me about training tips, dynamic warmups, or macro profiles.", timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
  ],
  isListening: false,
  communityPosts: [
    {
      id: "p1",
      author: "Alex Rivers",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
      content: "Just smashed a personal record in deadlifts today! 180kg for 5 reps. Highly recommend the Elite Strength Program in FitSpark. Let's get it!",
      workoutName: "Hypertrophy Chest & Back",
      likes: 24,
      comments: [
        { author: "Sathyan", content: "Absolute beast! Keep going, man." },
        { author: "Jessica Miller", content: "Inspiring work!" }
      ],
      likedByUser: false,
      timeAgo: "2h ago",
    },
    {
      id: "p2",
      author: "Emma Stone",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
      content: "Early morning HIIT. Hard to start but feels incredible. Fueling up with an avocado protein smoothie now.",
      likes: 18,
      comments: [],
      likedByUser: false,
      timeAgo: "5h ago",
    }
  ],
  wearables: {
    AppleWatch: true,
    GoogleFit: false,
    Fitbit: false,
    SamsungHealth: false,
  },

  // Actions
  setView: (view) => set({ currentView: view }),
  setOnboardingStep: (step) => set({ onboardingStep: step }),
  setOtpDigits: (digits) => set({ otpDigits: digits }),
  setUser: (user) => set({ user }),
  logout: () => set({ user: null, currentView: "auth", subscriptionTier: "Free" }),
  
  setActiveWorkout: (workout) => set({ activeWorkout: workout }),
  completeWorkout: (workout) =>
    set((state) => {
      const isAlreadyLogged = state.workoutHistory.some((h) => h.title === workout.title && h.date === "Just now");
      if (isAlreadyLogged) return state;

      const newLog = {
        id: "h" + (state.workoutHistory.length + 1),
        title: workout.title,
        duration: workout.duration,
        calories: workout.calories,
        date: "Just now",
      };
      
      const newBadges = [...state.badges];
      let newXp = state.xp + 150;
      let newStreak = state.streak;

      if (state.workoutHistory.length === 3) {
        newBadges.push({
          id: "b" + (newBadges.length + 1),
          title: "Calorie Crusher",
          icon: "🏋️",
          description: "Logged over 4 workout programs",
          date: "Just now",
        });
        newXp += 300;
        newStreak += 1;
      }

      return {
        workoutHistory: [newLog, ...state.workoutHistory],
        xp: newXp,
        streak: newStreak,
        badges: newBadges,
        currentView: "dashboard",
        activeWorkout: null,
      };
    }),
  toggleChallenge: () =>
    set((state) => {
      const nextCompleted = !state.todayChallengeCompleted;
      const bonusXp = nextCompleted ? 100 : -100;
      return {
        todayChallengeCompleted: nextCompleted,
        xp: state.xp + bonusXp,
      };
    }),
  addWater: (ml) =>
    set((state) => {
      const nextWater = state.waterLogged + ml;
      let extraXp = 0;
      let newBadges = [...state.badges];
      if (nextWater >= state.waterGoal && state.waterLogged < state.waterGoal) {
        extraXp = 50;
      }
      return {
        waterLogged: nextWater,
        xp: state.xp + extraXp,
        badges: newBadges,
      };
    }),
  addFood: (food) =>
    set((state) => {
      const newFood = {
        ...food,
        id: "f" + (state.foodLogs.length + 1),
      };
      return {
        foodLogs: [newFood, ...state.foodLogs],
        xp: state.xp + 30,
      };
    }),
  syncDevice: (device) =>
    set((state) => {
      const nextStatus = !state.wearables[device];
      return {
        wearables: {
          ...state.wearables,
          [device]: nextStatus,
        },
        xp: nextStatus ? state.xp + 50 : state.xp,
      };
    }),
  addMessage: (text, sender) =>
    set((state) => ({
      chatMessages: [
        ...state.chatMessages,
        { 
          id: "msg" + (state.chatMessages.length + 1), 
          sender, 
          text, 
          timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
        },
      ],
    })),
  setListening: (listening) => set({ isListening: listening }),
  
  likePost: (id) =>
    set((state) => ({
      communityPosts: state.communityPosts.map((post) => {
        if (post.id === id) {
          return {
            ...post,
            likes: post.likedByUser ? post.likes - 1 : post.likes + 1,
            likedByUser: !post.likedByUser,
          };
        }
        return post;
      }),
    })),
  addComment: (postId, author, content) =>
    set((state) => ({
      communityPosts: state.communityPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, { author, content }],
          };
        }
        return post;
      }),
    })),
  createPost: (author, content, workoutName) =>
    set((state) => {
      const newPost: CommunityPost = {
        id: "p" + (state.communityPosts.length + 3),
        author,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop",
        content,
        workoutName,
        likes: 0,
        comments: [],
        likedByUser: false,
        timeAgo: "Just now",
      };
      return {
        communityPosts: [newPost, ...state.communityPosts],
        xp: state.xp + 50,
      };
    }),
  subscribe: (tier) =>
    set({
      subscriptionTier: tier,
      currentView: "profile",
    }),
}));
