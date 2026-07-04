import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMusicStore } from "./store/useMusicStore";
import { moodModes, songs } from "./data/mockData";

// Auth landing
import { AuthLandingScreen } from "./components/ui/AuthLandingScreen";

// App Components
import { Sidebar, SidebarToggle, MobileNav } from "./components/Sidebar";
import { HeroSection } from "./components/HeroSection";
import { SmartDiscovery, MoodModes } from "./components/DiscoverySection";
import { AIRecommendations, TrendingSection, RecentSearches } from "./components/MusicSections";
import { PremiumSection, RewardAdModal, PremiumModal } from "./components/PremiumSection";
import { AIInsights } from "./components/AIInsights";
import { BottomPlayer } from "./components/BottomPlayer";
import { Footer } from "./components/Footer";
import {
  FloatingParticles,
  AmbientGlow,
  LoadingScreen,
  ToastContainer,
} from "./components/ui/CoreComponents";
import { DownloadsPage, LibraryPage, ProfilePage } from "./components/PageViews";

export default function VibeLockApp() {
  const store = useMusicStore();
  const {
    isLoading, setIsLoading,
    activeMood,
    sidebarOpen,
    isPlaying, setProgress,
    setShowLyrics,
    userProfile,
  } = store;

  // Inject songs array into store so BottomPlayer can reference it
  (store as any).songs = songs;

  // Progress bar auto-advance when playing
  useEffect(() => {
    if (!isPlaying) return;
    const t = setInterval(() => {
      setProgress((prev: number) => (prev >= 100 ? 0 : prev + 0.08));
    }, 100);
    return () => clearInterval(t);
  }, [isPlaying, setProgress]);

  // Auto-show lyrics 1.5 s after a song starts playing
  useEffect(() => {
    if (!isPlaying) return;
    const t = setTimeout(() => setShowLyrics(true), 1500);
    return () => clearTimeout(t);
  }, [store.currentSong.id, isPlaying, setShowLyrics]);

  const activeMoodData = moodModes.find((m) => m.id === activeMood);

  // ── 1. Loading screen ─────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div style={{ background: "#08080C", minHeight: "100vh" }}>
        <LoadingScreen onDone={() => setIsLoading(false)} />
      </div>
    );
  }

  // ── 2. Auth screen — shown until user logs in ─────────────────────────────
  if (!userProfile.isLoggedIn) {
    return (
      <div style={{ background: "#08080C", minHeight: "100vh" }}>
        <AuthLandingScreen store={store} />
        {/* Toast layer on top of auth too */}
        <ToastContainer toasts={store.toasts} />
      </div>
    );
  }

  const renderContent = () => {
    switch (store.activeNav) {
      case "Discover":
        return (
          <>
            <SmartDiscovery store={store} />
            <TrendingSection store={store} />
          </>
        );
      case "Smart Search":
        return (
          <>
            <HeroSection store={store} />
            <RecentSearches store={store} />
          </>
        );
      case "Mood Modes":
        return <MoodModes store={store} />;
      case "Downloads":
        return <DownloadsPage store={store} />;
      case "Premium":
        return <PremiumSection store={store} />;
      case "Library":
        return <LibraryPage store={store} />;
      case "Profile":
        return <ProfilePage store={store} />;
      case "Home":
      default:
        return (
          <>
            <HeroSection store={store} />
            <AIRecommendations store={store} />
            <TrendingSection store={store} />
            <AIInsights />
            <RecentSearches store={store} />
            <PremiumSection store={store} />
          </>
        );
    }
  };

  // ── 3. Main app ──────────────────────────────────────────────────────────
  return (
    <div
      style={{
        background: "#08080C",
        fontFamily: "'Inter', 'Plus Jakarta Sans', sans-serif",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      {/* Background FX */}
      <FloatingParticles count={18} />
      <AmbientGlow moodBg={activeMoodData?.ambientBg} />

      {/* Collapsible Sidebar */}
      <Sidebar store={store} />

      {/* Sidebar toggle — only visible when sidebar is closed */}
      <AnimatePresence>
        {!sidebarOpen && <SidebarToggle store={store} />}
      </AnimatePresence>

      {/* Main scrollable area — shifts right when sidebar is open */}
      <motion.main
        animate={{ paddingLeft: sidebarOpen ? 256 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ paddingBottom: 130, minHeight: "100vh" }}
      >
        <div className="w-full overflow-x-hidden">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            {/* Spacer for toggle button */}
            <div className="h-4" />

            <AnimatePresence mode="wait">
              <motion.div
                key={store.activeNav}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
            <Footer />
          </div>
        </div>
      </motion.main>

      {/* Mobile bottom nav */}
      <MobileNav store={store} />

      {/* Sticky music player */}
      <BottomPlayer store={store} />

      {/* Modals */}
      <RewardAdModal store={store} />
      <PremiumModal store={store} />

      {/* Toasts */}
      <ToastContainer toasts={store.toasts} />
    </div>
  );
}
