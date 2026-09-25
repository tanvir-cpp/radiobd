import React from "react";
import { Station } from "../data/stations";
import { InstrumentIcon } from "./InstrumentIcons";

interface StationLogoProps {
  station: Station;
  size?: "sm" | "md" | "lg" | "xl";
  isPlaying?: boolean;
  className?: string;
}

export const StationLogo: React.FC<StationLogoProps> = ({
  station,
  size = "md",
  isPlaying = false,
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-10 h-10 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-base",
    xl: "w-28 h-28 text-xl",
  };

  const iconSizes = {
    sm: 18,
    md: 22,
    lg: 28,
    xl: 52,
  };

  // Derive acronym or short letters for station
  const getInitials = (name: string) => {
    if (name.includes("Betar")) return "BETAR";
    if (name.includes("Foorti")) return "FOORTI";
    if (name.includes("Today")) return "TODAY";
    if (name.includes("Dhaka FM")) return "DHAKA";
    if (name.includes("Jago")) return "JAGO";
    if (name.includes("Spice")) return "SPICE";
    if (name.includes("Peoples")) return "PEOPLE";
    if (name.includes("GoonGoon")) return "GOON";
    if (name.includes("Mellow")) return "MELLOW";
    if (name.includes("Hot Now")) return "HOT";
    if (name.includes("Khushbu")) return "KHUSH";
    if (name.includes("Quran")) return "QURAN";
    if (name.includes("AIR") || name.includes("Akashvani")) return "AIR";
    return name.slice(0, 3).toUpperCase();
  };

  return (
    <div
      className={`relative rounded-full flex items-center justify-center font-bold tracking-tight shadow-md overflow-hidden select-none transition-transform duration-300 ${
        sizeClasses[size]
      } ${isPlaying ? "scale-105" : ""} ${className}`}
      style={{
        background: `linear-gradient(135deg, ${station.color} 0%, ${station.color}dd 60%, #1e1b4b 100%)`,
        color: "#ffffff",
        boxShadow: isPlaying
          ? `0 0 20px ${station.color}80, 0 4px 12px rgba(0,0,0,0.3)`
          : `0 4px 12px rgba(0,0,0,0.12)`,
      }}
    >
      {/* Background radial glow */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), transparent 70%)",
        }}
      />

      {/* Center Instrument or Custom Icon */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <InstrumentIcon
          name={station.icon}
          size={iconSizes[size]}
          color="#ffffff"
          className="drop-shadow-sm"
        />
        {size === "xl" && (
          <span className="text-[11px] font-extrabold tracking-wider mt-1 opacity-90 uppercase">
            {getInitials(station.name)}
          </span>
        )}
      </div>

      {/* Live Equalizer indicator overlay when playing */}
      {isPlaying && (
        <div className="absolute inset-0 bg-black/25 flex items-center justify-center backdrop-blur-[1px]">
          <div className="flex items-end gap-[2px] h-4">
            <span className="w-1 bg-white rounded-full animate-bounce h-3" />
            <span className="w-1 bg-white rounded-full animate-bounce h-4 [animation-delay:150ms]" />
            <span className="w-1 bg-white rounded-full animate-bounce h-2 [animation-delay:300ms]" />
          </div>
        </div>
      )}
    </div>
  );
};
