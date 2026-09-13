"use client";

import { useSyncExternalStore } from "react";
import { timeUntilFrom } from "@/lib/utils";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

// A single shared ticking clock, external to React state entirely. Every
// mounted <Countdown> subscribes to the same one-second interval instead of
// each running its own setState-in-effect (which the react-hooks/purity and
// set-state-in-effect rules both flag, and which also causes an SSR/client
// hydration mismatch since "now" would otherwise be computed during render).
let now = 0; // 0 = "not ticking yet" — identical on server and first client render
const listeners = new Set<() => void>();
let intervalId: ReturnType<typeof setInterval> | null = null;

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!intervalId) {
    now = Date.now();
    intervalId = setInterval(() => {
      now = Date.now();
      listeners.forEach((l) => l());
    }, 1000);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
}

function getSnapshot() {
  return now;
}

function getServerSnapshot() {
  return 0;
}

export function Countdown({ expiresAt }: { expiresAt: string }) {
  const currentTime = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (currentTime === 0) {
    return (
      <div className="flex items-center gap-1 font-display text-sm font-medium tabular-nums text-text-muted">
        <span>--D</span>
        <span>:</span>
        <span>--H</span>
        <span>:</span>
        <span>--M</span>
        <span>:</span>
        <span>--S</span>
      </div>
    );
  }

  const left = timeUntilFrom(expiresAt, currentTime);

  if (!left) {
    return <span className="text-xs font-medium text-danger">Deal ended</span>;
  }

  return (
    <div className="flex items-center gap-1 font-display text-sm font-medium tabular-nums text-accent-cyan">
      <span>{pad(left.days)}D</span>
      <span className="text-text-muted">:</span>
      <span>{pad(left.hours)}H</span>
      <span className="text-text-muted">:</span>
      <span>{pad(left.minutes)}M</span>
      <span className="text-text-muted">:</span>
      <span>{pad(left.seconds)}S</span>
    </div>
  );
}
