"use client";
import AnalyticsCharts from "@/components/analytics-charts";

export default function AnalyticsPage() {
  return (
    <>
      <div className="sm:flex-auto">
        <h1 className="text-base font-semibold leading-6 text-gray-900">
          Analytics
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          You can find realtime carbon monoxide value & its graphical
          representaion for deeper analysis.
        </p>
      </div>

      <AnalyticsCharts />
    </>
  );
}
