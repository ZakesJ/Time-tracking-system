import React, { useState } from "react";
import { Button } from "@/components/common/button";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/card";
import { Progress } from "@/components/common/progress";
import { ArrowRight } from "lucide-react";

type Provider = {
  name: string;
  hours: number;
};

type Props = {
  providers: Provider[];
  billable: number;
  nonBillable: number;
};

export default function ReportSummary({ providers, billable, nonBillable }: Props) {
  const [running, setRunning] = useState(true);

  return (
    <div className="p-6 bg-[#f5f7fa] min-h-screen">
      <Card className="bg-[#003B5C] text-white shadow-md rounded-lg p-6">
        {/* Providers List */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Providers</h3>
          <ul className="space-y-3">
            {providers.map((p) => (
              <li key={p.name} className="flex justify-between items-center bg-[#004A78] p-3 rounded-md">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-6 rounded-md inline-block bg-[#009CA6]" />
                  <span className="text-lg font-semibold">{p.name}</span>
                </div>
                <div className="text-lg font-semibold">{p.hours}h</div>
              </li>
            ))}
          </ul>
        </div>

        <hr className="my-6 border-t border-[#005A99]" />

        {/* Billable vs Non-billable */}
        <div>
          <div className="flex items-baseline justify-between mb-4">
            <h3 className="text-xl font-semibold">Billable vs Non-billable</h3>
            <div className="text-sm text-[#B0CFF5]">
              Total: {providers.reduce((s, p) => s + p.hours, 0)} hours
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-[#004A78] rounded-full h-5 overflow-hidden mb-4">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(billable / (billable + nonBillable || 1)) * 100}%`,
                background: "#009CA6",
              }}
            />
          </div>

          {/* Legend + Button */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#009CA6]" />
              <span className="text-base">Billable: {billable} hours</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#5A7C99]" />
              <span className="text-base">Non-Billable: {nonBillable} hours</span>
            </div>

            <div className="ml-auto">
              <Button size="sm" onClick={() => setRunning((r) => !r)}>
                {running ? "Pause" : "Resume"}
              </Button>
            </div>
          </div>
        </div>

        {/* Reference screenshot */}
        <div className="mt-6 text-sm text-[#B0CFF5]">Reference screenshot:</div>
        <img src="/mnt/data/Report-summary.jpg" alt="reference" className="mt-2 rounded-md shadow" />
      </Card>
    </div>
  );
}
