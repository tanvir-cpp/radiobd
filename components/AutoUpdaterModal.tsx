"use client";

import React, { useState, useEffect } from "react";
import { checkForAppUpdate, installUpdate, UpdateInfo } from "../services/updater";
import { Download, Sparkles, X, ArrowUpCircle } from "lucide-react";
import { useAudio } from "../context/AudioContext";

export const AutoUpdaterModal: React.FC = () => {
  const { lang } = useAudio();
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check for updates on mount
    const check = async () => {
      const info = await checkForAppUpdate();
      if (info && info.hasUpdate && !dismissed) {
        setUpdateInfo(info);
        setIsOpen(true);
      }
    };

    check();

    // Check again periodically every 4 hours if app remains open
    const interval = setInterval(check, 4 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [dismissed]);

  if (!isOpen || !updateInfo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-2xl relative animate-in slide-in-from-bottom duration-300">
        <button
          onClick={() => {
            setIsOpen(false);
            setDismissed(true);
          }}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/30">
            <ArrowUpCircle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-white">
                {lang === "bn" ? "নতুন আপডেট উপলব্ধ!" : "Update Available!"}
              </h3>
              <span className="text-[10px] bg-indigo-500 text-white font-bold px-1.5 py-0.2 rounded-full">
                v{updateInfo.latestVersion}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {lang === "bn"
                ? `বর্তমান সংস্করণ: v${updateInfo.currentVersion}`
                : `Current version: v${updateInfo.currentVersion}`}
            </p>
          </div>
        </div>

        {/* Release notes summary */}
        <div className="bg-slate-800/60 rounded-2xl p-3 border border-slate-700/50 mb-4 max-h-32 overflow-y-auto no-scrollbar text-xs text-slate-300">
          <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider mb-1">
            {lang === "bn" ? "পরিবর্তনের বিবরণ" : "Release Notes"}
          </p>
          <p className="whitespace-pre-line text-[11px] leading-relaxed">
            {updateInfo.releaseNotes}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsOpen(false);
              setDismissed(true);
            }}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
          >
            {lang === "bn" ? "পরে করুন" : "Later"}
          </button>

          <button
            onClick={() => {
              if (updateInfo.apkUrl) {
                installUpdate(updateInfo.apkUrl);
              }
            }}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-lg shadow-indigo-600/30"
          >
            <Download className="w-3.5 h-3.5" />
            {lang === "bn" ? "এখনই আপডেট করুন" : "Update Now"}
          </button>
        </div>
      </div>
    </div>
  );
};
