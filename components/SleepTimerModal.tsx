"use client";

import React from "react";
import { useAudio } from "../context/AudioContext";
import { Clock, X, Check, Moon } from "lucide-react";

interface SleepTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SleepTimerModal: React.FC<SleepTimerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { sleepTimer, setSleepTimerDuration, lang } = useAudio();

  if (!isOpen) return null;

  const presets = [15, 30, 45, 60, 90];

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xs bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {lang === "bn" ? "স্লিপ টাইমার" : "Sleep Timer"}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === "bn"
                  ? "নির্দিষ্ট সময় পর স্বয়ংক্রিয়ভাবে বন্ধ হবে"
                  : "Auto-turn off audio after timer"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {sleepTimer !== null && (
          <div className="mb-4 p-3 bg-indigo-950/60 border border-indigo-500/30 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span className="text-xs text-indigo-200">
                {lang === "bn" ? "অবশিষ্ট সময়:" : "Time Remaining:"}
              </span>
            </div>
            <span className="font-mono font-bold text-indigo-300 text-sm">
              {formatSeconds(sleepTimer)}
            </span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 mb-4">
          {presets.map((min) => {
            const isCurrentPreset =
              sleepTimer !== null &&
              Math.ceil(sleepTimer / 60) === min;
            return (
              <button
                key={min}
                onClick={() => {
                  setSleepTimerDuration(min);
                  onClose();
                }}
                className={`py-2.5 px-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  isCurrentPreset
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                    : "bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white"
                }`}
              >
                {isCurrentPreset && <Check className="w-3.5 h-3.5" />}
                {min} {lang === "bn" ? "মিনিট" : "Mins"}
              </button>
            );
          })}
        </div>

        {sleepTimer !== null && (
          <button
            onClick={() => {
              setSleepTimerDuration(null);
              onClose();
            }}
            className="w-full py-2.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold transition"
          >
            {lang === "bn" ? "টাইমার বাতিল করুন" : "Turn Off Timer"}
          </button>
        )}
      </div>
    </div>
  );
};
