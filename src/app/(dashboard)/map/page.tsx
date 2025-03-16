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
  TooltipItem,
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
  freshDisbAmt: number;
}

interface Region {
  id: string;
  name: string;
  wip: number;
  sanctionCount: number;
  rejection: number;
  cancellation: number;
  freshDisbAmt: number;
  branches: Branch[];
}

interface State {
  id: string;
  name: string;
  wip: number;
  sanctionCount: number;
  rejection: number;
  cancellation: number;
  freshDisbAmt: number;
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
  // Chart data series visibility state
  const [datasetVisibility, setDatasetVisibility] = useState<boolean[]>([true, true, true, true]);

  const processData = (data: TableData) => {
    const states = data.tableData
      .filter((state) => state.id !== "grandTotal")
      .map((state) => ({
        ...state,
        ftr: state.wip,
        approvalRate: state.sanctionCount / (state.sanctionCount + state.rejection + state.cancellation),
        loginCount: state.regions.length * 10,
        freshDisbursement: state.freshDisbAmt,
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

  // Toggle visibility for a dataset
  const toggleDatasetVisibility = (index: number) => {
    setDatasetVisibility((prev) => {
      const newVisibility = [...prev];
      newVisibility[index] = !newVisibility[index];
      return newVisibility;
    });
  };

  // Define dataset properties with colors for consistency
  const datasetProperties = [
    {
      label: "Sanction Count",
      backgroundColor: "rgba(255, 99, 132, 0.6)",
      borderColor: "rgba(255, 99, 132, 1)",
    },
    {
      label: "Sanction Amount",
      backgroundColor: "rgba(54, 162, 235, 0.6)",
      borderColor: "rgba(54, 162, 235, 1)",
    },
    {
      label: "Disbursement Count",
      backgroundColor: "rgba(75, 192, 192, 0.6)",
      borderColor: "rgba(75, 192, 192, 1)",
    },
    {
      label: "Disbursement Amount",
      backgroundColor: "rgba(255, 206, 86, 0.6)",
      borderColor: "rgba(255, 206, 86, 1)",
    },
  ];

  // Bar chart data logic
  const getBarChartData = () => {
    let labels: string[] = [];
    let datasets: any[] = [];

    if (!selectedState) {
      // No state selected: Show all states
      labels = states.map((state) => state.name);

      if (datasetVisibility[0]) {
        datasets.push({
          label: datasetProperties[0].label,
          data: states.map((state) => state.sanctionCount),
          backgroundColor: datasetProperties[0].backgroundColor,
          borderColor: datasetProperties[0].borderColor,
          borderWidth: 1,
        });
      }

      if (datasetVisibility[1]) {
        datasets.push({
          label: datasetProperties[1].label,
          data: states.map((state) => state.sanctionCount * 1000),
          backgroundColor: datasetProperties[1].backgroundColor,
          borderColor: datasetProperties[1].borderColor,
          borderWidth: 1,
        });
      }

      if (datasetVisibility[2]) {
        datasets.push({
          label: datasetProperties[2].label,
          data: states.map((state) => state.freshDisbAmt / 1000),
          backgroundColor: datasetProperties[2].backgroundColor,
          borderColor: datasetProperties[2].borderColor,
          borderWidth: 1,
        });
      }

      if (datasetVisibility[3]) {
        datasets.push({
          label: datasetProperties[3].label,
          data: states.map((state) => state.freshDisbAmt),
          backgroundColor: datasetProperties[3].backgroundColor,
          borderColor: datasetProperties[3].borderColor,
          borderWidth: 1,
        });
      }
    } else {
      const selectedStateData = states.find((state) => state.name === selectedState);
      if (!selectedStateData) {
        return { labels: [], datasets: [] };
      }

      if (selectedStateData.regions.length > 1) {
        // Multiple regions: Show region data
        labels = selectedStateData.regions.map((region) => region.name);

        if (datasetVisibility[0]) {
          datasets.push({
            label: datasetProperties[0].label,
            data: selectedStateData.regions.map((region) => region.sanctionCount),
            backgroundColor: datasetProperties[0].backgroundColor,
            borderColor: datasetProperties[0].borderColor,
            borderWidth: 1,
          });
        }

        if (datasetVisibility[1]) {
          datasets.push({
            label: datasetProperties[1].label,
            data: selectedStateData.regions.map((region) => region.sanctionCount * 1000),
            backgroundColor: datasetProperties[1].backgroundColor,
            borderColor: datasetProperties[1].borderColor,
            borderWidth: 1,
          });
        }

        if (datasetVisibility[2]) {
          datasets.push({
            label: datasetProperties[2].label,
            data: selectedStateData.regions.map((region) => region.freshDisbAmt / 1000),
            backgroundColor: datasetProperties[2].backgroundColor,
            borderColor: datasetProperties[2].borderColor,
            borderWidth: 1,
          });
        }

        if (datasetVisibility[3]) {
          datasets.push({
            label: datasetProperties[3].label,
            data: selectedStateData.regions.map((region) => region.freshDisbAmt),
            backgroundColor: datasetProperties[3].backgroundColor,
            borderColor: datasetProperties[3].borderColor,
            borderWidth: 1,
          });
        }
      } else if (selectedStateData.regions.length === 1) {
        // Single region: Show branch data
        const region = selectedStateData.regions[0];
        labels = region.branches.map((branch) => branch.name);

        if (datasetVisibility[0]) {
          datasets.push({
            label: datasetProperties[0].label,
            data: region.branches.map((branch) => branch.sanctionCount),
            backgroundColor: datasetProperties[0].backgroundColor,
            borderColor: datasetProperties[0].borderColor,
            borderWidth: 1,
          });
        }

        if (datasetVisibility[1]) {
          datasets.push({
            label: datasetProperties[1].label,
            data: region.branches.map((branch) => branch.sanctionCount * 1000),
            backgroundColor: datasetProperties[1].backgroundColor,
            borderColor: datasetProperties[1].borderColor,
            borderWidth: 1,
          });
        }

        if (datasetVisibility[2]) {
          datasets.push({
            label: datasetProperties[2].label,
            data: region.branches.map((branch) => branch.freshDisbAmt / 1000),
            backgroundColor: datasetProperties[2].backgroundColor,
            borderColor: datasetProperties[2].borderColor,
            borderWidth: 1,
          });
        }

        if (datasetVisibility[3]) {
          datasets.push({
            label: datasetProperties[3].label,
            data: region.branches.map((branch) => branch.freshDisbAmt),
            backgroundColor: datasetProperties[3].backgroundColor,
            borderColor: datasetProperties[3].borderColor,
            borderWidth: 1,
          });
        }
      }
    }

    return { labels, datasets };
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: TooltipItem<"bar">) {
            const datasetLabel = tooltipItem.dataset.label || 'Unknown';
            const value = tooltipItem.parsed.y;
            return `${datasetLabel}: ${datasetLabel.includes('Amount') ? `₹${value.toLocaleString()}` : value}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          autoSkip: false,
          font: {
            size: 10,
          },
        },
        afterFit: function (scale: { height: number }) {
          scale.height = 80;
        },
      },
    },
    layout: {
      padding: {
        bottom: 10,
      },
    },
  };

  return (
    <div
      className="container mx-auto flex h-[85vh]"
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
        {/* Top Section (KPIs) - 40% */}
        <div className="bg-white rounded-lg p-2 mb-2 h-[40%] overflow-hidden">
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

        {/* Bottom Section (Bar Graph) - 60% */}
        <div className="bg-white rounded-lg p-2 h-[60%] overflow-hidden">
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-lg font-bold">Sanctions & Disbursements</h2>

            {/* Custom Legend with Checkboxes */}
            <div className="flex gap-4 flex-wrap">
              {datasetProperties.map((dataset, index) => (
                <label
                  key={index}
                  className="flex items-center text-sm"
                  style={{
                    textDecoration: "underline",
                    textDecorationColor: dataset.backgroundColor,
                    textDecorationThickness: "4px",
                    textUnderlineOffset: "3px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={datasetVisibility[index]}
                    onChange={() => toggleDatasetVisibility(index)}
                    className="mr-2"
                  />
                  {dataset.label}
                </label>
              ))}
            </div>
          </div>

          <div className="h-[calc(100%-2rem)]">
            <Bar data={getBarChartData()} options={barChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
