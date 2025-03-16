
"use client";

import React, { useState, useEffect } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartData,
  ChartOptions,
  TooltipItem,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import tableData from "@/app/data/tableData.json";

ChartJS.register(
  ArcElement, 
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip, 
  Legend, 
  ChartDataLabels
);

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

interface WipCategory {
  title: string;
  value: number;
  percentage: number;
}

interface CustomerData {
  "Application Number": string;
  "Customer Name": string;
  "Branch Name": string;
  "State": string;
  "Application Received Date": string;
  "Last Login Acceptance Date": string;
  "PRODUCT": string;
  "SCHEME": string;
  "Loan Purpose": string;
  "Loan Amount Requested": string;
  "Application Status": string;
  "Sanctioned Amount": string;
  "User Sanction Date": string;
  " First Disbursal Date": string;
  "Sourcing RM Name": string;
}

interface LoanPurposeCount {
  purpose: string;
  count: number;
}

export default function PieChartPage() {
  // Define WIP subcategories with their approximate percentage distribution
  const wipSubcategories = [
    { title: "Pending Approval", proportion: 0.3 },
    { title: "Under Review", proportion: 0.25 },
    { title: "Awaiting Documents", proportion: 0.15 },
    { title: "Verification Stage", proportion: 0.2 },
    { title: "Final Processing", proportion: 0.1 },
  ];

  const [wipChildrenData, setWipChildrenData] = useState<WipCategory[]>([]);
  const [hlLapData, setHlLapData] = useState<number[]>([0, 0]);
  const [loanPurposeData, setLoanPurposeData] = useState<LoanPurposeCount[]>([]);
  const [customerData, setCustomerData] = useState<CustomerData[]>([]);
  const [isCustomerDataLoading, setIsCustomerDataLoading] = useState<boolean>(true);
  const [customerDataError, setCustomerDataError] = useState<string | null>(null);
  
  // State for loan purpose chart
  const [chartType, setChartType] = useState<'pie' | 'bar' | 'simplifiedPie'>('simplifiedPie');
  const [groupThreshold, setGroupThreshold] = useState<number>(5);

  // Load and process customer data
  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setIsCustomerDataLoading(true);
        const response = await fetch('/data/customerData.json');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch customer data: ${response.status}`);
        }
        
        const data: CustomerData[] = await response.json();
        setCustomerData(data);
        
        // Process the loan purpose data
        const purposeCounts: { [key: string]: number } = {};
        
        data.forEach(customer => {
          const purpose = customer["Loan Purpose"];
          if (purpose) {
            purposeCounts[purpose] = (purposeCounts[purpose] || 0) + 1;
          }
        });
        
        // Convert to array format for the chart
        const loanPurposeArray = Object.entries(purposeCounts).map(([purpose, count]) => ({
          purpose,
          count
        }));
        
        setLoanPurposeData(loanPurposeArray);
        setIsCustomerDataLoading(false);
      } catch (error) {
        console.error("Error fetching customer data:", error);
        setCustomerDataError(error instanceof Error ? error.message : "An unknown error occurred");
        setIsCustomerDataLoading(false);
      }
    };
    
    fetchCustomerData();
  }, []);

  // Process data from tableData.json
  useEffect(() => {
    const processData = () => {
      const states = tableData.tableData;

      // Calculate total WIP
      const totalWip = states.reduce((acc, state) => {
        // Add state level WIP
        return acc + state.wip;
      }, 0);

      // Calculate WIP subcategories based on proportions
      const wipCategories = wipSubcategories.map((category) => ({
        title: category.title,
        value: totalWip * category.proportion,
        percentage: category.proportion * 100
      }));
      setWipChildrenData(wipCategories);

      // Calculate HL and LAP data
      const totalSanctionCount = states.reduce((acc, state) => acc + state.sanctionCount, 0);
      // Assuming 60% HL and 40% LAP distribution
      setHlLapData([totalSanctionCount * 0.6, totalSanctionCount * 0.4]);
    };

    processData();
  }, []);

  const [wipVisibility, setWipVisibility] = useState<boolean[]>(
    new Array(wipSubcategories.length).fill(true)
  );
  const [hlLapVisibility, setHlLapVisibility] = useState<boolean[]>([true, true]);
  const [loanPurposeVisibility, setLoanPurposeVisibility] = useState<boolean[]>([]);

  // Initialize loan purpose visibility whenever the data changes
  useEffect(() => {
    setLoanPurposeVisibility(new Array(loanPurposeData.length).fill(true));
  }, [loanPurposeData]);

  // Process data for simplified pie chart
  const processedLoanPurposeData = React.useMemo(() => {
    if (loanPurposeData.length === 0) return [];
    
    // Sort data by count in descending order
    const sortedData = [...loanPurposeData].sort((a, b) => b.count - a.count);
    
    if (chartType === 'simplifiedPie') {
      // Group small categories
      const mainCategories: LoanPurposeCount[] = [];
      let otherTotal = 0;
      
      sortedData.forEach(item => {
        if (item.count >= groupThreshold) {
          mainCategories.push(item);
        } else {
          otherTotal += item.count;
        }
      });
      
      if (otherTotal > 0) {
        mainCategories.push({ purpose: "Other Purposes", count: otherTotal });
      }
      
      return mainCategories;
    }
    
    return sortedData;
  }, [loanPurposeData, groupThreshold, chartType]);

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

  // Chart colors for loan purpose
  const loanPurposeColors = [
    "rgba(255, 99, 132, 0.8)",  // Red
    "rgba(54, 162, 235, 0.8)",  // Blue
    "rgba(255, 206, 86, 0.8)",  // Yellow
    "rgba(75, 192, 192, 0.8)",  // Teal
    "rgba(153, 102, 255, 0.8)", // Purple
    "rgba(255, 159, 64, 0.8)",  // Orange
    "rgba(199, 199, 199, 0.8)", // Gray
    "rgba(83, 215, 105, 0.8)",  // Green
    "rgba(240, 98, 146, 0.8)",  // Bright Pink
    "rgba(149, 117, 205, 0.8)", // Medium Purple
    "rgba(121, 134, 203, 0.8)",  // Medium Indigo
  ];

  const loanPurposeBorderColors = loanPurposeColors.map(color => 
    color.replace("0.8", "1")
  );

  // Calculate total for percentages
  const total = loanPurposeData.reduce((sum, item) => sum + item.count, 0);

  const loanPurposeChartData: ChartData<"pie", number[], string> = {
    labels: processedLoanPurposeData
      .map((d) => d.purpose)
      .filter((_, i) => i < loanPurposeVisibility.length ? loanPurposeVisibility[i] : true),
    datasets: [
      {
        data: processedLoanPurposeData
          .map((d) => d.count)
          .filter((_, i) => i < loanPurposeVisibility.length ? loanPurposeVisibility[i] : true),
        backgroundColor: loanPurposeColors.slice(0, processedLoanPurposeData.length).filter(
          (_, i) => i < loanPurposeVisibility.length ? loanPurposeVisibility[i] : true
        ),
        borderColor: loanPurposeBorderColors.slice(0, processedLoanPurposeData.length).filter(
          (_, i) => i < loanPurposeVisibility.length ? loanPurposeVisibility[i] : true
        ),
        borderWidth: 1,
      },
    ],
  };

  // Bar chart data
  const loanPurposeBarChartData: ChartData<"bar", number[], string> = {
    labels: processedLoanPurposeData.map(item => item.purpose),
    datasets: [
      {
        label: 'Number of Loans',
        data: processedLoanPurposeData.map(item => item.count),
        backgroundColor: loanPurposeColors.slice(0, processedLoanPurposeData.length),
        borderColor: loanPurposeBorderColors.slice(0, processedLoanPurposeData.length),
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
            return `${label}: ${value.toFixed(1)} (${percentage}%)`;
          },
        },
      },
      datalabels: {
        formatter: (value: number, context: any) => {
          const total = context.dataset.data.reduce((acc: number, val: number) => acc + val, 0);
          const percentage = ((value / total) * 100).toFixed(1);
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

  // Improved pie chart options
  const improvedPieOptions: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 20
    },
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 15,
          padding: 15,
          font: {
            size: 12
          },
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels && data.datasets.length) {
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i] as number;
                const percentage = ((value / total) * 100).toFixed(1);
                
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: Array.isArray(data.datasets[0].backgroundColor) 
    ? data.datasets[0].backgroundColor[i] || '#000' 
    : (data.datasets[0].backgroundColor || '#000'),
  strokeStyle: Array.isArray(data.datasets[0].borderColor) 
    ? data.datasets[0].borderColor[i] || '#000' 
    : (data.datasets[0].borderColor || '#000'),
  lineWidth: 1,
  hidden: false,
  index: i
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"pie">) => {
            const label = context.label || "";
            const value = Number(context.raw);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
      datalabels: {
        formatter: (value: number, context: any) => {
          const percentage = ((value / total) * 100).toFixed(1);
          return `${value}\n(${percentage}%)`;
        },
        color: '#000',
        font: {
          weight: 'bold',
          size: 11,
        },
        textAlign: 'center',
        textStrokeColor: '#fff',
        textStrokeWidth: 2,
        textShadowBlur: 5,
        textShadowColor: 'rgba(255, 255, 255, 0.7)',
      },
    },
  };

  // Bar chart options
  const barOptions: ChartOptions<"bar"> = {
    indexAxis: 'y', // Horizontal bar chart
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 10,
        right: 25,
        bottom: 10,
        left: 10
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Loans',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      y: {
        ticks: {
          callback: function(value) {
            // Shorten label if too long
            const label = this.getLabelForValue(value as number);
            if (label && label.length > 25) {
              return label.substr(0, 22) + '...';
            }
            return label;
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"bar">) => {
            const value = Number(context.raw);
            const percentage = ((value / total) * 100).toFixed(1);
            return `Count: ${value} (${percentage}%)`;
          },
        },
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        formatter: (value: number) => {
          const percentage = ((value / total) * 100).toFixed(1);
          return `${value} (${percentage}%)`;
        },
        color: '#000',
        font: {
          weight: 'bold',
          size: 11,
        },
      },
    },
  };

  // Loan purpose chart options with count display
  const loanPurposeChartOptions: ChartOptions<"pie"> = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      datalabels: {
        ...(chartOptions.plugins?.datalabels as any),
        formatter: (value: number, context: any) => {
          const total = context.dataset.data.reduce((acc: number, val: number) => acc + val, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${value} (${percentage}%)`;
        },
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

  const toggleLoanPurposeVisibility = (index: number) => {
    setLoanPurposeVisibility((prev) => {
      const newVisibility = [...prev];
      newVisibility[index] = !newVisibility[index];
      return newVisibility;
    });
  };

  // Toggle all loan purpose checkboxes
  const [selectAll, setSelectAll] = useState(true);
  
  const handleSelectAll = () => {
    const newValue = !selectAll;
    setSelectAll(newValue);
    setLoanPurposeVisibility(new Array(loanPurposeData.length).fill(newValue));
  };

  const wipColors = [
    "rgba(255, 99, 132, 0.6)", 
    "rgba(54, 162, 235, 0.6)", 
     "rgba(255, 206, 86, 0.6)",
    "rgba(75, 192, 192, 0.6)", 
    "rgba(153, 102, 255, 0.6)",
  ];

  const hlLapColors = [
    "rgba(54, 162, 235, 0.6)", 
    "rgba(255, 206, 86, 0.6)", 
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Pie Chart Page</h1>
      <div className="grid grid-cols-1">
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* WIP Pie Chart */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex flex-wrap gap-4 mb-4">
              {wipSubcategories.map((item, index) => (
                <label
                  key={index}
                  className="flex items-center"
                  style={{
                    textDecoration: "underline",
                    textDecorationColor: wipColors[index],
                    textDecorationThickness: "4px", 
                    textUnderlineOffset: "3px", 
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
                    textDecorationThickness: "4px",
                    textUnderlineOffset: "3px",
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
        <div className="grid justify-center">
          {/* Loan Purpose Chart */}
          <div className="bg-white rounded-lg p-4 w-full max-w-4xl">
            {isCustomerDataLoading ? (
              <div className="h-64 flex items-center justify-center">
                <p>Loading loan purpose data...</p>
              </div>
            ) : customerDataError ? (
              <div className="h-64 w-full flex items-center justify-center text-red-500">
                <p>Error loading loan purpose data: {customerDataError}</p>
              </div>
            ) : (
              <>
                {/* Chart Controls */}
                <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
                  <div className="space-x-4">
                    <label className="font-medium">Chart Type:</label>
                    <select 
                      value={chartType} 
                      onChange={(e) => setChartType(e.target.value as 'pie' | 'simplifiedPie')}
                      className="border rounded px-3 py-1"
                    >
                      <option value="simplifiedPie">Simplified Pie</option>
                      <option value="pie">Detailed Pie</option>
                    </select>
                  </div>
                  
                  {chartType === 'simplifiedPie' && (
                    <div className="space-x-2">
                      <label className="font-medium">Minimum group size:</label>
                      <select 
                        value={groupThreshold} 
                        onChange={(e) => setGroupThreshold(Number(e.target.value))}
                        className="border rounded px-3 py-1"
                      >
                        <option value="2">2+ loans</option>
                        <option value="5">5+ loans</option>
                        <option value="10">10+ loans</option>
                        <option value="15">15+ loans</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Chart Display */}
                <div className="h-80">
                  {chartType === 'pie' && <Pie data={loanPurposeChartData} options={loanPurposeChartOptions} />}
                  {chartType === 'simplifiedPie' && <Pie data={loanPurposeChartData} options={improvedPieOptions} />}
                  {chartType === 'bar' && <Bar data={loanPurposeBarChartData} options={barOptions} />}
                </div>

                {/* Only show checkboxes for detailed pie */}
                {chartType === 'pie' && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                          className="mr-2"
                        />
                        <span className="font-medium">Select All</span>
                      </label>
                      {loanPurposeData.map((item, index) => (
                        <label
                          key={index}
                          className="flex items-center"
                          style={{
                            textDecoration: "underline",
                            textDecorationColor: loanPurposeColors[index % loanPurposeColors.length],
                            textDecorationThickness: "4px",
                            textUnderlineOffset: "3px",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={loanPurposeVisibility[index]}
                            onChange={() => toggleLoanPurposeVisibility(index)}
                            className="mr-2"
                          />
                          {item.purpose}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
            <h2 className="text-xl font-semibold mt-4 text-center">Loan Purpose Distribution</h2>
          </div>
        </div>
      </div>
    </div>
  );
}