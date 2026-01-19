"use client";

import { PageHeader } from "@/components/layout/header/header-component";
import { Button } from "@/components/common/button";
import { FileDown } from "lucide-react";
import { FileUploadField } from "@/components/common/file-upload";
import WeeklyHoursCard from "@/components/common/WeeklyHoursCard";
import ReportSummary from "@/components/common/reportsummary";

export default function Home() {
  const handleFilesChange = (files: File[]) => {
    console.log("Uploaded files:", files);
  };

  return (
    <div className="w-full">
      <PageHeader
        title="Home"
        action={
          <Button variant="outline" className="gap-2">
            <FileDown className="w-4 h-4" />
            Export Report
          </Button>
        }
      />
      <div className="flex-1 p-6 bg-white">
        {/* Page content */}
        <div className="mb-6">Dashboard content coming soon...</div>

        {/* FileUploadField component here */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Test File Upload</h2>
          <FileUploadField
            showMoreDetails={true}
            onFilesChange={handleFilesChange}
          />
        </div>

        {/* WeeklyHoursCard Below */}
        <div className="mt-10">
          <WeeklyHoursCard />
        </div>

        {/*ReportSummary */}
        <div className="mt-10">
          <ReportSummary providers={[]} billable={0} nonBillable={0} />
        </div>
      </div>
    </div>
  );
}