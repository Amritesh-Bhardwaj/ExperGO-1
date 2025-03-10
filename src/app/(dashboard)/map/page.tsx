"use client";

import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import IndiaMap from "./IndiaMap";
import tableData from "@/app/data/tableData.json";
import KpiCard from "@/app/components/KpiCard";

ChartJS.register(BarElement, CategoryScale, LinearScale, ChartTooltip, Legend);

interface Branch {
  id: string;
  name: string;
  wip: number;
  sanctionCount: number;
  rejection: number;
  cancellation: number;
  freshDisbAmt: number; // Added to match JSON data
}

interface Region {
  id: string;
  name: string;
  wip: number;
  sanctionCount: number;
  rejection: number;
  cancellation: number;
  freshDisbAmt: number; // Added to match JSON data
  branches: Branch[];
}

interface State {
  id: string;
  name: string;
  wip: number;
  sanctionCount: number;
  rejection: number;
  cancellation: number;
  freshDisbAmt: number; // Added to match JSON data
  regions: Region[];
}

interface ComputedState extends State {
  ftr: number;
  approvalRate: number;
  loginCount: number;
  freshDisbursement: number;
}

interface TableData {
  tableData: State[];
}

export default function MapPage() {
  const processData = (data: TableData) => {
    const states = data.tableData
      .filter((state) => state.id !== "grandTotal") // Exclude Grand Total
      .map((state) => ({
        ...state,
        ftr: state.wip,
        approvalRate: state.sanctionCount / (state.sanctionCount + state.rejection + state.cancellation),
        loginCount: state.regions.length * 10,
        freshDisbursement: state.freshDisbAmt, // Use actual freshDisbAmt from JSON
      }));

    const grandTotals = states.reduce(
      (acc, state) => ({
        ftr: acc.ftr + state.ftr,
        approvalRate: acc.approvalRate + state.approvalRate,
        loginCount: acc.loginCount + state.loginCount,
        freshDisbursement: acc.freshDisbursement + state.freshDisbursement,
        sanctionCount: acc.sanctionCount + state.sanctionCount,
      }),
      {
        ftr: 0,
        approvalRate: 0,
        loginCount: 0,
        freshDisbursement: 0,
        sanctionCount: 0,
      }
    );

    grandTotals.approvalRate = grandTotals.approvalRate / states.length;

    return { states, grandTotals };
  };

  const { states, grandTotals } = processData(tableData);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const mapData = selectedState
    ? states.find((state) => state.name === selectedState)
    : { name: "India", ...grandTotals };

  // Bar chart data logic
  const getBarChartData = () => {
    if (!selectedState) {
      // No state selected: Show all states
      return {
        labels: states.map((state) => state.name),
        datasets: [
          {
            label: "Fresh Disbursement",
            data: states.map((state) => state.freshDisbursement),
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
          {
            label: "Sanction Count",
            data: states.map((state) => state.sanctionCount),
            backgroundColor: "rgba(255, 99, 132, 0.6)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      };
    }

    const selectedStateData = states.find((state) => state.name === selectedState);
    if (!selectedStateData) {
      return { labels: [], datasets: [] }; // Fallback
    }

    if (selectedStateData.regions.length > 1) {
      // Multiple regions: Show region data
      return {
        labels: selectedStateData.regions.map((region) => region.name),
        datasets: [
          {
            label: "Fresh Disbursement",
            data: selectedStateData.regions.map((region) => region.freshDisbAmt),
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
          {
            label: "Sanction Count",
            data: selectedStateData.regions.map((region) => region.sanctionCount),
            backgroundColor: "rgba(255, 99, 132, 0.6)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      };
    } else if (selectedStateData.regions.length === 1) {
      // Single region: Show branch data
      const region = selectedStateData.regions[0];
      return {
        labels: region.branches.map((branch) => branch.name),
        datasets: [
          {
            label: "Fresh Disbursement",
            data: region.branches.map((branch) => branch.freshDisbAmt),
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
          {
            label: "Sanction Count",
            data: region.branches.map((branch) => branch.sanctionCount),
            backgroundColor: "rgba(255, 99, 132, 0.6)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      };
    }

    return { labels: [], datasets: [] }; // Fallback
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div
      className="container mx-auto flex h-screen"
      style={{ padding: "0", overflow: "hidden" }}
    >
      {/* Left Section (Map) - 60% */}
      <div className="w-3/5 pr-4 flex flex-col h-full">
        <h2 className="text-2xl font-bold mb-2">India Map</h2>
        <div className="bg-white rounded-lg p-2 flex-1 overflow-hidden">
          <IndiaMap setSelectedState={setSelectedState} />
        </div>
      </div>

      {/* Right Section - 40% */}
      <div className="w-2/5 pl-4 flex flex-col h-full">
        {/* Top Section (KPIs) - 50% */}
        <div className="bg-white rounded-lg p-2 mb-2 flex-1 overflow-hidden">
          <h2 className="text-2xl font-bold mb-2">Key Metrics</h2>
          <div className="flex justify-between items-center gap-2 h-full overflow-hidden">
            <KpiCard
              title="FTR"
              value={(mapData?.ftr ?? grandTotals.ftr).toFixed(2)}
              change={0}
              unit=""
              isExpandable={false}
            />
            <KpiCard
              title="Approval Rate"
              value={((mapData?.approvalRate ?? grandTotals.approvalRate) * 100).toFixed(2)}
              change={0}
              unit="%"
              isExpandable={false}
            />
            <KpiCard
              title="Login Count"
              value={mapData?.loginCount ?? grandTotals.loginCount}
              change={0}
              unit=""
              isExpandable={false}
            />
          </div>
        </div>

        {/* Bottom Section (Bar Graph) - 50% */}
        <div className="bg-white rounded-lg p-2 flex-1 overflow-hidden">
          <h2 className="text-2xl font-bold mb-2">Disbursement & Sanction</h2>
          <div className="h-full">
            <Bar data={getBarChartData()} options={barChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
