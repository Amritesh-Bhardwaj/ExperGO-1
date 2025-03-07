"use client";

import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  TooltipItem,
} from "chart.js";
import tableData from "@/app/data/tableData.json";

ChartJS.register(ArcElement, Tooltip, Legend);

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

interface TableData {
  tableData: State[];
}

export default function PieChartPage() {
  const processData = (data: TableData) => {
    const states = data.tableData;

    // WIP Data
    const wipData = states.reduce((acc, state) => {
      acc += state.wip;
      state.regions.forEach((region) => {
        acc += region.wip;
        region.branches.forEach((branch) => {
          acc += branch.wip;
        });
      });
      return acc;
    }, 0);

    const wipChildrenData = [
      { title: "Pending Approval", value: wipData * 0.3 },
      { title: "Under Review", value: wipData * 0.25 },
      { title: "Awaiting Documents", value: wipData * 0.15 },
      { title: "Verification Stage", value: wipData * 0.2 },
      { title: "Final Processing", value: wipData * 0.1 },
    ];

    // HL/LAP Data
    const hlLapData = states.reduce(
      (acc, state) => {
        acc.total += state.sanctionCount;
        state.regions.forEach((region) => {
          acc.total += region.sanctionCount;
          region.branches.forEach((branch) => {
            acc.total += branch.sanctionCount;
          });
        });
        return acc;
      },
      { total: 0 }
    );
    const hlValue = hlLapData.total * 0.6;
    const lapValue = hlLapData.total * 0.4;

    // Rejection/Cancellation Data
    const rejectionCancellationData = states.reduce(
      (acc, state) => {
        acc.rejection += state.rejection;
        acc.cancellation += state.cancellation;
        state.regions.forEach((region) => {
          acc.rejection += region.rejection;
          acc.cancellation += region.cancellation;
          region.branches.forEach((branch) => {
            acc.rejection += branch.rejection;
            acc.cancellation += branch.cancellation;
          });
        });
        return acc;
      },
      { rejection: 0, cancellation: 0 }
    );

    return { wipChildrenData, hlLapData: [hlValue, lapValue], rejectionCancellationData };
  };

  const { wipChildrenData, hlLapData, rejectionCancellationData } = processData(tableData);

  // Chart Data
  const wipChartData: ChartData<"pie", number[], string> = {
    labels: wipChildrenData.map((d) => d.title),
    datasets: [
      {
        data: wipChildrenData.map((d) => d.value),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const hlLapChartData: ChartData<"pie", number[], string> = {
    labels: ["HL", "LAP"],
    datasets: [
      {
        data: hlLapData,
        backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(255, 206, 86, 0.6)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const rejectionCancellationChartData: ChartData<"pie", number[], string> = {
    labels: ["Rejection", "Cancellation"],
    datasets: [
      {
        data: [rejectionCancellationData.rejection, rejectionCancellationData.cancellation],
        backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(75, 192, 192, 0.6)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(75, 192, 192, 1)"],
        borderWidth: 1,
      },
    ],
  };

  // Chart Options with Tooltips
  const chartOptions: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"pie">) => {
            const label = context.label || "";
            const value = Number(context.raw);
            const total = context.dataset.data.reduce((acc: number, val) => acc + Number(val), 0);
            const percentage = ((value / total) * 100).toFixed(2);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Pie Chart Page</h1>
      <div className="grid grid-cols-1">
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* WIP Pie Chart */}
          <div className="bg-white rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">WIP</h2>
            <div className="w-full h-64">
              <Pie data={wipChartData} options={chartOptions} />
            </div>
          </div>

          {/* HL/LAP Pie Chart */}
          <div className="bg-white rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">HL/LAP</h2>
            <div className="w-full h-64">
              <Pie data={hlLapChartData} options={chartOptions} />
            </div>
          </div>
        </div>
        <div className="grid justify-center">
          {/* Rejection/Cancellation Pie Chart */}
          <div className="bg-white rounded-lg p-4 w-full max-w-xs">
            <h2 className="text-xl font-semibold mb-4">Rejection/Cancellation</h2>
            <div className="w-full h-64">
              <Pie data={rejectionCancellationChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
