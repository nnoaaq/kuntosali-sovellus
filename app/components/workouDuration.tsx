"use client";

import { useEffect, useState } from "react";

export function WorkoutDuration({ startTime }: { startTime: string }) {
  const [duration, setDuration] = useState<string>("0:00");
  useEffect(() => {
    const startTimeUTC = new Date(`${startTime}Z`).getTime();
    const calculateDuration = () => {
      const now = new Date().getTime();
      const diffInMs = now - startTimeUTC;
      const totalSeconds = Math.floor(diffInMs / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      const formattedMinutes = minutes.toString().padStart(2, "0");
      const formattedSeconds = seconds.toString().padStart(2, "0");
      setDuration(`${hours}:${formattedMinutes}:${formattedSeconds}`);
    };
    calculateDuration();
    const interval = setInterval(calculateDuration, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <div className="flex justify-center h-full p-1 rounded-lg bg-zinc-700 w-auto text-white font-mono">
      Kesto {duration}
    </div>
  );
}
