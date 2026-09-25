"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { Station, STATIONS, INITIAL_FAVORITES } from "../data/stations";
import Hls from "hls.js";

export type Language = "en" | "bn";
export type EqPreset = "normal" | "bass" | "vocal" | "acoustic";

interface AudioContextType {
  currentStation: Station;
  isPlaying: boolean;
  isBuffering: boolean;
  error: string | null;
  volume: number;
  isMuted: boolean;
  favorites: string[];
  recentStations: string[];
  lang: Language;
  nowPlayingOpen: boolean;
  sleepTimer: number | null; // remaining seconds
  eqPreset: EqPreset;

  // Controls
  playStation: (station: Station) => void;
  togglePlay: () => void;
  nextStation: () => void;
  prevStation: () => void;
  setVolumeLevel: (val: number) => void;
  toggleMute: () => void;
  toggleFavorite: (stationId: string) => void;
  isFavorite: (stationId: string) => boolean;
  setLang: (lang: Language) => void;
  setNowPlayingOpen: (open: boolean) => void;
  setSleepTimerDuration: (minutes: number | null) => void;
  setEqPreset: (preset: EqPreset) => void;
  clearError: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentStation, setCurrentStation] = useState<Station>(STATIONS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<string[]>(INITIAL_FAVORITES);
  const [recentStations, setRecentStations] = useState<string[]>([
    "radio-foorti",
    "radio-today",
    "dhaka-fm",
  ]);
  const [lang, setLangState] = useState<Language>("en");
  const [nowPlayingOpen, setNowPlayingOpen] = useState<boolean>(false);
  const [sleepTimer, setSleepTimer] = useState<number | null>(null);
  const [eqPreset, setEqPreset] = useState<EqPreset>("normal");

  // Audio elements & HLS references
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const fallbackIndexRef = useRef<number>(0);
  const sleepIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const savedFavs = localStorage.getItem("radio_bd_favorites");
      if (savedFavs) setFavorites(JSON.parse(savedFavs));

      const savedRecents = localStorage.getItem("radio_bd_recents");
      if (savedRecents) setRecentStations(JSON.parse(savedRecents));

      const savedLang = localStorage.getItem("radio_bd_lang") as Language;
      if (savedLang) setLangState(savedLang);

      const savedVol = localStorage.getItem("radio_bd_volume");
      if (savedVol) setVolume(parseFloat(savedVol));
    } catch {
      // Storage unavailable or disabled
    }
  }, []);

  // Sync favorites
  const toggleFavorite = (stationId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(stationId)
        ? prev.filter((id) => id !== stationId)
        : [...prev, stationId];
      try {
        localStorage.setItem("radio_bd_favorites", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const isFavorite = (stationId: string) => favorites.includes(stationId);

  // Language switch
  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem("radio_bd_lang", newLang);
    } catch {}
  };

  // Setup HTML5 Audio element on mount
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "none";
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;

    const onWaiting = () => setIsBuffering(true);
    const onPlaying = () => {
      setIsBuffering(false);
      setIsPlaying(true);
      setError(null);
    };
    const onPause = () => setIsPlaying(false);
    const onError = () => {
      setIsBuffering(false);
      // Try fallback URL if available
      const fallbacks = currentStation.fallbackUrls || [];
      if (fallbackIndexRef.current < fallbacks.length) {
        const nextUrl = fallbacks[fallbackIndexRef.current];
        fallbackIndexRef.current += 1;
        setError(`Primary stream reconnecting...`);
        audio.src = nextUrl;
        audio.play().catch(() => {});
      } else {
        setError(`Live stream temporarily unavailable`);
        setIsPlaying(false);
      }
    };

    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("error", onError);
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      audio.pause();
    };
  }, [currentStation.fallbackUrls]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const setVolumeLevel = (val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolume(clamped);
    if (isMuted && clamped > 0) setIsMuted(false);
    try {
      localStorage.setItem("radio_bd_volume", clamped.toString());
    } catch {}
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  // Audio stream loader
  const loadAndPlayStream = useCallback((station: Station) => {
    const audio = audioRef.current;
    if (!audio) return;

    setError(null);
    setIsBuffering(true);
    fallbackIndexRef.current = 0;

    // Destroy existing Hls instance if any
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const streamUrl = station.streamUrl;
    const isHls = station.type === "hls" || streamUrl.includes(".m3u8");

    if (isHls && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 30,
      });
      hlsRef.current = hls;

      hls.loadSource(streamUrl);
      hls.attachMedia(audio);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
            setIsBuffering(false);
          })
          .catch((err) => {
            console.warn("Autoplay prevented:", err);
            setIsPlaying(false);
            setIsBuffering(false);
          });
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              setError("Stream unavailable");
              setIsPlaying(false);
              setIsBuffering(false);
              break;
          }
        }
      });
    } else {
      // Standard MP3 / AAC or native Safari HLS
      audio.src = streamUrl;
      audio.load();
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsBuffering(false);
        })
        .catch((err) => {
          console.warn("Play error:", err);
          setIsPlaying(false);
          setIsBuffering(false);
          setError("Tap to start stream");
        });
    }

    // Update MediaSession
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: lang === "bn" ? station.nameBn : station.name,
        artist: lang === "bn" ? station.taglineBn : station.tagline,
        album: `${station.frequency} • ${station.location}`,
      });
    }

    // Add to recent stations
    setRecentStations((prev) => {
      const filtered = prev.filter((id) => id !== station.id);
      const updated = [station.id, ...filtered].slice(0, 10);
      try {
        localStorage.setItem("radio_bd_recents", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, [lang]);

  // Play a specific station
  const playStation = useCallback(
    (station: Station) => {
      if (currentStation.id === station.id && isPlaying) {
        return;
      }
      setCurrentStation(station);
      loadAndPlayStream(station);
    },
    [currentStation.id, isPlaying, loadAndPlayStream]
  );

  // Toggle Play / Pause
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (!audio.src || audio.src === "") {
        loadAndPlayStream(currentStation);
      } else {
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
            setError(null);
          })
          .catch(() => {
            loadAndPlayStream(currentStation);
          });
      }
    }
  }, [isPlaying, currentStation, loadAndPlayStream]);

  // Next / Previous Station
  const nextStation = useCallback(() => {
    const idx = STATIONS.findIndex((s) => s.id === currentStation.id);
    const nextIdx = (idx + 1) % STATIONS.length;
    playStation(STATIONS[nextIdx]);
  }, [currentStation.id, playStation]);

  const prevStation = useCallback(() => {
    const idx = STATIONS.findIndex((s) => s.id === currentStation.id);
    const prevIdx = (idx - 1 + STATIONS.length) % STATIONS.length;
    playStation(STATIONS[prevIdx]);
  }, [currentStation.id, playStation]);

  // Sleep Timer countdown handler
  const setSleepTimerDuration = (minutes: number | null) => {
    if (sleepIntervalRef.current) {
      clearInterval(sleepIntervalRef.current);
      sleepIntervalRef.current = null;
    }

    if (minutes === null || minutes <= 0) {
      setSleepTimer(null);
      return;
    }

    const totalSeconds = minutes * 60;
    setSleepTimer(totalSeconds);

    sleepIntervalRef.current = setInterval(() => {
      setSleepTimer((prev) => {
        if (prev === null || prev <= 1) {
          if (sleepIntervalRef.current) clearInterval(sleepIntervalRef.current);
          if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
          }
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Setup MediaSession handlers
  useEffect(() => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.setActionHandler("play", () => togglePlay());
      navigator.mediaSession.setActionHandler("pause", () => togglePlay());
      navigator.mediaSession.setActionHandler("previoustrack", () => prevStation());
      navigator.mediaSession.setActionHandler("nexttrack", () => nextStation());
    }
  }, [togglePlay, prevStation, nextStation]);

  const clearError = () => setError(null);

  return (
    <AudioContext.Provider
      value={{
        currentStation,
        isPlaying,
        isBuffering,
        error,
        volume,
        isMuted,
        favorites,
        recentStations,
        lang,
        nowPlayingOpen,
        sleepTimer,
        eqPreset,
        playStation,
        togglePlay,
        nextStation,
        prevStation,
        setVolumeLevel,
        toggleMute,
        toggleFavorite,
        isFavorite,
        setLang,
        setNowPlayingOpen,
        setSleepTimerDuration,
        setEqPreset,
        clearError,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
