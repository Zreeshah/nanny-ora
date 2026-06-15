"use client";

import { useEffect, useState } from "react";

interface StatsTickerProps {
  value: number;
  suffix?: string;
  duration?: number; // duration in ms
}

export default function StatsTicker({ value, suffix = "", duration = 1200 }: StatsTickerProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    const totalMiliseconds = duration;
    const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 16); // cap at ~60fps
    
    const timer = setInterval(() => {
      start += Math.ceil(end / (totalMiliseconds / incrementTime));
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <span className="font-bold text-foreground tabular-nums">
      {count}
      {suffix}
    </span>
  );
}
