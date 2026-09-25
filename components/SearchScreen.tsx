"use client";

import React, { useState, useMemo } from "react";
import { Station, STATIONS, CATEGORIES } from "../data/stations";
import { useAudio } from "../context/AudioContext";
import { StationLogo } from "./StationLogo";
import { MiniPlayer } from "./MiniPlayer";
import { StationInfoModal } from "./StationInfoModal";
import {
  Search,
  X,
  Heart,
  Radio,
  SlidersHorizontal,
  Flame,
  Volume2,
  MoreVertical,
} from "lucide-react";

export const SearchScreen: React.FC = () => {
  const {
    currentStation,
    isPlaying,
    playStation,
    favorites,
    toggleFavorite,
    isFavorite,
    lang,
  } = useAudio();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeTopTab, setActiveTopTab] = useState<"search" | "top" | "discover" | "betar">("search");
  const [selectedStationInfo, setSelectedStationInfo] = useState<Station | null>(null);

  // Filtered station list based on search and category
  const filteredStations = useMemo(() => {
    return STATIONS.filter((station) => {
      const matchesCategory =
        activeCategory === "all" || station.category === activeCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      return (
        station.name.toLowerCase().includes(q) ||
        station.nameBn.includes(q) ||
        station.frequency.toLowerCase().includes(q) ||
        station.freqNum.toString().includes(q) ||
        station.genre.toLowerCase().includes(q) ||
        station.genreBn.includes(q) ||
        station.location.toLowerCase().includes(q) ||
        station.locationBn.includes(q) ||
        station.tagline.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="flex flex-col h-full bg-[#321e9c] text-white select-none relative overflow-hidden">
      {/* Top Purple/Indigo Header (Matching Screen 2) */}
      <div className="pt-[max(env(safe-area-inset-top,0px),1rem)] px-5 pb-3">
        {/* Top Header Tabs */}
        <div className="flex items-center justify-between text-xs font-semibold mb-4 text-indigo-200/90 overflow-x-auto no-scrollbar gap-4">
          <button
            onClick={() => setActiveTopTab("search")}
            className={`transition whitespace-nowrap ${
              activeTopTab === "search"
                ? "text-white font-extrabold text-sm border-b-2 border-white pb-0.5"
                : "hover:text-white"
            }`}
          >
            {lang === "bn" ? "অনুসন্ধান" : "Search"}
          </button>
          <button
            onClick={() => {
              setActiveTopTab("top");
              setActiveCategory("commercial");
            }}
            className={`transition whitespace-nowrap ${
              activeTopTab === "top"
                ? "text-white font-extrabold text-sm border-b-2 border-white pb-0.5"
                : "hover:text-white"
            }`}
          >
            {lang === "bn" ? "শীর্ষ স্টেশন" : "Top Stations"}
          </button>
          <button
            onClick={() => {
              setActiveTopTab("discover");
              setActiveCategory("all");
            }}
            className={`transition whitespace-nowrap ${
              activeTopTab === "discover"
                ? "text-white font-extrabold text-sm border-b-2 border-white pb-0.5"
                : "hover:text-white"
            }`}
          >
            {lang === "bn" ? "ডিসকভার" : "Discover"}
          </button>
          <button
            onClick={() => {
              setActiveTopTab("betar");
              setActiveCategory("betar");
            }}
            className={`transition whitespace-nowrap ${
              activeTopTab === "betar"
                ? "text-white font-extrabold text-sm border-b-2 border-white pb-0.5"
                : "hover:text-white"
            }`}
          >
            {lang === "bn" ? "বেতার" : "Betar"}
          </button>
        </div>

        {/* Search Input Bar (Matching Screen 2) */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-indigo-300 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              lang === "bn"
                ? "স্টেশনের নাম, ফ্রিকোয়েন্সি বা ধারা খুঁজুন..."
                : "Search station, frequency, or genre..."
            }
            className="w-full pl-11 pr-10 py-3 rounded-full bg-white/15 hover:bg-white/20 focus:bg-white/25 text-white placeholder-indigo-200/70 text-xs font-medium outline-none transition backdrop-blur-md border border-white/10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-indigo-200 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Region & Station Count Headline (Matching Screen 2) */}
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              {lang === "bn" ? "বাংলাদেশ" : "Bangladesh"}
            </h2>
            <p className="text-xs text-indigo-200/90 font-medium">
              {filteredStations.length}{" "}
              {lang === "bn" ? "টি স্টেশন" : "stations"} •{" "}
              {favorites.length} {lang === "bn" ? "টি প্রিয়" : "favorites"}
            </p>
          </div>

          {/* Category Filter Pills (Scrollable) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-[200px]">
            {CATEGORIES.slice(0, 3).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`text-[10px] font-bold px-2 py-1 rounded-full transition whitespace-nowrap ${
                  activeCategory === cat.id
                    ? "bg-white text-indigo-900 shadow-sm"
                    : "bg-white/10 text-indigo-200 hover:bg-white/20"
                }`}
              >
                {lang === "bn" ? cat.labelBn : cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Curved White Bottom Sheet (Matching Screen 2) */}
      <div className="flex-1 bg-white rounded-t-[36px] flex flex-col min-h-0 text-slate-800 shadow-2xl overflow-hidden relative">
        {/* Subtle Pull Indicator Pill */}
        <div className="pt-3 pb-1 flex justify-center shrink-0">
          <div className="w-10 h-1.5 bg-slate-200 rounded-full" />
        </div>

        {/* Quick Category Filter Bar */}
        <div className="px-6 py-2 border-b border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold transition whitespace-nowrap shrink-0 ${
                activeCategory === cat.id
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {lang === "bn" ? cat.labelBn : cat.label}
            </button>
          ))}
        </div>

        {/* Station List Items (Matching Screen 2: FM DERANA 92.2 FM, SUN FM 98.9 FM, YES FM 100.8 FM) */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-3 divide-y divide-slate-100 pb-6">
          {filteredStations.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <Radio className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-sm">
                {lang === "bn" ? "কোন স্টেশন পাওয়া যায়নি" : "No stations found"}
              </p>
              <p className="text-xs mt-1">
                {lang === "bn"
                  ? "অন্য শব্দ দিয়ে অনুসন্ধান করুন"
                  : "Try searching with a different station name or frequency"}
              </p>
            </div>
          ) : (
            filteredStations.map((station) => {
              const isThisPlaying =
                currentStation.id === station.id && isPlaying;
              const isFav = isFavorite(station.id);

              return (
                <div
                  key={station.id}
                  onClick={() => playStation(station)}
                  className={`py-3 px-1 flex items-center justify-between gap-3.5 cursor-pointer group transition duration-150 rounded-2xl hover:bg-slate-50 ${
                    isThisPlaying ? "bg-indigo-50/50" : ""
                  }`}
                >
                  {/* Left: Station Logo + Name */}
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <StationLogo
                      station={station}
                      size="md"
                      isPlaying={isThisPlaying}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-indigo-600 transition truncate uppercase tracking-tight">
                          {lang === "bn" ? station.nameBn : station.name}
                        </h3>
                        {station.category === "betar" && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase shrink-0">
                            Betar
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {lang === "bn" ? station.genreBn : station.genre} •{" "}
                        {lang === "bn" ? station.locationBn : station.location}
                      </p>
                    </div>
                  </div>

                  {/* Right: Frequency (Matching Screen 2 in reference image) */}
                  <div className="text-right shrink-0 flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-500 font-mono">
                      {station.frequency.split(" / ")[0]}
                    </span>
                    {isThisPlaying && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Station Info Modal */}
      {selectedStationInfo && (
        <StationInfoModal
          station={selectedStationInfo}
          isOpen={true}
          onClose={() => setSelectedStationInfo(null)}
        />
      )}
    </div>
  );
};
