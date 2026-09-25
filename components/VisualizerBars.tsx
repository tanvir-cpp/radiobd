import React from "react";
import { useAudio } from "../context/AudioContext";

interface VisualizerBarsProps {
  color?: string;
  barCount?: number;
  className?: string;
  height?: number;
}

export const VisualizerBars: React.FC<VisualizerBarsProps> = ({
  color,
  barCount = 11,
  className = "",
  height = 28,
}) => {
  const { isPlaying, currentStation } = useAudio();
  const barColor = color || currentStation.color || "#8b5cf6";

  // Pre-configured natural wave heights & animation durations
  const barConfig = [
    { h: "55%", delay: "0ms", dur: "750ms" },
    { h: "85%", delay: "120ms", dur: "600ms" },
    { h: "40%", delay: "240ms", dur: "850ms" },
    { h: "95%", delay: "80ms", dur: "650ms" },
    { h: "70%", delay: "180ms", dur: "700ms" },
    { h: "100%", delay: "300ms", dur: "550ms" },
    { h: "60%", delay: "150ms", dur: "800ms" },
    { h: "80%", delay: "50ms", dur: "620ms" },
    { h: "45%", delay: "210ms", dur: "780ms" },
    { h: "90%", delay: "100ms", dur: "580ms" },
    { h: "50%", delay: "270ms", dur: "720ms" },
  ].slice(0, barCount);

  return (
    <div
      className={`flex items-end justify-center gap-[3px] select-none ${className}`}
      style={{ height: `${height}px` }}
    >
      {barConfig.map((item, idx) => (
        <span
          key={idx}
          className={`w-[3px] rounded-full transition-all duration-300 ${
            isPlaying ? "animate-pulse" : "h-[4px]"
          }`}
          style={{
            height: isPlaying ? item.h : "4px",
            backgroundColor: isPlaying ? barColor : "rgba(148, 163, 184, 0.4)",
            animationDuration: isPlaying ? item.dur : "0s",
            animationDelay: item.delay,
            boxShadow: isPlaying ? `0 0 6px ${barColor}66` : "none",
          }}
        />
      ))}
    </div>
  );
};
