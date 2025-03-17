"use client";
import React, { useCallback, useMemo, useState } from "react";
import { ChevronDown, ChevronRight, X } from "lucide-react";
// import HoverCard from "./HoverCard";

export interface LoanApplication {
  "Application Number": string;
  "Customer Name": string;
  "Branch Name": string;
  State: string;
  "Application Received Date": string;
  "Last Login Acceptance Date": string;
  PRODUCT: string;
  SCHEME: string;
  "Loan Purpose": string;
  "Loan Amount Requested": string;
  "Application Status": string;
  "Sanctioned Amount": string;
  "User Sanction Date": string;
  "First Disbursal Date": string;
  "Sourcing RM Name": string;
}

export interface Branch {
  id: string;
  name: string;
  openingStock: number;
  applicationLogin: number;
  sanctionCount: number;
  sanctionAmt: number;
  pniSanctionCount: number;
  pniSanctionAmount: number;
  freshDisbCount: number;
  freshDisbAmt: number;
  totalDisbAmt: number;
  diAmt: number;
  rejection: number;
  cancellation: number;
  ftr: number;
  pendingForAllocationByCPA: number;
  wipCPA: number;
  salesTrayLoginAcceptance: number;
  creditPendingDDERecoStage: number;
  salesTrayDDERECO: number;
  wip: number;
}

export interface Region {
  id: string;
  name: string;
  openingStock: number;
  applicationLogin: number;
  sanctionCount: number;
  sanctionAmt: number;
  pniSanctionCount: number;
  pniSanctionAmount: number;
  freshDisbCount: number;
  freshDisbAmt: number;
  totalDisbAmt: number;
  diAmt: number;
  rejection: number;
  cancellation: number;
  ftr: number;
  pendingForAllocationByCPA: number;
  wipCPA: number;
  salesTrayLoginAcceptance: number;
  creditPendingDDERecoStage: number;
  salesTrayDDERECO: number;
  wip: number;
  branches: Branch[];
  isBranch?: boolean;
}

export interface State {
  id: string;
  name: string;
  openingStock: number;
  applicationLogin: number;
  sanctionCount: number;
  sanctionAmt: number;
  pniSanctionCount: number;
  pniSanctionAmount: number;
  freshDisbCount: number;
  freshDisbAmt: number;
  totalDisbAmt: number;
  diAmt: number;
  rejection: number;
  cancellation: number;
  ftr: number;
  pendingForAllocationByCPA: number;
  wipCPA: number;
  salesTrayLoginAcceptance: number;
  creditPendingDDERecoStage: number;
  salesTrayDDERECO: number;
  wip: number;
  regions: Region[];
  originalStateName?: string;
  isBranch?: boolean;
}

export interface TableData {
  tableData: State[];
}

export interface TableComponentProps {
  data: TableData;
  expandedStates: Set<string>;
  setExpandedStates: React.Dispatch<React.SetStateAction<Set<string>>>;
  expandedRegions: Set<string>;
  setExpandedRegions: React.Dispatch<React.SetStateAction<Set<string>>>;
  csvData: LoanApplication[];
}

// New Delhi Regions and Branches Popup Component
interface DelhiSubpartsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  regions: Region[];
  totals: {
    openingStock: number;
    applicationLogin: number;
    sanctionCount: number;
    sanctionAmt: number;
    pniSanctionCount: number;
    rejection: number;
    cancellation: number;
    wip: number;
  };
  csvData: LoanApplication[];
}

const DelhiSubpartsPopup = ({
  isOpen,
  onClose,
  regions,
  totals,
  csvData,
}: DelhiSubpartsPopupProps) => {
  const [selectedApplication, setSelectedApplication] =
    useState<LoanApplication | null>(null);
  const allApplications = useMemo(() => {
    const apps: Array<{
      regionName: string;
      branchName: string;
      application: LoanApplication;
    }> = [];

    regions.forEach((region) => {
      region.branches.forEach((branch) => {
        const branchApps = csvData.filter(
          (app) => app["Branch Name"] === branch.name
        );
        branchApps.forEach((app) => {
          apps.push({
            regionName: region.name,
            branchName: branch.name,
            application: app,
          });
        });
      });
    });

    return apps;
  }, [regions, csvData]);

  console.log("All application > ", allApplications);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-5xl w-full max-h-[85vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Delhi Loan Applications</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* View details as a separate section */}
        {selectedApplication && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold">Application Details</h3>
              <button
                onClick={() => setSelectedApplication(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <table className="min-w-full bg-white border border-gray-300">
              <thead className="bg-gray-200 text-center">
                <tr>
                  <th className="py-2 px-4 border-b">Field</th>
                  <th className="py-2 px-4 border-b">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="py-2 px-4 border-b">Application Number</td>
                  <td className="py-2 px-4 border-b">
                    {selectedApplication["Application Number"]}
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-2 px-4 border-b">Customer</td>
                  <td className="py-2 px-4 border-b">
                    {selectedApplication["Customer Name"]}
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="py-2 px-4 border-b">Received Date</td>
                  <td className="py-2 px-4 border-b">
                    {selectedApplication["Application Received Date"]}
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-2 px-4 border-b">Last Login Date</td>
                  <td className="py-2 px-4 border-b">
                    {selectedApplication["Last Login Acceptance Date"]}
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="py-2 px-4 border-b">Product</td>
                  <td className="py-2 px-4 border-b">
                    {selectedApplication.PRODUCT}
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-2 px-4 border-b">Scheme</td>
                  <td className="py-2 px-4 border-b">
                    {selectedApplication.SCHEME}
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="py-2 px-4 border-b">Purpose</td>
                  <td className="py-2 px-4 border-b">
                    {selectedApplication["Loan Purpose"]}
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-2 px-4 border-b">Amount</td>
                  <td className="py-2 px-4 border-b">
                    ₹{selectedApplication["Loan Amount Requested"]}
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="py-2 px-4 border-b">Status</td>
                  <td className="py-2 px-4 border-b">
                    {selectedApplication["Application Status"]}
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-2 px-4 border-b">Sanctioned Amount</td>
                  <td className="py-2 px-4 border-b">
                    ₹{selectedApplication["Sanctioned Amount"]}
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="py-2 px-4 border-b">RM</td>
                  <td className="py-2 px-4 border-b">
                    {selectedApplication["Sourcing RM Name"]}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <div className="p-4">
          <div className="overflow-y-auto max-h-[70vh] rounded-lg shadow-sm border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 text-center sticky top-0 z-10">
                <tr>
                  <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Region
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Branch
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Received
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Scheme
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purpose
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sanctioned
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sanction Date
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Disbursal Date
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    RM Name
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {allApplications.length > 0 ? (
                  allApplications.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {item.regionName}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {item.branchName}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {item.application["Customer Name"]}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        ₹{item.application["Loan Amount Requested"]}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {item.application.PRODUCT}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.application["Application Status"] ===
                            "Approved"
                              ? "bg-green-100 text-green-800"
                              : item.application["Application Status"] ===
                                "Rejected"
                              ? "bg-red-100 text-red-800"
                              : item.application["Application Status"] ===
                                "Pending"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {item.application["Application Status"]}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {item.application["Application Received Date"]}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {item.application["Last Login Acceptance Date"]}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {item.application.SCHEME}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {item.application["Loan Purpose"]}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        ₹{item.application["Sanctioned Amount"]}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {item.application["User Sanction Date"]}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {item.application["First Disbursal Date"]}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {item.application["Sourcing RM Name"]}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={14}
                      className="py-6 px-4 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center">
                        <svg
                          className="w-8 h-8 text-gray-300 mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <p>No applications found for Delhi region</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const TableComponent = ({
  data,
  expandedStates,
  setExpandedStates,
  expandedRegions,
  setExpandedRegions,
  csvData,
}: TableComponentProps) => {
  const [showDelhiPopup, setShowDelhiPopup] = useState(false);
  const [showWorkflowColumns, setShowWorkflowColumns] = useState(false);

  const countFilteredApplications = (
    name: string,
    type: "state" | "region" | "branch"
  ) => {
    // For Delhi entities, count from CSV data
    if (name.toLowerCase().includes("delhi")) {
      if (!csvData.length) return 0;
      
      return csvData.filter((item) => {
        if (type === "state") {
          return item.State.toLowerCase().includes("delhi");
        } else if (type === "region") {
          return item["Branch Name"].toLowerCase().includes(name.toLowerCase());
        } else if (type === "branch") {
          return item["Branch Name"].toLowerCase() === name.toLowerCase();
        }
        return false;
      }).length;
    }
    
    // For non-Delhi entities, use static values from tableData
    if (type === "state") {
      const stateData = data.tableData.find(
        (s) => s.name.toLowerCase() === name.toLowerCase()
      );
      return stateData ? stateData.openingStock : 0;
    } else if (type === "region") {
      for (const state of data.tableData) {
        const region = state.regions.find(
          (r) => r.name.toLowerCase() === name.toLowerCase()
        );
        if (region) return region.openingStock;
      }
    } else if (type === "branch") {
      for (const state of data.tableData) {
        for (const region of state.regions) {
          const branch = region.branches.find(
            (b) => b.name.toLowerCase() === name.toLowerCase()
          );
          if (branch) return branch.openingStock;
        }
      }
    }
    
    return 0;
  };
  
  console.log("Data > ", data.tableData);
  const delhiState = data.tableData.find(
    (state) =>
      state.name.toLowerCase().includes("delhi") ||
      (state.originalStateName &&
        state.originalStateName.toLowerCase().includes("delhi"))
  );

  // Get Delhi regions and totals for the popup
  const delhiData = {
    regions: delhiState?.regions || [],
    totals: {
      openingStock: delhiState?.openingStock || 0,
      applicationLogin: delhiState?.applicationLogin || 0,
      sanctionCount: delhiState?.sanctionCount || 0,
      sanctionAmt: delhiState?.sanctionAmt || 0,
      pniSanctionCount: delhiState?.pniSanctionCount || 0,
      rejection: delhiState?.rejection || 0,
      cancellation: delhiState?.cancellation || 0,
      wip: delhiState?.wip || 0,
    },
  };

  const toggleState = useCallback(
    (stateId: string) => {
      setExpandedStates((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(stateId)) {
          newSet.delete(stateId);
          data.tableData
            .find((state) => state.id === stateId)
            ?.regions.forEach((region) => newSet.delete(region.id));
        } else {
          newSet.add(stateId);
        }
        return newSet;
      });
    },
    [setExpandedStates, data.tableData]
  );

  const toggleRegion = useCallback(
    (regionId: string) => {
      setExpandedRegions((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(regionId)) {
          newSet.delete(regionId);
        } else {
          newSet.add(regionId);
        }
        return newSet;
      });
    },
    [setExpandedRegions]
  );

  // Toggle function for collapsing rows
  const toggleWorkflowColumns = () => {
    setShowWorkflowColumns(!showWorkflowColumns);
  };

  // Handler for Delhi Opening Stock click
  const handleDelhiStockClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the row expand/collapse
    setShowDelhiPopup(true);
  };

  const stateColorMap: { [key: string]: { bg: string; hover: string } } = {
    Delhi: {
      bg: "rgba(255, 99, 132, 0.6)",
      hover: "rgba(255, 99, 132, 0.7)",
    },
    Gujarat: {
      bg: "rgba(54, 162, 235, 0.6)",
      hover: "rgba(54, 162, 235, 0.7)",
    },
    Haryana: {
      bg: "rgba(255, 206, 86, 0.6)",
      hover: "rgba(255, 206, 86, 0.7)",
    },
    Maharashtra: {
      bg: "rgba(75, 192, 192, 0.6)",
      hover: "rgba(75, 192, 192, 0.7)",
    },
    "Madhya Pradesh": {
      bg: "rgba(153, 102, 255, 0.6)",
      hover: "rgba(153, 102, 255, 0.7)",
    },
    Rajasthan: {
      bg: "rgba(255, 159, 64, 0.6)",
      hover: "rgba(255, 159, 64, 0.7)",
    },
    "Uttar Pradesh": {
      bg: "rgba(199, 199, 199, 0.6)",
      hover: "rgba(199, 199, 199, 0.7)",
    },
    Uttarakhand: {
      bg: "rgba(180, 140, 100, 0.6)",
      hover: "rgba(180, 140, 100, 0.7)",
    },
  };

  const getLighterColor = (color: string, level: number) => {
    const [, r, g, b, a] =
      color.match(/rgba\((\d+), (\d+), (\d+), ([\d.]+)\)/) || [];
    const newAlpha = Math.max(0, parseFloat(a) - 0.2 * level);
    return `rgba(${r}, ${g}, ${b}, ${newAlpha.toFixed(1)})`;
  };

  const getHoverColor = (color: string) => {
    const [, r, g, b, a] =
      color.match(/rgba\((\d+), (\d+), (\d+), ([\d.]+)\)/) || [];
    const newAlpha = Math.min(1, parseFloat(a) + 0.1);
    return `rgba(${r}, ${g}, ${b}, ${newAlpha.toFixed(1)})`;
  };

  const getStateColor = (state: State) => {
    const stateName = state.originalStateName || state.name;
    const baseColor = stateColorMap[stateName.split(" ")[0]] ||
      stateColorMap[state.name] || {
        bg: "rgba(0, 0, 0, 0)",
        hover: "rgba(0, 0, 0, 0.1)",
      };
    return {
      bg: baseColor.bg,
      hover: baseColor.hover,
    };
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-center">
            <th className="py-2 px-4 border-b">Branch Name</th>
            <th className="py-2 px-4 border-b">Opening Stock</th>
            <th className="py-2 px-4 border-b">Application Login</th>
            <th className="py-2 px-4 border-b">Sanction Count</th>
            <th className="py-2 px-4 border-b">Sanction Amt (in Cr)</th>
            <th className="py-2 px-4 border-b">PNI Sanction Count</th>
            <th className="py-2 px-4 border-b">PNI Sanction Amount (in Cr)</th>
            <th className="py-2 px-4 border-b">Fresh Disb Count</th>
            <th className="py-2 px-4 border-b">Fresh Disb Amt (in Cr.)</th>
            <th className="py-2 px-4 border-b">Total Disb Amt (in Cr)</th>
            <th className="py-2 px-4 border-b">DI Amt (in Cr)</th>
            <th className="py-2 px-4 border-b">Rejection</th>
            <th className="py-2 px-4 border-b">Cancellation</th>
            <th className="py-2 px-4 border-b">FTR%</th>
            <th
              className="py-2 px-4 border-b cursor-pointer hover:bg-gray-300 relative"
              onClick={toggleWorkflowColumns}
              title={
                showWorkflowColumns
                  ? "Click to hide workflow details"
                  : "Click to show workflow details"
              }
            >
              WIP
              <span className="ml-1 text-blue-600">
                {showWorkflowColumns ? "▼" : "▶"}
              </span>
            </th>
            {showWorkflowColumns && (
              <>
                <th className="py-2 px-4 border-b bg-blue-50">
                  Pending for allocation by CPA
                </th>
                <th className="py-2 px-4 border-b bg-blue-50">WIP-CPA</th>
                <th className="py-2 px-4 border-b bg-blue-50">
                  Sales Tray (Login Acceptance)
                </th>
                <th className="py-2 px-4 border-b bg-blue-50">
                  Credit Pending (DDE & Reco Stage)
                </th>
                <th className="py-2 px-4 border-b bg-blue-50">
                  Sales Tray (DDE & RECO)
                </th>
              </>
            )}
          </tr>
        </thead>

        <tbody>
          {data.tableData.map((state) => (
            <React.Fragment key={state.id}>
              <tr
                className="cursor-pointer"
                style={{
                  backgroundColor:
                    state.name === "Grand Total"
                      ? "#000000" // Black background for Grand Total
                      : getLighterColor(getStateColor(state).bg, 0),
                  color: state.name === "Grand Total" ? "#FFFFFF" : "inherit", // White text for Grand Total
                  fontWeight: state.name === "Grand Total" ? "bold" : "normal", // Bold font for Grand Total
                }}
                onMouseEnter={(e) =>
                  state.name !== "Grand Total" &&
                  e.currentTarget.style.setProperty(
                    "background-color",
                    getHoverColor(getLighterColor(getStateColor(state).bg, 0))
                  )
                }
                onMouseLeave={(e) =>
                  e.currentTarget.style.setProperty(
                    "background-color",
                    state.name === "Grand Total"
                      ? "#000000" // Maintain black on mouse leave
                      : getLighterColor(getStateColor(state).bg, 0)
                  )
                }
                onClick={() => !state.isBranch && toggleState(state.id)}
                data-state-id={state.id}
                data-state-name={state.name}
              >
                <td className="py-2 px-4 border-b flex items-center">
                  {state.name}{" "}
                  {!state.isBranch &&
                    state.regions &&
                    state.regions.length > 0 &&
                    (expandedStates.has(state.id) ? (
                      <ChevronDown className="ml-2 h-4 w-4" />
                    ) : (
                      <ChevronRight className="ml-2 h-4 w-4" />
                    ))}
                </td>
                <td
                  className={`py-2 px-4 border-b ${
                    state.name.toLowerCase().includes("delhi")
                      ? "cursor-pointer transition-colors"
                      : ""
                  }`}
                  onClick={(e) =>
                    state.name.toLowerCase().includes("delhi")
                      ? handleDelhiStockClick(e)
                      : undefined
                  }
                  title={
                    state.name.toLowerCase().includes("delhi")
                      ? "Click to view Delhi regional breakdown"
                      : undefined
                  }
                  data-column="openingStock"
                >
                  {countFilteredApplications(state.name, "state")}
                </td>
                <td className="py-2 px-4 border-b">{state.applicationLogin}</td>
                <td className="py-2 px-4 border-b">{state.sanctionCount}</td>
                <td className="py-2 px-4 border-b">
                  {state.sanctionAmt.toFixed(2)}
                </td>
                <td className="py-2 px-4 border-b">{state.pniSanctionCount}</td>
                <td className="py-2 px-4 border-b">
                  {state.pniSanctionAmount?.toFixed(2) || "0.00"}
                </td>
                <td className="py-2 px-4 border-b">
                  {state.freshDisbCount || 0}
                </td>
                <td className="py-2 px-4 border-b">
                  {state.freshDisbAmt?.toFixed(2) || "0.00"}
                </td>
                <td className="py-2 px-4 border-b">
                  {state.totalDisbAmt?.toFixed(2) || "0.00"}
                </td>
                <td className="py-2 px-4 border-b">
                  {state.diAmt?.toFixed(2) || "0.00"}
                </td>
                <td className="py-2 px-4 border-b">{state.rejection}</td>
                <td className="py-2 px-4 border-b">{state.cancellation}</td>
                <td className="py-2 px-4 border-b">{state.ftr}</td>
                <td className="py-2 px-4 border-b">{state.wip}</td>
                {/* Conditionally render workflow columns */}
                {showWorkflowColumns && (
                  <>
                    <td className="py-2 px-4 border-b">
                      {state.pendingForAllocationByCPA}
                    </td>
                    <td className="py-2 px-4 border-b ">{state.wipCPA}</td>
                    <td className="py-2 px-4 border-b ">
                      {state.salesTrayLoginAcceptance}
                    </td>
                    <td className="py-2 px-4 border-b ">
                      {state.creditPendingDDERecoStage}
                    </td>
                    <td className="py-2 px-4 border-b ">
                      {state.salesTrayDDERECO}
                    </td>
                  </>
                )}
              </tr>
              {expandedStates.has(state.id) &&
                state.regions.map((region) => (
                  <React.Fragment key={region.id}>
                    <tr
                      className="cursor-pointer"
                      style={{
                        backgroundColor: getLighterColor(
                          getStateColor(state).bg,
                          1
                        ),
                      }}
                      onMouseEnter={(e) =>
                        e.currentTarget.style.setProperty(
                          "background-color",
                          getHoverColor(
                            getLighterColor(getStateColor(state).bg, 1)
                          )
                        )
                      }
                      onMouseLeave={(e) =>
                        e.currentTarget.style.setProperty(
                          "background-color",
                          getLighterColor(getStateColor(state).bg, 1)
                        )
                      }
                      onClick={() =>
                        !region.isBranch && toggleRegion(region.id)
                      }
                    >
                      <td className="py-2 px-4 border-b pl-8 flex items-center">
                        {region.name}{" "}
                        {!region.isBranch &&
                          region.branches &&
                          region.branches.length > 0 &&
                          (expandedRegions.has(region.id) ? (
                            <ChevronDown className="ml-2 h-4 w-4" />
                          ) : (
                            <ChevronRight className="ml-2 h-4 w-4" />
                          ))}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {countFilteredApplications(region.name, "region")}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {region.applicationLogin}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {region.sanctionCount}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {region.sanctionAmt.toFixed(2)}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {region.pniSanctionCount}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {region.pniSanctionAmount?.toFixed(2) || "0.00"}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {region.freshDisbCount || 0}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {region.freshDisbAmt?.toFixed(2) || "0.00"}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {region.totalDisbAmt?.toFixed(2) || "0.00"}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {region.diAmt?.toFixed(2) || "0.00"}
                      </td>
                      <td className="py-2 px-4 border-b">{region.rejection}</td>
                      <td className="py-2 px-4 border-b">
                        {region.cancellation}
                      </td>
                      <td className="py-2 px-4 border-b">{region.ftr}</td>
                      <td className="py-2 px-4 border-b">{region.wip}</td>
                      {/* Conditionally render workflow columns for regions */}
                      {showWorkflowColumns && (
                        <>
                          <td className="py-2 px-4 border-b ">
                            {region.pendingForAllocationByCPA}
                          </td>
                          <td className="py-2 px-4 border-b ">
                            {region.wipCPA}
                          </td>
                          <td className="py-2 px-4 border-b ">
                            {region.salesTrayLoginAcceptance}
                          </td>
                          <td className="py-2 px-4 border-b ">
                            {region.creditPendingDDERecoStage}
                          </td>
                          <td className="py-2 px-4 border-b ">
                            {region.salesTrayDDERECO}
                          </td>
                        </>
                      )}
                    </tr>
                    {expandedRegions.has(region.id) &&
                      region.branches.map((branch) => (
                        <tr
                          key={branch.id}
                          className="cursor-pointer"
                          style={{
                            backgroundColor: getLighterColor(
                              getLighterColor(getStateColor(state).bg, 1),
                              1
                            ),
                          }}
                          onMouseEnter={(e) =>
                            e.currentTarget.style.setProperty(
                              "background-color",
                              getHoverColor(
                                getLighterColor(
                                  getLighterColor(getStateColor(state).bg, 1),
                                  1
                                )
                              )
                            )
                          }
                          onMouseLeave={(e) =>
                            e.currentTarget.style.setProperty(
                              "background-color",
                              getLighterColor(
                                getLighterColor(getStateColor(state).bg, 1),
                                1
                              )
                            )
                          }
                        >
                          <td className="py-2 px-4 border-b pl-16">
                            {branch.name}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {countFilteredApplications(branch.name, "branch")}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {branch.applicationLogin}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {branch.sanctionCount}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {branch.sanctionAmt.toFixed(2)}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {branch.pniSanctionCount}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {branch.pniSanctionAmount?.toFixed(2) || "0.00"}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {branch.freshDisbCount || 0}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {branch.freshDisbAmt?.toFixed(2) || "0.00"}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {branch.totalDisbAmt?.toFixed(2) || "0.00"}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {branch.diAmt?.toFixed(2) || "0.00"}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {branch.rejection}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {branch.cancellation}
                          </td>
                          <td className="py-2 px-4 border-b">{branch.ftr}</td>
                          <td className="py-2 px-4 border-b">{branch.wip}</td>
                          {/* Conditionally render workflow columns for branches */}
                          {showWorkflowColumns && (
                            <>
                              <td className="py-2 px-4 border-b">
                                {branch.pendingForAllocationByCPA}
                              </td>
                              <td className="py-2 px-4 border-b">
                                {branch.wipCPA}
                              </td>
                              <td className="py-2 px-4 border-b">
                                {branch.salesTrayLoginAcceptance}
                              </td>
                              <td className="py-2 px-4 border-b">
                                {branch.creditPendingDDERecoStage}
                              </td>
                              <td className="py-2 px-4 border-b">
                                {branch.salesTrayDDERECO}
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                  </React.Fragment>
                ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Delhi Regions & Branches Popup */}
      <DelhiSubpartsPopup
        isOpen={showDelhiPopup}
        onClose={() => setShowDelhiPopup(false)}
        regions={delhiData.regions}
        totals={delhiData.totals}
        csvData={csvData}
      />
    </div>
  );
};

export default TableComponent;
