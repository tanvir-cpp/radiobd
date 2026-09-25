import React from "react";

interface IconProps {
  name: string;
  className?: string;
  size?: number;
  color?: string;
}

export const InstrumentIcon: React.FC<IconProps> = ({
  name,
  className = "w-6 h-6",
  size = 24,
  color = "currentColor",
}) => {
  switch (name.toLowerCase()) {
    case "ektara":
      // Traditional Bengali Ektara (Folk single string instrument)
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          {/* Bowl/resonator */}
          <path d="M7 16a5 5 0 0 0 10 0c0-2-1.5-4-5-4s-5 2-5 4z" />
          {/* Dual bamboo neck split */}
          <path d="M10 12V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v8" />
          {/* Tuning peg / top finial */}
          <circle cx="12" cy="3" r="1.5" fill={color} />
          {/* Central single brass string */}
          <line x1="12" y1="4" x2="12" y2="18" strokeDasharray="1 1" />
          {/* Decorative tassle/bells */}
          <circle cx="9" cy="18" r="0.8" />
          <circle cx="15" cy="18" r="0.8" />
        </svg>
      );

    case "flute":
      // Bengali Bamboo Flute (Banshi)
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          {/* Flute body inclined */}
          <line x1="3" y1="21" x2="21" y2="3" />
          {/* Mouth hole */}
          <circle cx="18" cy="6" r="1" fill={color} />
          {/* Finger holes */}
          <circle cx="14" cy="10" r="0.8" fill={color} />
          <circle cx="11.5" cy="12.5" r="0.8" fill={color} />
          <circle cx="9" cy="15" r="0.8" fill={color} />
          <circle cx="6.5" cy="17.5" r="0.8" fill={color} />
          {/* Bamboo nodes */}
          <line x1="2" y1="20" x2="4" y2="22" />
          <line x1="20" y1="2" x2="22" y2="4" />
        </svg>
      );

    case "saxophone":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M6 3h3v4" />
          <path d="M9 7v6a4 4 0 0 0 4 4h2a4 4 0 0 0 4-4v-1a3 3 0 0 0-3-3h-1" />
          <path d="M19 12a3 3 0 1 1-6 0" />
          <circle cx="9" cy="7" r="1" />
          <circle cx="9" cy="10" r="1" />
          <circle cx="9" cy="13" r="1" />
        </svg>
      );

    case "mic":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" x2="12" y1="19" y2="22" />
          <line x1="8" x2="16" y1="22" y2="22" />
        </svg>
      );

    case "guitar":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="m19 5-3-3-4.5 4.5 3 3L19 5Z" />
          <path d="m14.5 6.5-6.8 6.8c-.8.8-1.4 1.7-1.4 2.8 0 2.2 1.8 4 4 4 1.1 0 2-.6 2.8-1.4l6.8-6.8" />
          <circle cx="10.5" cy="13.5" r="1.5" />
          <line x1="17.5" y1="3.5" x2="19.5" y2="5.5" />
        </svg>
      );

    case "drum":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <ellipse cx="12" cy="7" rx="8" ry="4" />
          <path d="M4 7v10c0 2.2 3.6 4 8 4s8-1.8 8-4V7" />
          <line x1="4" y1="12" x2="12" y2="17" />
          <line x1="20" y1="12" x2="12" y2="17" />
          <line x1="12" y1="11" x2="12" y2="21" />
        </svg>
      );

    case "waveform":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M2 10v4" />
          <path d="M6 6v12" />
          <path d="M10 3v18" />
          <path d="M14 8v8" />
          <path d="M18 5v14" />
          <path d="M22 10v4" />
        </svg>
      );

    case "tower":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M12 2v20" />
          <path d="m8 6 8 4" />
          <path d="m16 6-8 4" />
          <path d="m7 12 10 5" />
          <path d="m17 12-10 5" />
          <path d="M4 22h16" />
          <circle cx="12" cy="2" r="1.5" fill={color} />
          <path d="M8 2a6 6 0 0 1 8 0" strokeDasharray="2 2" />
        </svg>
      );

    case "headphones":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
        </svg>
      );

    case "radio":
    default:
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
          <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
          <circle cx="12" cy="12" r="2" />
          <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
          <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" />
        </svg>
      );
  }
};
