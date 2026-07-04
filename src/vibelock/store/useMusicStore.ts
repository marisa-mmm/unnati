import { useState, useCallback } from "react";
import { songs, moodModes } from "../data/mockData";

export type MoodMode = "study" | "sleep" | "gym" | "travel" | null;
export type Toast = { id: string; message: string; type: "success" | "info" | "warning" | "premium" };

export type UserProfile = {
  name: string;
  email: string;
  avatar: string;
  favoriteArtists: string[];
  isLoggedIn: boolean;
};

export function useMusicStore() {
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeMood, setActiveMood] = useState<MoodMode>(null);
  const [adSkips, setAdSkips] = useState(10);
  const [isPremium, setIsPremium] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadedSongs, setDownloadedSongs] = useState<Set<number>>(new Set());
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [likedSongs, setLikedSongs] = useState<Set<number>>(new Set([1, 4]));
  const [volume, setVolume] = useState(75);
  const [progress, setProgress] = useState(35);
  const [isMicOpen, setIsMicOpen] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [showRewardAd, setShowRewardAd] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeNav, setActiveNav] = useState("Home");
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeSearchMode, setActiveSearchMode] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "",
    email: "",
    avatar: "🎵",
    favoriteArtists: [],
    isLoggedIn: false,
  });

  const addToast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const playSong = useCallback((song: typeof songs[0]) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setShowLyrics(false); // reset lyrics on new song
    addToast(`▶️ Now playing "${song.title}"`, "info");
  }, [addToast]);

  const togglePlay = useCallback(() => {
    setIsPlaying((p) => !p);
  }, []);

  const toggleLike = useCallback((id: number) => {
    setLikedSongs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); addToast("💔 Removed from Liked Songs"); }
      else { next.add(id); addToast("❤️ Added to Liked Songs"); }
      return next;
    });
  }, [addToast]);

  const downloadSong = useCallback((song: typeof songs[0]) => {
    if (!isPremium) {
      setShowPremiumModal(true);
      addToast("🔒 Download requires Premium", "premium");
      return;
    }
    if (downloadedSongs.has(song.id)) { addToast(`✅ Already downloaded: "${song.title}"`); return; }
    setDownloadingId(song.id);
    setTimeout(() => {
      setDownloadedSongs((prev) => new Set([...prev, song.id]));
      setDownloadingId(null);
      addToast(`⬇️ Downloaded: "${song.title}"`, "success");
    }, 2500);
  }, [isPremium, downloadedSongs, addToast]);

  const setMood = useCallback((mood: MoodMode) => {
    setActiveMood((prev) => prev === mood ? null : mood);
    const found = moodModes.find((m) => m.id === mood);
    if (found) addToast(`${found.emoji} Switched to ${found.label}`, "info");
  }, [addToast]);

  const claimRewardAd = useCallback(() => {
    setAdSkips((prev) => Math.min(prev + 5, 20));
    setShowRewardAd(false);
    setShowConfetti(true);
    addToast("🎉 +5 Ad Skips Added Successfully!", "success");
    setTimeout(() => setShowConfetti(false), 3000);
  }, [addToast]);

  const upgradePremium = useCallback(() => {
    setIsPremium(true);
    setShowPremiumModal(false);
    setAdSkips(999);
    addToast("👑 Welcome to VibeLock Premium!", "success");
  }, [addToast]);

  const createAccount = useCallback((name: string, email: string, favoriteArtists: string[]) => {
    setUserProfile({
      name,
      email,
      avatar: "🎵",
      favoriteArtists,
      isLoggedIn: true,
    });
    setShowOnboarding(false);
    setShowAuthModal(false);
    addToast(`🎉 Welcome to VibeLock AI, ${name}!`, "success");
  }, [addToast]);

  const logout = useCallback(() => {
    setUserProfile({ name: "", email: "", avatar: "🎵", favoriteArtists: [], isLoggedIn: false });
    addToast("👋 Signed out successfully", "info");
  }, [addToast]);

  return {
    currentSong, setCurrentSong,
    isPlaying, togglePlay, playSong,
    activeMood, setMood,
    adSkips, setAdSkips,
    isPremium, setIsPremium, upgradePremium,
    toasts, addToast,
    isLoading, setIsLoading,
    downloadedSongs, downloadingId, downloadSong,
    likedSongs, toggleLike,
    volume, setVolume,
    progress, setProgress,
    isMicOpen, setIsMicOpen,
    isShuffled, setIsShuffled,
    isRepeating, setIsRepeating,
    showRewardAd, setShowRewardAd,
    showConfetti,
    claimRewardAd,
    activeNav, setActiveNav,
    showPremiumModal, setShowPremiumModal,
    sidebarOpen, setSidebarOpen,
    showLyrics, setShowLyrics,
    showOnboarding, setShowOnboarding,
    showAuthModal, setShowAuthModal,
    activeSearchMode, setActiveSearchMode,
    userProfile, createAccount, logout,
  };
}

export type MusicStore = ReturnType<typeof useMusicStore>;
