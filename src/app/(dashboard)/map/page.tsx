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

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, ChartTooltip, Legend);

// Define the type for tableData.json
interface Branch {
  id: string;
  name: string;
  wip: number;
  sanctionCount: number;
  rejection: number;
  cancellation: number;
}

interface Region {
  id: string;
  name: string;
  wip: number;
  sanctionCount: number;
  rejection: number;
  cancellation: number;
  branches: Branch[];
}

interface State {
  id: string;
  name: string;
  wip: number;
  sanctionCount: number;
  rejection: number;
  cancellation: number;
  regions: Region[];
}

// Extended interface for computed metrics
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
  // Process data from tableData.json
  const processData = (data: TableData) => {
    const states = data.tableData.map((state) => ({
      ...state,
      ftr: state.wip, // Placeholder: FTR as WIP
      approvalRate: state.sanctionCount / (state.sanctionCount + state.rejection + state.cancellation), // Placeholder: Approval Rate
      loginCount: state.regions.length * 10, // Placeholder: Login Count
      freshDisbursement: state.wip * 0.5, // Placeholder: Fresh Disbursement
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

    // Normalize approval rate for grand totals
    grandTotals.approvalRate = grandTotals.approvalRate / states.length;

    return { states, grandTotals };
  };

  const { states, grandTotals } = processData(tableData);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  // Map data for selected state or grand totals
  const mapData = selectedState
    ? states.find((state) => state.name === selectedState)
    : { name: "India", ...grandTotals };

  // Bar chart data
  const barChartData = {
    labels: ["Fresh Disbursement", "Sanction Count"],
    datasets: [
      {
        label: selectedState || "India",
        data: [
          mapData?.freshDisbursement ?? grandTotals.freshDisbursement,
          mapData?.sanctionCount ?? grandTotals.sanctionCount,
        ],
        backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(255, 99, 132, 0.6)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
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
      className="container mx-auto p-6 flex h-screen"
      style={{ overflow: "hidden" }} // Prevent scrolling at the container level
    >
      {/* Left Section (Map) - 60% */}
      <div className="w-3/5 pr-4 flex flex-col h-full">
        <h2 className="text-2xl font-bold mb-4">India Map</h2>
        <div className="bg-white rounded-lg p-4 flex-1 overflow-hidden">
          <IndiaMap setSelectedState={setSelectedState} />
        </div>
      </div>

      {/* Right Section - 40% */}
      <div className="w-2/5 pl-4 flex flex-col h-full">
        {/* Top Section (KPIs) - 50% */}
        <div className="bg-white rounded-lg p-4 mb-4 flex-1 overflow-hidden">
          <h2 className="text-2xl font-bold mb-4">Key Metrics</h2>
          <div className="space-y-4 h-full overflow-hidden">
            <p>FTR: {(mapData?.ftr ?? grandTotals.ftr).toFixed(2)}</p>
            <p>Approval Rate: {((mapData?.approvalRate ?? grandTotals.approvalRate) * 100).toFixed(2)}%</p>
            <p>Login Count: {mapData?.loginCount ?? grandTotals.loginCount}</p>
          </div>
        </div>

        {/* Bottom Section (Bar Graph) - 50% */}
        <div className="bg-white rounded-lg p-4 flex-1 overflow-hidden">
          <h2 className="text-2xl font-bold mb-4">Disbursement & Sanction</h2>
          <div className="h-full">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
