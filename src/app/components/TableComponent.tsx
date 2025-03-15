"use client";
import React, { useCallback, useState } from "react";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import HoverCard from "./HoverCard";
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
}

const DelhiSubpartsPopup = ({ isOpen, onClose, regions, totals }: DelhiSubpartsPopupProps) => {
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set());
  
  const toggleRegion = (regionId: string) => {
    setExpandedRegions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(regionId)) {
        newSet.delete(regionId);
      } else {
        newSet.add(regionId);
      }
      return newSet;
    });
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 backdrop-blur-sm  flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-5xl w-full max-h-[85vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Delhi Regional Breakdown</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[70vh]">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-200 text-left sticky top-0 z-10">
              <tr>
                <th className="py-2 px-4 border-b">Region/Branch</th>
                <th className="py-2 px-4 border-b">Opening Stock</th>
                <th className="py-2 px-4 border-b">Application Login</th>
                <th className="py-2 px-4 border-b">Sanction Count</th>
                <th className="py-2 px-4 border-b">Sanction Amt (Cr)</th>
                <th className="py-2 px-4 border-b">PNI Sanction Count</th>
                <th className="py-2 px-4 border-b">Rejection</th>
                <th className="py-2 px-4 border-b">Cancellation</th>
                <th className="py-2 px-4 border-b">WIP</th>
              </tr>
            </thead> 
            <tbody>
              {regions.map((region) => (
                <React.Fragment key={region.id}>
                  {/* Region Row */}
                  <tr 
                    className="cursor-pointer bg-blue-50 hover:bg-blue-100"
                    onClick={() => toggleRegion(region.id)}
                  >
                    <td className="py-2 px-4 border-b font-medium flex items-center">
                      {region.name}
                      {region.branches && region.branches.length > 0 && (
                        expandedRegions.has(region.id) ? (
                          <ChevronDown className="ml-2 h-4 w-4" />
                        ) : (
                          <ChevronRight className="ml-2 h-4 w-4" />
                        )
                      )}
                    </td>
                    <td className="py-2 px-4 border-b font-medium">{region.openingStock}</td>
                    <td className="py-2 px-4 border-b font-medium">{region.applicationLogin}</td>
                    <td className="py-2 px-4 border-b font-medium">{region.sanctionCount}</td>
                    <td className="py-2 px-4 border-b font-medium">{region.sanctionAmt.toFixed(2)}</td>
                    <td className="py-2 px-4 border-b font-medium">{region.pniSanctionCount}</td>
                    <td className="py-2 px-4 border-b font-medium">{region.rejection}</td>
                    <td className="py-2 px-4 border-b font-medium">{region.cancellation}</td>
                    <td className="py-2 px-4 border-b font-medium">{region.wip}</td>
                  </tr>
                  
                  {/* Branch Rows */}
                  {expandedRegions.has(region.id) && region.branches.map((branch) => (
                    <tr key={branch.id} className="bg-white hover:bg-gray-50">
                      <td className="py-2 px-4 border-b pl-8">{branch.name}</td>
                      <td className="py-2 px-4 border-b">{branch.openingStock}</td>
                      <td className="py-2 px-4 border-b">{branch.applicationLogin}</td>
                      <td className="py-2 px-4 border-b">{branch.sanctionCount}</td>
                      <td className="py-2 px-4 border-b">{branch.sanctionAmt.toFixed(2)}</td>
                      <td className="py-2 px-4 border-b">{branch.pniSanctionCount}</td>
                      <td className="py-2 px-4 border-b">{branch.rejection}</td>
                      <td className="py-2 px-4 border-b">{branch.cancellation}</td>
                      <td className="py-2 px-4 border-b">{branch.wip}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
            <tfoot className="bg-gray-100 sticky bottom-0">
              <tr>
                <td className="py-2 px-4 border-b font-bold">Total</td>
                <td className="py-2 px-4 border-b font-bold">{totals.openingStock}</td>
                <td className="py-2 px-4 border-b font-bold">{totals.applicationLogin}</td>
                <td className="py-2 px-4 border-b font-bold">{totals.sanctionCount}</td>
                <td className="py-2 px-4 border-b font-bold">{totals.sanctionAmt.toFixed(2)}</td>
                <td className="py-2 px-4 border-b font-bold">{totals.pniSanctionCount}</td>
                <td className="py-2 px-4 border-b font-bold">{totals.rejection}</td>
                <td className="py-2 px-4 border-b font-bold">{totals.cancellation}</td>
                <td className="py-2 px-4 border-b font-bold">{totals.wip}</td>
              </tr>
            </tfoot>
          </table>
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
}: TableComponentProps) => {
  // Add state for Delhi popup
  const [showDelhiPopup, setShowDelhiPopup] = useState(false);
  
  // Find Delhi state and extract its data
  const delhiState = data.tableData.find(
    state => state.name.toLowerCase().includes("delhi") || 
             (state.originalStateName && state.originalStateName.toLowerCase().includes("delhi"))
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
      wip: delhiState?.wip || 0
    }
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
  };

  const getLighterColor = (color: string, level: number) => {
    const [, r, g, b, a] = color.match(/rgba\((\d+), (\d+), (\d+), ([\d.]+)\)/) || [];
    const newAlpha = Math.max(0, parseFloat(a) - 0.2 * level);
    return `rgba(${r}, ${g}, ${b}, ${newAlpha.toFixed(1)})`;
  };

  const getHoverColor = (color: string) => {
    const [, r, g, b, a] = color.match(/rgba\((\d+), (\d+), (\d+), ([\d.]+)\)/) || [];
    const newAlpha = Math.min(1, parseFloat(a) + 0.1);
    return `rgba(${r}, ${g}, ${b}, ${newAlpha.toFixed(1)})`;
  };

  const getStateColor = (state: State) => {
    const stateName = state.originalStateName || state.name;
    const baseColor = stateColorMap[stateName.split(" ")[0]] ||
      stateColorMap[state.name] || { bg: "rgba(0, 0, 0, 0)", hover: "rgba(0, 0, 0, 0.1)" };
    return {
      bg: baseColor.bg,
      hover: baseColor.hover,
    };
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="py-2 px-4 border-b">State/Branch</th>
            <th className="py-2 px-4 border-b">Opening Stock</th>
            <th className="py-2 px-4 border-b">Application Login</th>
            <th className="py-2 px-4 border-b">Sanction Count</th>
            <th className="py-2 px-4 border-b">Sanction Amt (Cr)</th>
            <th className="py-2 px-4 border-b">PNI Sanction Count</th>
            <th className="py-2 px-4 border-b">Rejection</th>
            <th className="py-2 px-4 border-b">Cancellation</th>
            <th className="py-2 px-4 border-b">WIP</th>
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
                  {!state.isBranch && state.regions && state.regions.length > 0 && (
                    expandedStates.has(state.id) ? (
                      <ChevronDown className="ml-2 h-4 w-4" />
                    ) : (
                      <ChevronRight className="ml-2 h-4 w-4" />
                    )
                  )}
                </td>
                <td 
                  className={`py-2 px-4 border-b ${
                    state.name.toLowerCase().includes("delhi") ? 
                    "cursor-pointer transition-colors" : ""
                  }`} 
                  onClick={(e) => 
                    state.name.toLowerCase().includes("delhi") ? 
                    handleDelhiStockClick(e) : undefined
                  }
                  title={state.name.toLowerCase().includes("delhi") ? 
                    "Click to view Delhi regional breakdown" : undefined}
                  data-column="openingStock"
                >
                  {state.openingStock}
                </td>
                <td className="py-2 px-4 border-b">{state.applicationLogin}</td>
                <td className="py-2 px-4 border-b">{state.sanctionCount}</td>
                <td className="py-2 px-4 border-b">{state.sanctionAmt.toFixed(2)}</td>
                <td className="py-2 px-4 border-b">{state.pniSanctionCount}</td>
                <td className="py-2 px-4 border-b">{state.rejection}</td>
                <td className="py-2 px-4 border-b">{state.cancellation}</td>
                <td className="py-2 px-4 border-b">{state.wip}</td>
              </tr>
              {expandedStates.has(state.id) &&
                state.regions.map((region) => (
                  <React.Fragment key={region.id}>
                    <tr
                      className="cursor-pointer"
                      style={{
                        backgroundColor: getLighterColor(getStateColor(state).bg, 1),
                      }}
                      onMouseEnter={(e) =>
                        e.currentTarget.style.setProperty(
                          "background-color",
                          getHoverColor(getLighterColor(getStateColor(state).bg, 1))
                        )
                      }
                      onMouseLeave={(e) =>
                        e.currentTarget.style.setProperty(
                          "background-color",
                          getLighterColor(getStateColor(state).bg, 1)
                        )
                      }
                      onClick={() => !region.isBranch && toggleRegion(region.id)}
                    >
                      <td className="py-2 px-4 border-b pl-8 flex items-center">
                        {region.name}{" "}
                        {!region.isBranch && region.branches && region.branches.length > 0 && (
                          expandedRegions.has(region.id) ? (
                            <ChevronDown className="ml-2 h-4 w-4" />
                          ) : (
                            <ChevronRight className="ml-2 h-4 w-4" />
                          )
                        )}
                      </td>
                      <td className="py-2 px-4 border-b">{region.openingStock}</td>
                      <td className="py-2 px-4 border-b">{region.applicationLogin}</td>
                      <td className="py-2 px-4 border-b">{region.sanctionCount}</td>
                      <td className="py-2 px-4 border-b">{region.sanctionAmt.toFixed(2)}</td>
                      <td className="py-2 px-4 border-b">{region.pniSanctionCount}</td>
                      <td className="py-2 px-4 border-b">{region.rejection}</td>
                      <td className="py-2 px-4 border-b">{region.cancellation}</td>
                      <td className="py-2 px-4 border-b">{region.wip}</td>
                    </tr>
                    {expandedRegions.has(region.id) &&
                      region.branches.map((branch) => (
                        <tr
                          key={branch.id}
                          className="cursor-pointer"
                          style={{
                            backgroundColor: getLighterColor(getLighterColor(getStateColor(state).bg, 1), 1),
                          }}
                          onMouseEnter={(e) =>
                            e.currentTarget.style.setProperty(
                              "background-color",
                              getHoverColor(
                                getLighterColor(getLighterColor(getStateColor(state).bg, 1), 1)
                              )
                            )
                          }
                          onMouseLeave={(e) =>
                            e.currentTarget.style.setProperty(
                              "background-color",
                              getLighterColor(getLighterColor(getStateColor(state).bg, 1), 1)
                            )
                          }
                        >
                          <td className="py-2 px-4 border-b pl-16">{branch.name}</td>
                          <td className="py-2 px-4 border-b">{branch.openingStock}</td>
                          <td className="py-2 px-4 border-b">{branch.applicationLogin}</td>
                          <td className="py-2 px-4 border-b">{branch.sanctionCount}</td>
                          <td className="py-2 px-4 border-b">{branch.sanctionAmt.toFixed(2)}</td>
                          <td className="py-2 px-4 border-b">{branch.pniSanctionCount}</td>
                          <td className="py-2 px-4 border-b">{branch.rejection}</td>
                          <td className="py-2 px-4 border-b">{branch.cancellation}</td>
                          <td className="py-2 px-4 border-b">{branch.wip}</td>
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
      />
    </div>
  );
};

export default TableComponent;