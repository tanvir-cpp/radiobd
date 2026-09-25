"use client";

import React from "react";
import { useAudio } from "../context/AudioContext";
import { StationLogo } from "./StationLogo";
import { Play, Pause, Loader2 } from "lucide-react";

interface MiniPlayerProps {
  variant?: "light" | "dark";
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({ variant = "dark" }) => {
  const {
    currentStation,
    isPlaying,
    isBuffering,
    togglePlay,
    setNowPlayingOpen,
    lang,
    error,
  } = useAudio();

  const isDark = variant === "dark";

  return (
    <div
      onClick={() => setNowPlayingOpen(true)}
      className={`group relative cursor-pointer mx-3 mb-2.5 p-2 rounded-2xl transition-all duration-200 select-none shadow-lg ${
        isDark
          ? "bg-[#25156b] border border-indigo-400/20 text-white shadow-indigo-950/40"
          : "bg-white border border-slate-200/80 text-slate-900 shadow-slate-300/40"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left: Station Logo */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <StationLogo
              station={currentStation}
              size="sm"
              isPlaying={isPlaying}
            />
          </div>

          {/* Center Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h4
                className={`text-xs font-bold truncate tracking-tight ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                {lang === "bn" ? currentStation.nameBn : currentStation.name}
              </h4>
              <span
                className={`text-[9px] font-semibold px-1 rounded shrink-0 ${
                  isDark
                    ? "bg-indigo-500/30 text-indigo-200"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {currentStation.frequency}
              </span>
            </div>

            <p
              className={`text-[11px] truncate mt-0.5 ${
                isDark ? "text-indigo-200/70" : "text-slate-500"
              }`}
            >
              {error ? (
                <span className="text-amber-400 font-medium">{error}</span>
              ) : lang === "bn" ? (
                currentStation.taglineBn
              ) : (
                currentStation.tagline
              )}
            </p>
          </div>
        </div>

        {/* Right Play/Pause Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition active:scale-95 shadow-sm ${
              isDark
                ? "bg-indigo-500 hover:bg-indigo-400 text-white"
                : "bg-[#2c1a85] hover:bg-[#3822a8] text-white"
            }`}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isBuffering ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current translate-x-0.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
