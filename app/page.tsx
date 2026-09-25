"use client";

import { AudioProvider } from "../context/AudioContext";
import { RadioApp } from "../components/RadioApp";

export default function Home() {
  return (
    <AudioProvider>
      <RadioApp />
    </AudioProvider>
  );
}
