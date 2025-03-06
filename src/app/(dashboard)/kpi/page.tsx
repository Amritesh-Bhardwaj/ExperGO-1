"use client";

import React from "react";
import KpiCard from "../../components/KpiCard";

export default function KpiPage() {
  const kpis = [
    { title: "Opening Stock", value: "606", change: 10.5 },
    { title: "Application Login", value: "620", change: 12 },
    { title: "Sanction Count", value: "603.00", change: 8.5 },
    { title: "Sanction Amount (in Cr)", value: "32.67", change: 15.3 },
    { title: "PNI Sanction Count", value: "427", change: 2.1 },
    { title: "PNI Sanction Amount (in Cr)", value: "33.54", change: -1.5 },
    { title: "Rejection Count", value: "33", change: -3.2 },
    { title: "Cancellation Count", value: "39", change: 5.7 },
    { title: "DI Count", value: "353", change: 0.3 },
    { title: "DI Value", value: "41.64", change: 7.8 },
    { title: "DA Count", value: "36.19", change: -0.5 },
    { title: "DA Value", value: "35.04", change: 3.6 },
  ];

  // WIP child cards data
  const wipChildrenData = [
    { title: "Pending Approval", value: "322", change: 2.1 },
    { title: "Under Review", value: "276", change: -5.3 },
    { title: "Awaiting Documents", value: "185", change: 7.8 },
    { title: "Verification Stage", value: "291", change: -1.2 },
    { title: "Final Processing", value: "44", change: 12.5 },
  ];

  // New components for the vertical box
  const additionalKpis = [
    { title: "FTR", value: "85%", change: 4.2 },
    { title: "Approval Rate", value: "92%", change: -1.8 },
  ];

  // Helper function to filter KPIs by titles
  const getKpisByTitles = (titles: string[]) => {
    return kpis.filter((kpi) => titles.includes(kpi.title));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">KPI Dashboard</h1>

      {/* Main layout: 75% left, 25% right */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Section (75%): Horizontal Boxes */}
        <div className="w-full lg:w-3/4 flex flex-col gap-6">
          {/* 1st Horizontal Box: Opening Stock, Application Login */}
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getKpisByTitles(["Opening Stock", "Application Login"]).map((kpi, index) => (
                <KpiCard
                  key={index}
                  title={kpi.title}
                  value={kpi.value}
                  change={kpi.change}
                />
              ))}
            </div>
          </div>

          {/* 2nd Horizontal Box: Sanction Count, Sanction Amount, PNI Count, PNI Amount */}
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {getKpisByTitles([
                "Sanction Count",
                "Sanction Amount (in Cr)",
                "PNI Sanction Count",
                "PNI Sanction Amount (in Cr)",
              ]).map((kpi, index) => (
                <KpiCard
                  key={index}
                  title={kpi.title}
                  value={kpi.value}
                  change={kpi.change}
                />
              ))}
            </div>
          </div>

          {/* 3rd Horizontal Box: Rejection Count, Cancellation Count */}
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getKpisByTitles(["Rejection Count", "Cancellation Count"]).map((kpi, index) => (
                <KpiCard
                  key={index}
                  title={kpi.title}
                  value={kpi.value}
                  change={kpi.change}
                />
              ))}
            </div>
          </div>

          {/* 4th Horizontal Box: DI Count, DI Value, DA Count, DA Value */}
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {getKpisByTitles(["DI Count", "DI Value", "DA Count", "DA Value"]).map((kpi, index) => (
                <KpiCard
                  key={index}
                  title={kpi.title}
                  value={kpi.value}
                  change={kpi.change}
                />
              ))}
            </div>
          </div>

          {/* 5th Horizontal Box: WIP (Expandable) */}
          <div className="bg-gray-100 rounded-lg p-4">
            <KpiCard
              title="WIP"
              value="1118.00"
              change={-12.4}
              isExpandable={true}
            >
              {/* Render WIP child cards inside the parent */}
              {(isExpanded: boolean) =>
                isExpanded && (
                  <div className="mt-2 pl-4 border-l-2 border-gray-200 space-y-2">
                    {wipChildrenData.map((childKpi, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-lg p-4"
                      >
                        <h4 className="text-gray-600 text-xs font-medium">
                          {childKpi.title}
                        </h4>
                        <p className="text-xl font-bold">{childKpi.value}</p>
                        <p
                          className={`text-xs ${
                            childKpi.change >= 0 ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {`${childKpi.change >= 0 ? "+" : ""}${childKpi.change}% from last month`}
                        </p>
                      </div>
                    ))}
                  </div>
                )
              }
            </KpiCard>
          </div>
        </div>

        {/* Right Section (25%): Vertical Box with FTR and Approval Rate */}
        <div className="w-full lg:w-1/4">
          <div className="bg-gray-100 rounded-lg p-4 flex flex-col gap-4">
            {additionalKpis.map((kpi, index) => (
              <KpiCard
                key={index}
                title={kpi.title}
                value={kpi.value}
                change={kpi.change}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
