import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/card";
import { Progress } from "@/components/common/progress";
import { ArrowRight } from "lucide-react";

type Props = {
  storageKey?: string; // for cross-tab syncing
  initialHours?: number;
  targetHours?: number;
};

export default function WeeklyHoursCard({
  storageKey = "weekly-hours",
  initialHours = 36,
  targetHours = 40,
}: Props) {
  const [hours, setHours] = useState<number>(initialHours);
  const bcRef = useRef<BroadcastChannel | null>(null);

  const percent = Math.min(100, Math.round((hours / targetHours) * 100));
  const persist = (value: number) => {
    setHours(value);
    try { localStorage.setItem(storageKey, String(value)); } catch {}
    try { bcRef.current?.postMessage(value); } catch {}
  };

  return (
    <Card className="max-w-2xl mx-auto rounded-3xl shadow-lg p-10 bg-white falcorp-card">
      <CardHeader className="flex items-start justify-between p-0 mb-8">
        <CardTitle className="text-[28px] font-semibold text-[#0A0F1F] tracking-tight falcorp-title">
          Weekly Hours
        </CardTitle>
        <a
          className="text-sm text-[#009FB7] underline hover:text-[#007C8F] falcorp-link"
          href="#"
        >
          View Time Entry
        </a>
      </CardHeader>

      <div className="flex flex-col items-center py-4 falcorp-center">
        <div className="text-[80px] font-extrabold text-[#3578FF] leading-none falcorp-hours">{hours}</div>
        <div className="mt-3 text-[18px] text-[#1A2233] falcorp-subtitle">Hours worked this week</div>
      </div>

      <CardContent className="p-0 mt-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[16px] font-medium text-[#1A2233] falcorp-label">Progress</span>
          <span className="text-[16px] font-semibold text-[#1A2233] falcorp-label">{hours}/{targetHours}h</span>
        </div>

        <div className="w-full bg-[#E5E7EB] h-4 rounded-full relative overflow-hidden falcorp-progress">
          <div
            className="h-4 rounded-full absolute left-0 top-0 falcorp-progress-bar"
            style={{ width: `${percent}%`, background: "#3578FF", transition: "width 400ms ease" }}
          />
        </div>

        <div className="mt-6 flex items-center gap-3 falcorp-indicator">
          <span className="w-3 h-3 rounded-full bg-[#3578FF]" />
          <span className="text-sm text-[#3578FF] font-medium">On track: {Math.max(0, targetHours - hours)} hours remaining</span>
        </div>
      </CardContent>
    </Card>
  );
}
