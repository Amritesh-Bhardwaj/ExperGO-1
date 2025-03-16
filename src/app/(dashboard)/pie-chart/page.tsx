"use client";

import React, { useState } from "react";
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
import ChartDataLabels from "chartjs-plugin-datalabels";
import tableData from "@/app/data/tableData.json";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

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

  const [wipVisibility, setWipVisibility] = useState<boolean[]>(
    new Array(wipChildrenData.length).fill(true)
  );
  const [hlLapVisibility, setHlLapVisibility] = useState<boolean[]>([true, true]);
  const [rejectionCancellationVisibility, setRejectionCancellationVisibility] = useState<boolean[]>([true, true]);

  const wipChartData: ChartData<"pie", number[], string> = {
    labels: wipChildrenData.map((d) => d.title).filter((_, i) => wipVisibility[i]),
    datasets: [
      {
        data: wipChildrenData.map((d) => d.value).filter((_, i) => wipVisibility[i]),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ].filter((_, i) => wipVisibility[i]),
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ].filter((_, i) => wipVisibility[i]),
        borderWidth: 1,
      },
    ],
  };

  const hlLapChartData: ChartData<"pie", number[], string> = {
    labels: ["HL", "LAP"].filter((_, i) => hlLapVisibility[i]),
    datasets: [
      {
        data: hlLapData.filter((_, i) => hlLapVisibility[i]),
        backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(255, 206, 86, 0.6)"].filter(
          (_, i) => hlLapVisibility[i]
        ),
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)"].filter(
          (_, i) => hlLapVisibility[i]
        ),
        borderWidth: 1,
      },
    ],
  };

  const rejectionCancellationChartData: ChartData<"pie", number[], string> = {
    labels: ["Rejection", "Cancellation"].filter((_, i) => rejectionCancellationVisibility[i]),
    datasets: [
      {
        data: [rejectionCancellationData.rejection, rejectionCancellationData.cancellation].filter(
          (_, i) => rejectionCancellationVisibility[i]
        ),
        backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(75, 192, 192, 0.6)"].filter(
          (_, i) => rejectionCancellationVisibility[i]
        ),
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(75, 192, 192, 1)"].filter(
          (_, i) => rejectionCancellationVisibility[i]
        ),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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
      datalabels: {
        formatter: (value: number, context: any) => {
          const total = context.dataset.data.reduce((acc: number, val: number) => acc + val, 0);
          const percentage = ((value / total) * 100).toFixed(2);
          return `${percentage}%`;
        },
        color: "#000",
        font: {
          weight: "bold",
          size: 14,
        },
        textAlign: "center",
      },
    },
  };

  const toggleWipVisibility = (index: number) => {
    setWipVisibility((prev) => {
      const newVisibility = [...prev];
      newVisibility[index] = !newVisibility[index];
      return newVisibility;
    });
  };

  const toggleHlLapVisibility = (index: number) => {
    setHlLapVisibility((prev) => {
      const newVisibility = [...prev];
      newVisibility[index] = !newVisibility[index];
      return newVisibility;
    });
  };

  const toggleRejectionCancellationVisibility = (index: number) => {
    setRejectionCancellationVisibility((prev) => {
      const newVisibility = [...prev];
      newVisibility[index] = !newVisibility[index];
      return newVisibility;
    });
  };

  // Define full color arrays (before filtering) to map to original indices
  const wipColors = [
    "rgba(255, 99, 132, 0.6)", // Pending Approval
    "rgba(54, 162, 235, 0.6)", // Under Review
    "rgba(255, 206, 86, 0.6)", // Awaiting Documents
    "rgba(75, 192, 192, 0.6)", // Verification Stage
    "rgba(153, 102, 255, 0.6)", // Final Processing
  ];

  const hlLapColors = [
    "rgba(54, 162, 235, 0.6)", // HL
    "rgba(255, 206, 86, 0.6)", // LAP
  ];

  const rejectionCancellationColors = [
    "rgba(255, 99, 132, 0.6)", // Rejection
    "rgba(75, 192, 192, 0.6)", // Cancellation
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Pie Chart Page</h1>
      <div className="grid grid-cols-1">
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* WIP Pie Chart */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex flex-wrap gap-4 mb-4">
              {wipChildrenData.map((item, index) => (
                <label
                  key={index}
                  className="flex items-center"
                  style={{
                    textDecoration: "underline",
                    textDecorationColor: wipColors[index],
                    textDecorationThickness: "4px", // Increased to 4px for thicker underline
                    textUnderlineOffset: "3px", // Keep offset at 3px
                  }}
                >
                  <input
                    type="checkbox"
                    checked={wipVisibility[index]}
                    onChange={() => toggleWipVisibility(index)}
                    className="mr-2"
                  />
                  {item.title}
                </label>
              ))}
            </div>
            <div className="w-full h-64">
              <Pie data={wipChartData} options={chartOptions} />
            </div>
            <h2 className="text-xl font-semibold mt-4 text-center">WIP</h2>
          </div>

          {/* HL/LAP Pie Chart */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex gap-4 mb-4">
              {["HL", "LAP"].map((label, index) => (
                <label
                  key={index}
                  className="flex items-center"
                  style={{
                    textDecoration: "underline",
                    textDecorationColor: hlLapColors[index],
                    textDecorationThickness: "4px", // Increased to 4px for thicker underline
                    textUnderlineOffset: "3px", // Keep offset at 3px
                  }}
                >
                  <input
                    type="checkbox"
                    checked={hlLapVisibility[index]}
                    onChange={() => toggleHlLapVisibility(index)}
                    className="mr-2"
                  />
                  {label}
                </label>
              ))}
            </div>
            <div className="w-full h-64">
              <Pie data={hlLapChartData} options={chartOptions} />
            </div>
            <h2 className="text-xl font-semibold mt-4 text-center">HL/LAP</h2>
          </div>
        </div>
       {/* <div className="grid justify-center">
          {/* Rejection/Cancellation Pie Chart 
          <div className="bg-white rounded-lg p-4 w-full max-w-xs">
            <div className="flex gap-4 mb-4">
              {["Rejection", "Cancellation"].map((label, index) => (
                <label
                  key={index}
                  className="flex items-center"
                  style={{
                    textDecoration: "underline",
                    textDecorationColor: rejectionCancellationColors[index],
                    textDecorationThickness: "4px", // Increased to 4px for thicker underline
                    textUnderlineOffset: "3px", // Keep offset at 3px
                  }}
                >
                  <input
                    type="checkbox"
                    checked={rejectionCancellationVisibility[index]}
                    onChange={() => toggleRejectionCancellationVisibility(index)}
                    className="mr-2"
                  />
                  {label}
                </label>
              ))}
            </div>
            <div className="w-full h-64">
              <Pie data={rejectionCancellationChartData} options={chartOptions} />
            </div>
            <h2 className="text-xl font-semibold mt-4 text-center">Rejection/Cancellation</h2>
          </div>
        </div> }*/}
      </div>
    </div>
  );
}
