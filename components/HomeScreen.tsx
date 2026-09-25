"use client";

import React, { useState } from "react";
import { Station, STATIONS } from "../data/stations";
import { useAudio } from "../context/AudioContext";
import { StationLogo } from "./StationLogo";
import { MiniPlayer } from "./MiniPlayer";
import { StationInfoModal } from "./StationInfoModal";
import {
  Play,
  Pause,
  MoreVertical,
  Heart,
  ChevronRight,
  ChevronLeft,
  Globe,
} from "lucide-react";

interface HomeScreenProps {
  onNavigateToSearch: () => void;
  onNavigateToBetar?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToSearch,
  onNavigateToBetar,
}) => {
  const {
    currentStation,
    isPlaying,
    playStation,
    togglePlay,
    favorites,
    toggleFavorite,
    isFavorite,
    lang,
    setLang,
  } = useAudio();

  const [activeTab, setActiveTab] = useState<"recent" | "recommended" | "search" | "top">("recent");
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [selectedInfoStation, setSelectedInfoStation] = useState<Station | null>(null);

  // Featured stations for the hero carousel
  const heroStations = STATIONS.slice(0, 8);
  const currentHeroStation = heroStations[carouselIndex % heroStations.length];

  // Favorite stations list
  const favoriteStations = STATIONS.filter((s) => favorites.includes(s.id));

  // Recommended stations
  const displayStations =
    activeTab === "recommended"
      ? STATIONS.filter((s) => s.category === "commercial" || s.category === "betar")
      : STATIONS.slice(0, 10);

  const isCurrentHeroPlaying =
    currentStation.id === currentHeroStation.id && isPlaying;

  const nextHero = () => {
    setCarouselIndex((prev) => (prev + 1) % heroStations.length);
  };

  const prevHero = () => {
    setCarouselIndex((prev) => (prev - 1 + heroStations.length) % heroStations.length);
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f9fd] text-slate-800 select-none overflow-y-auto no-scrollbar relative pb-24">
      {/* Top Tabs Bar (Directly matching Screen 1 in reference: Recent, Recommended, Search, Top 40) */}
      <div className="px-5 pt-[max(env(safe-area-inset-top,0px),1rem)] pb-2 sticky top-0 bg-[#f8f9fd]/95 backdrop-blur-md z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5 overflow-x-auto no-scrollbar text-sm font-semibold py-1">
            <button
              onClick={() => setActiveTab("recent")}
              className={`transition relative whitespace-nowrap pb-1 ${
                activeTab === "recent"
                  ? "text-slate-900 font-extrabold text-base"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {lang === "bn" ? "সাম্প্রতিক" : "Recent"}
              {activeTab === "recent" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("recommended")}
              className={`transition relative whitespace-nowrap pb-1 ${
                activeTab === "recommended"
                  ? "text-slate-900 font-extrabold text-base"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {lang === "bn" ? "প্রস্তাবিত" : "Recommended"}
              {activeTab === "recommended" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
              )}
            </button>

            <button
              onClick={onNavigateToSearch}
              className="text-slate-400 hover:text-slate-600 transition whitespace-nowrap pb-1"
            >
              {lang === "bn" ? "অনুসন্ধান" : "Search"}
            </button>

            <button
              onClick={() => {
                setActiveTab("top");
                onNavigateToSearch();
              }}
              className={`transition relative whitespace-nowrap pb-1 ${
                activeTab === "top"
                  ? "text-slate-900 font-extrabold text-base"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {lang === "bn" ? "টপ ৪০" : "Top 40"}
            </button>
          </div>

          {/* Clean Language Switcher */}
          <button
            onClick={() => setLang(lang === "en" ? "bn" : "en")}
            className="px-2.5 py-1 rounded-full text-xs font-bold border border-slate-200 bg-white hover:border-indigo-400 text-slate-700 flex items-center gap-1 transition shadow-2xs shrink-0"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-600" />
            <span>{lang === "en" ? "বাং" : "EN"}</span>
          </button>
        </div>
      </div>

      {/* Featured Hero Card Carousel (Screen 1 Reference) */}
      <div className="px-5 pt-2 pb-1">
        <div className="relative">
          {/* Main Card */}
          <div
            className="relative w-full aspect-[4/3] rounded-[30px] p-5 text-white overflow-hidden shadow-xl flex flex-col justify-between cursor-pointer transition-all duration-300"
            style={{
              background: `linear-gradient(145deg, #2b1784 0%, #170d47 100%)`,
            }}
            onClick={() => playStation(currentHeroStation)}
          >
            {/* Ambient Station Color Glow */}
            <div
              className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-35 pointer-events-none transition-colors duration-500"
              style={{ backgroundColor: currentHeroStation.color }}
            />

            {/* Top Bar of the Card */}
            <div className="relative z-10 flex items-center justify-between">
              {/* Three dots / info button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedInfoStation(currentHeroStation);
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white transition"
                title="Station details"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {/* Big Circular Play/Pause Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (currentStation.id === currentHeroStation.id) {
                    togglePlay();
                  } else {
                    playStation(currentHeroStation);
                  }
                }}
                className="w-13 h-13 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 backdrop-blur-md flex items-center justify-center text-white shadow-lg transition border border-white/20"
              >
                {isCurrentHeroPlaying ? (
                  <Pause className="w-6 h-6 fill-white" />
                ) : (
                  <Play className="w-6 h-6 fill-white translate-x-0.5" />
                )}
              </button>
            </div>

            {/* Bottom Info of the Card */}
            <div className="relative z-10">
              <div className="flex items-center gap-2.5 mb-2">
                <StationLogo
                  station={currentHeroStation}
                  size="sm"
                  isPlaying={isCurrentHeroPlaying}
                />
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-md">
                  {currentHeroStation.frequency}
                </span>
              </div>

              <h2 className="text-2xl font-black tracking-tight leading-tight">
                {lang === "bn"
                  ? currentHeroStation.nameBn
                  : currentHeroStation.name}
              </h2>

              <p className="text-xs text-indigo-200/90 font-medium line-clamp-1 mt-0.5">
                {lang === "bn"
                  ? currentHeroStation.taglineBn
                  : currentHeroStation.tagline}
              </p>
            </div>
          </div>

          {/* Carousel dots & navigation */}
          <div className="flex items-center justify-between mt-3 px-1">
            <div className="flex items-center gap-1.5">
              {heroStations.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCarouselIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    carouselIndex === i
                      ? "w-5 bg-indigo-600"
                      : "w-1.5 bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={prevHero}
                className="w-6 h-6 rounded-full bg-white shadow-2xs border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={nextHero}
                className="w-6 h-6 rounded-full bg-white shadow-2xs border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Favorite Section (Screen 1 Reference) */}
      <div className="mt-4 px-5">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="font-extrabold text-slate-900 text-base">
            {lang === "bn" ? "প্রিয় স্টেশন" : "Favorite"}
          </h3>

          <button
            onClick={onNavigateToSearch}
            className="text-xs text-indigo-600 font-semibold hover:underline"
          >
            {lang === "bn" ? "সব দেখুন" : "View All"}
          </button>
        </div>

        {/* Horizontal Favorite Cards matching reference */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {favoriteStations.map((station) => {
            const isThisPlaying = currentStation.id === station.id && isPlaying;
            return (
              <div
                key={station.id}
                onClick={() => playStation(station)}
                className={`min-w-[160px] max-w-[180px] p-3 rounded-2xl bg-white border cursor-pointer transition-all duration-200 shadow-2xs hover:shadow-sm flex flex-col justify-between shrink-0 ${
                  isThisPlaying
                    ? "border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/20"
                    : "border-slate-100 hover:border-slate-200"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <StationLogo
                    station={station}
                    size="sm"
                    isPlaying={isThisPlaying}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(station.id);
                    }}
                    className="p-1 rounded-full text-rose-500 hover:scale-110 transition"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current text-rose-500" />
                  </button>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {lang === "bn" ? station.nameBn : station.name}
                  </h4>
                  <p className="text-[11px] font-medium text-slate-400">
                    {station.frequency}
                  </p>
                </div>

                {/* Status indicator bar */}
                <div className="mt-2.5 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isThisPlaying
                        ? "bg-indigo-600 w-full animate-pulse"
                        : "bg-transparent w-0"
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommended Stations List */}
      <div className="mt-4 px-5">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="font-extrabold text-slate-900 text-base">
            {lang === "bn" ? "জনপ্রিয় চ্যানেল" : "Top Stations"}
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            {displayStations.length} {lang === "bn" ? "টি চ্যানেল" : "Stations"}
          </span>
        </div>

        <div className="space-y-2">
          {displayStations.map((station) => {
            const isThisPlaying = currentStation.id === station.id && isPlaying;
            return (
              <div
                key={station.id}
                onClick={() => playStation(station)}
                className={`p-3 rounded-2xl bg-white border cursor-pointer flex items-center justify-between gap-3 transition shadow-2xs hover:shadow-xs ${
                  isThisPlaying
                    ? "border-indigo-500 bg-indigo-50/20"
                    : "border-slate-100 hover:border-slate-200"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <StationLogo
                    station={station}
                    size="sm"
                    isPlaying={isThisPlaying}
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {lang === "bn" ? station.nameBn : station.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate">
                      {lang === "bn" ? station.taglineBn : station.tagline}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-semibold text-slate-500">
                    {station.frequency}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isThisPlaying) {
                        togglePlay();
                      } else {
                        playStation(station);
                      }
                    }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition shadow-2xs ${
                      isThisPlaying
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-indigo-600 hover:text-white"
                    }`}
                  >
                    {isThisPlaying ? (
                      <Pause className="w-3.5 h-3.5 fill-current" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>



      {/* Station Info Modal */}
      {selectedInfoStation && (
        <StationInfoModal
          station={selectedInfoStation}
          isOpen={true}
          onClose={() => setSelectedInfoStation(null)}
        />
      )}
    </div>
  );
};
