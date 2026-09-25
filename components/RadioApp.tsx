"use client";

import React, { useState, useEffect } from "react";
import { useAudio } from "../context/AudioContext";
import { HomeScreen } from "./HomeScreen";
import { SearchScreen } from "./SearchScreen";
import { NowPlayingDrawer } from "./NowPlayingDrawer";
import { MiniPlayer } from "./MiniPlayer";
import { StationLogo } from "./StationLogo";
import { STATIONS } from "../data/stations";
import { AutoUpdaterModal } from "./AutoUpdaterModal";
import { Capacitor } from "@capacitor/core";
import { App as CapApp } from "@capacitor/app";
import { StatusBar, Style } from "@capacitor/status-bar";
import {
  Radio,
  Search,
  Heart,
  Disc3,
} from "lucide-react";

export const RadioApp: React.FC = () => {
  const {
    currentStation,
    isPlaying,
    togglePlay,
    nextStation,
    prevStation,
    toggleMute,
    nowPlayingOpen,
    setNowPlayingOpen,
    lang,
  } = useAudio();

  const [activeTab, setActiveTab] = useState<"home" | "search" | "favorites">("home");

  // Setup Capacitor Android Status Bar & Back Button
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      try {
        StatusBar.setStyle({ style: Style.Dark });
        StatusBar.setBackgroundColor({ color: "#2a1789" });
        StatusBar.setOverlaysWebView({ overlay: false });
      } catch (err) {
        console.warn("StatusBar setup error:", err);
      }

      // Android hardware back button handler
      const backListener = CapApp.addListener("backButton", ({ canGoBack }) => {
        if (nowPlayingOpen) {
          setNowPlayingOpen(false);
        } else if (activeTab !== "home") {
          setActiveTab("home");
        } else {
          CapApp.minimizeApp();
        }
      });

      return () => {
        backListener.then((sub) => sub.remove()).catch(() => {});
      };
    }
  }, [nowPlayingOpen, activeTab, setNowPlayingOpen]);

  // Functional keyboard shortcuts for desktop / web testing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        nextStation();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        prevStation();
      } else if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        toggleMute();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay, nextStation, prevStation, toggleMute]);

  return (
    <div className="min-h-screen w-full bg-[#1b1049] flex justify-center items-center text-slate-800 antialiased font-sans select-none">
      {/* Mobile-First App Shell: Full viewport on mobile screens, elegant centered card on desktop */}
      <div className="w-full min-h-screen sm:min-h-[820px] sm:max-h-[94vh] sm:max-w-md sm:rounded-[36px] bg-[#f8f9fd] shadow-2xl relative flex flex-col overflow-hidden sm:ring-1 sm:ring-white/10">
        
        {/* Main Content Area */}
        <div className="flex-1 relative overflow-hidden flex flex-col">
          {activeTab === "home" && (
            <HomeScreen onNavigateToSearch={() => setActiveTab("search")} />
          )}

          {activeTab === "search" && <SearchScreen />}

          {activeTab === "favorites" && (
            <FavoritesView onNavigateToSearch={() => setActiveTab("search")} />
          )}

          {/* Full Screen Slide-in Now Playing Drawer */}
          <NowPlayingDrawer />
        </div>

        {/* Global Floating Mini Player (Always docked cleanly above the bottom navigation bar) */}
        <div className="px-3 pb-1 z-30 pointer-events-auto shrink-0 bg-gradient-to-t from-white via-white/80 to-transparent pt-1">
          <MiniPlayer variant="dark" />
        </div>

        {/* Fixed Native-Style Bottom Navigation Bar with Safe Area Insets */}
        <nav className="bg-white border-t border-slate-100 flex items-center justify-around px-6 pt-2 pb-[max(env(safe-area-inset-bottom,0px),0.75rem)] shrink-0 z-30 shadow-lg">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center gap-1 transition-all py-1 ${
              activeTab === "home"
                ? "text-indigo-600 font-extrabold scale-105"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Radio className="w-5 h-5" />
            <span className="text-[11px] font-semibold tracking-tight">
              {lang === "bn" ? "রেডিও" : "Discover"}
            </span>
            {activeTab === "home" && (
              <span className="w-1 h-1 bg-indigo-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("search")}
            className={`flex flex-col items-center gap-1 transition-all py-1 ${
              activeTab === "search"
                ? "text-indigo-600 font-extrabold scale-105"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Search className="w-5 h-5" />
            <span className="text-[11px] font-semibold tracking-tight">
              {lang === "bn" ? "খুঁজুন" : "Search"}
            </span>
            {activeTab === "search" && (
              <span className="w-1 h-1 bg-indigo-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("favorites")}
            className={`flex flex-col items-center gap-1 transition-all py-1 ${
              activeTab === "favorites"
                ? "text-indigo-600 font-extrabold scale-105"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Heart
              className={`w-5 h-5 ${
                activeTab === "favorites" ? "fill-current" : ""
              }`}
            />
            <span className="text-[11px] font-semibold tracking-tight">
              {lang === "bn" ? "প্রিয়" : "Favorites"}
            </span>
            {activeTab === "favorites" && (
              <span className="w-1 h-1 bg-indigo-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setNowPlayingOpen(true)}
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-indigo-600 transition-all py-1"
            title="Now Playing Player"
          >
            <Disc3
              className={`w-5 h-5 ${
                isPlaying
                  ? "text-indigo-600 animate-[spin_4s_linear_infinite]"
                  : ""
              }`}
            />
            <span className="text-[11px] font-semibold tracking-tight">
              {lang === "bn" ? "প্লেয়ার" : "Player"}
            </span>
          </button>
        </nav>

        {/* In-App Auto Updater Modal (Checks GitHub releases for updates) */}
        <AutoUpdaterModal />
      </div>
    </div>
  );
};

// Clean Favorites View
const FavoritesView: React.FC<{ onNavigateToSearch: () => void }> = ({
  onNavigateToSearch,
}) => {
  const { favorites, playStation, currentStation, isPlaying, lang, toggleFavorite } =
    useAudio();

  const favoriteList = STATIONS.filter((s) => favorites.includes(s.id));

  return (
    <div className="flex flex-col h-full bg-[#f8f9fd] text-slate-800 p-5 overflow-y-auto no-scrollbar relative pt-[max(env(safe-area-inset-top,0px),1rem)] pb-8">
      <div className="flex items-center justify-between mb-4 pt-1">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            {lang === "bn" ? "প্রিয় রেডিও স্টেশন" : "Favorite Stations"}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {favoriteList.length}{" "}
            {lang === "bn" ? "টি স্টেশন সংরক্ষিত" : "stations pinned"}
          </p>
        </div>

        <button
          onClick={onNavigateToSearch}
          className="text-xs font-bold text-indigo-600 hover:underline"
        >
          {lang === "bn" ? "+ আরো খুঁজুন" : "+ Discover"}
        </button>
      </div>

      {favoriteList.length === 0 ? (
        <div className="py-24 text-center text-slate-400">
          <Heart className="w-12 h-12 mx-auto text-slate-300 mb-2.5" />
          <p className="font-bold text-sm text-slate-600">
            {lang === "bn" ? "কোন প্রিয় স্টেশন যোগ করা হয়নি" : "No favorites yet"}
          </p>
          <p className="text-xs text-slate-400 mt-1 max-w-[220px] mx-auto">
            {lang === "bn"
              ? "স্টেশন তালিকায় হার্ট আইকন ট্যাপ করে আপনার পছন্দের চ্যানেলগুলো এখানে যোগ করুন"
              : "Tap the heart icon on any station to pin it to your favorites"}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {favoriteList.map((station) => {
            const isThisPlaying = currentStation.id === station.id && isPlaying;
            return (
              <div
                key={station.id}
                onClick={() => playStation(station)}
                className={`p-3.5 rounded-2xl bg-white border cursor-pointer flex items-center justify-between gap-3 shadow-2xs hover:shadow-xs transition ${
                  isThisPlaying
                    ? "border-indigo-500 bg-indigo-50/30"
                    : "border-slate-100 hover:border-slate-200"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <StationLogo
                    station={station}
                    size="md"
                    isPlaying={isThisPlaying}
                  />
                  <div className="min-w-0">
                    <h3 className="text-xs font-extrabold text-slate-900 truncate">
                      {lang === "bn" ? station.nameBn : station.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 truncate">
                      {station.frequency} • {station.genre}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(station.id);
                    }}
                    className="p-1.5 rounded-full text-rose-500 hover:scale-110 transition"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
