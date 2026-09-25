"use client";

import React, { useState } from "react";
import { Station } from "../data/stations";
import { useAudio } from "../context/AudioContext";
import {
  X,
  Radio,
  ExternalLink,
  MapPin,
  Share2,
  Check,
  Music,
  Activity,
  Zap,
} from "lucide-react";
import { StationLogo } from "./StationLogo";

interface StationInfoModalProps {
  station: Station;
  isOpen: boolean;
  onClose: () => void;
}

export const StationInfoModal: React.FC<StationInfoModalProps> = ({
  station,
  isOpen,
  onClose,
}) => {
  const { lang, isPlaying, currentStation } = useAudio();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: station.name,
        text: `Listen to ${station.name} (${station.frequency}) live on Bangladeshi Radio App!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `${station.name} (${station.frequency}) - Live Bangladesh FM Radio: ${window.location.href}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center mb-5">
          <StationLogo
            station={station}
            size="lg"
            isPlaying={currentStation.id === station.id && isPlaying}
            className="mb-3"
          />
          <h2 className="text-xl font-bold text-white tracking-tight">
            {lang === "bn" ? station.nameBn : station.name}
          </h2>
          <p className="text-xs text-indigo-400 font-semibold tracking-wider uppercase mt-0.5">
            {station.frequency}
          </p>
          <p className="text-xs text-slate-400 mt-1 max-w-[240px]">
            {lang === "bn" ? station.taglineBn : station.tagline}
          </p>
        </div>

        {/* Info Grid */}
        <div className="space-y-2.5 bg-slate-800/60 rounded-2xl p-4 text-xs mb-5 border border-slate-700/40">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              {lang === "bn" ? "অবস্থান" : "Location"}
            </span>
            <span className="font-medium text-slate-200">
              {lang === "bn" ? station.locationBn : station.location}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Music className="w-3.5 h-3.5 text-amber-400" />
              {lang === "bn" ? "জনরা / সুর" : "Genre"}
            </span>
            <span className="font-medium text-slate-200">
              {lang === "bn" ? station.genreBn : station.genre}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              {lang === "bn" ? "অডিও বিটরেট" : "Bitrate"}
            </span>
            <span className="font-mono text-emerald-300 font-semibold">
              {station.bitrate}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              {lang === "bn" ? "স্ট্রিম টাইপ" : "Stream Type"}
            </span>
            <span className="uppercase text-purple-300 font-mono font-semibold">
              {station.type}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {station.website && (
            <a
              href={station.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition shadow-lg shadow-indigo-600/25"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {lang === "bn" ? "অফিসিয়াল ওয়েবসাইট" : "Official Website"}
            </a>
          )}
          <button
            onClick={handleShare}
            className="py-2.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition border border-slate-700/50"
            title="Share Station"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === "bn" ? "কপি হয়েছে!" : "Copied!"}</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>{lang === "bn" ? "শেয়ার" : "Share"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
