"use client";

import React, { useState } from "react";
import { useAudio, EqPreset } from "../context/AudioContext";
import { VisualizerBars } from "./VisualizerBars";
import { SleepTimerModal } from "./SleepTimerModal";
import { StationInfoModal } from "./StationInfoModal";
import {
  ChevronDown,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Heart,
  Clock,
  Plus,
  SlidersHorizontal,
  Loader2,
} from "lucide-react";
import { InstrumentIcon } from "./InstrumentIcons";

export const NowPlayingDrawer: React.FC = () => {
  const {
    currentStation,
    isPlaying,
    isBuffering,
    togglePlay,
    nextStation,
    prevStation,
    volume,
    isMuted,
    setVolumeLevel,
    toggleMute,
    nowPlayingOpen,
    setNowPlayingOpen,
    favorites,
    toggleFavorite,
    isFavorite,
    sleepTimer,
    lang,
    error,
    eqPreset,
    setEqPreset,
  } = useAudio();

  const [isSleepModalOpen, setIsSleepModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [showEqMenu, setShowEqMenu] = useState(false);

  if (!nowPlayingOpen) return null;

  const isFav = isFavorite(currentStation.id);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const eqPresets: { id: EqPreset; label: string }[] = [
    { id: "normal", label: "Studio Flat" },
    { id: "bass", label: "Bass Boost" },
    { id: "vocal", label: "Voice / News" },
    { id: "acoustic", label: "Acoustic" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#352299] text-white animate-in slide-in-from-bottom duration-300 select-none overflow-hidden">
      {/* Top Header Navigation (Matching Screen 3: Chevron Down, Station Title) */}
      <div className="relative z-10 pt-[max(env(safe-area-inset-top,0px),1rem)] pb-2 px-6 flex flex-col items-center">
        <button
          onClick={() => setNowPlayingOpen(false)}
          className="p-1 rounded-full text-white/70 hover:text-white transition"
          title="Minimize"
        >
          <ChevronDown className="w-6 h-6" />
        </button>

        <h2 className="text-xs font-black uppercase tracking-widest text-white mt-1">
          {lang === "bn" ? currentStation.nameBn : currentStation.name}
        </h2>
      </div>

      {/* Main Curved White Card (Matching Screen 3) */}
      <div className="relative z-10 flex-1 bg-white text-slate-800 rounded-t-[40px] shadow-2xl flex flex-col justify-between px-7 pt-5 pb-[max(env(safe-area-inset-bottom,0px),1.25rem)] overflow-y-auto no-scrollbar mt-2">
        {/* Top Handle hint */}
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-2 shrink-0" />

        {/* Center Artwork Disc (Matching Screen 3: Big vinyl with glowing outer ring) */}
        <div className="flex flex-col items-center justify-center my-auto">
          <div
            className="relative cursor-pointer"
            onClick={togglePlay}
          >
            {/* Concentric colored ring matching reference artwork */}
            <div
              className="w-56 h-56 rounded-full p-2.5 shadow-2xl flex items-center justify-center transition-transform duration-500"
              style={{
                background: `conic-gradient(from 180deg, ${currentStation.color} 0%, #1e1b4b 50%, ${currentStation.color} 100%)`,
                boxShadow: isPlaying
                  ? `0 12px 35px ${currentStation.color}55`
                  : "0 10px 25px rgba(0,0,0,0.15)",
              }}
            >
              {/* Inner dark vinyl disc */}
              <div
                className={`w-full h-full rounded-full bg-[#140f2d] border-4 border-white/95 flex flex-col items-center justify-center p-3 text-center shadow-inner relative overflow-hidden transition-all ${
                  isPlaying ? "animate-[spin_12s_linear_infinite]" : ""
                }`}
              >
                {/* Vinyl Grooves texture */}
                <div className="absolute inset-2 rounded-full border border-white/10 pointer-events-none" />
                <div className="absolute inset-6 rounded-full border border-white/10 pointer-events-none" />
                <div className="absolute inset-10 rounded-full border border-white/10 pointer-events-none" />

                {/* Disc Center Badge */}
                <div
                  className="w-22 h-22 rounded-full flex flex-col items-center justify-center text-white shadow-xl relative z-10"
                  style={{
                    background: `linear-gradient(135deg, ${currentStation.color} 0%, #2e1065 100%)`,
                  }}
                >
                  <InstrumentIcon
                    name={currentStation.icon}
                    size={32}
                    color="#ffffff"
                    className="drop-shadow-sm"
                  />
                  <span className="text-[10px] font-black uppercase tracking-tight mt-1">
                    {currentStation.frequency}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Organic Audio Spectrum Visualizer */}
          <div className="mt-4">
            <VisualizerBars
              color={currentStation.color}
              barCount={11}
              height={22}
            />
          </div>
        </div>

        {/* Station Details (Matching Screen 3: Bold Station Name & Tagline) */}
        <div className="text-center my-2">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            {lang === "bn" ? currentStation.nameBn : currentStation.name}
          </h1>

          <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto mt-1 line-clamp-1">
            {lang === "bn" ? currentStation.taglineBn : currentStation.tagline}
          </p>

          {error && (
            <p className="text-xs text-rose-500 font-semibold mt-1">
              {error}
            </p>
          )}
        </div>

        {/* Playback Controls (Prev, Big Play/Pause, Next - Screen 3) */}
        <div className="flex items-center justify-center gap-8 my-2">
          <button
            onClick={prevStation}
            className="w-10 h-10 rounded-full text-indigo-950/70 hover:text-indigo-950 active:scale-90 transition flex items-center justify-center"
            title="Previous"
          >
            <SkipBack className="w-6 h-6 fill-current" />
          </button>

          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-[#352299] hover:bg-[#2b1983] active:scale-95 text-white shadow-xl shadow-indigo-900/30 flex items-center justify-center transition-all duration-200"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isBuffering ? (
              <Loader2 className="w-7 h-7 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-7 h-7 fill-current" />
            ) : (
              <Play className="w-7 h-7 fill-current translate-x-0.5" />
            )}
          </button>

          <button
            onClick={nextStation}
            className="w-10 h-10 rounded-full text-indigo-950/70 hover:text-indigo-950 active:scale-90 transition flex items-center justify-center"
            title="Next"
          >
            <SkipForward className="w-6 h-6 fill-current" />
          </button>
        </div>

        {/* Volume Scrubber Slider (Matching Screen 3) */}
        <div className="px-2 my-2">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMute}
              className="text-slate-400 hover:text-slate-700 transition shrink-0"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-500" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>

            <div className="relative flex-1 flex items-center">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolumeLevel(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#352299]"
              />
            </div>

            <span className="text-[10px] font-mono font-semibold text-slate-400 w-7 text-right shrink-0">
              {isMuted ? "0%" : `${Math.round(volume * 100)}%`}
            </span>
          </div>
        </div>

        {/* Bottom Action Icons Bar (Screen 3: Alarm, Plus, Heart, Settings) */}
        <div className="flex items-center justify-around pt-3 border-t border-slate-100 text-slate-400">
          {/* Sleep Timer */}
          <button
            onClick={() => setIsSleepModalOpen(true)}
            className={`p-2 rounded-full hover:bg-slate-100 transition relative ${
              sleepTimer !== null ? "text-indigo-600 font-bold" : "hover:text-slate-700"
            }`}
            title="Sleep Timer"
          >
            <Clock className="w-5 h-5" />
            {sleepTimer !== null && (
              <span className="absolute -top-1 -right-1 text-[8px] bg-indigo-600 text-white font-mono px-1 rounded-full">
                {formatTimer(sleepTimer)}
              </span>
            )}
          </button>

          {/* Plus / Station Info */}
          <button
            onClick={() => setIsInfoModalOpen(true)}
            className="p-2 rounded-full hover:bg-slate-100 hover:text-slate-700 transition"
            title="Station Info & Website"
          >
            <Plus className="w-5 h-5" />
          </button>

          {/* Favorite Heart */}
          <button
            onClick={() => toggleFavorite(currentStation.id)}
            className={`p-2 rounded-full hover:bg-slate-100 transition ${
              isFav ? "text-rose-500 hover:text-rose-600 scale-105" : "hover:text-slate-700"
            }`}
            title="Favorite"
          >
            <Heart className={`w-5 h-5 ${isFav ? "fill-rose-500 text-rose-500" : ""}`} />
          </button>

          {/* Audio Presets / Equalizer */}
          <div className="relative">
            <button
              onClick={() => setShowEqMenu(!showEqMenu)}
              className={`p-2 rounded-full hover:bg-slate-100 transition ${
                showEqMenu ? "text-indigo-600" : "hover:text-slate-700"
              }`}
              title="Sound Preset"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>

            {showEqMenu && (
              <div className="absolute bottom-11 right-0 w-36 bg-slate-900 border border-slate-800 rounded-2xl p-1.5 shadow-2xl z-30 text-xs text-white">
                <span className="text-[10px] text-slate-400 font-bold uppercase px-2 py-1 block">
                  Sound Profile
                </span>
                {eqPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setEqPreset(preset.id);
                      setShowEqMenu(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded-xl font-medium transition ${
                      eqPreset === preset.id
                        ? "bg-indigo-600 text-white font-bold"
                        : "hover:bg-slate-800 text-slate-300"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <SleepTimerModal
        isOpen={isSleepModalOpen}
        onClose={() => setIsSleepModalOpen(false)}
      />

      <StationInfoModal
        station={currentStation}
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
    </div>
  );
};
