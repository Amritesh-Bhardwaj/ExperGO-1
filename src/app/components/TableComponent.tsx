"use client";

import React, { useCallback, useMemo, useState, useEffect } from "react";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import HoverCard from "./HoverCard";

export interface LoanApplication {
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
  csvData: LoanApplication[];
  selectedULBRange?: string;
}

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

const DelhiSubpartsPopup = ({ isOpen, onClose, regions, totals, csvData }: DelhiSubpartsPopupProps) => {
  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);
  const allApplications = useMemo(() => {
    const apps: Array<{
      regionName: string;
      branchName: string;
      application: LoanApplication;
    }> = [];
    
    regions.forEach(region => {
      region.branches.forEach(branch => {
        const branchApps = csvData.filter(app => app["Branch Name"] === branch.name);
        branchApps.forEach(app => {
          apps.push({
            regionName: region.name,
            branchName: branch.name,
            application: app
          });
        });
      });
    });
    
    return apps;
  }, [regions, csvData]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-5xl w-full max-h-[85vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Delhi Loan Applications</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* Application Details Popup */}
        {selectedApplication && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold">Application Details</h3>
              <button onClick={() => setSelectedApplication(null)} className="text-gray-500 hover:text-gray-700">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><span className="font-medium">Customer:</span> {selectedApplication["Customer Name"]}</p>
                <p><span className="font-medium">Product:</span> {selectedApplication.PRODUCT}</p>
                <p><span className="font-medium">Purpose:</span> {selectedApplication["Loan Purpose"]}</p>
              </div>
              <div>
                <p><span className="font-medium">Amount:</span> ₹{selectedApplication["Loan Amount Requested"]}</p>
                <p><span className="font-medium">Status:</span> {selectedApplication["Application Status"]}</p>
                <p><span className="font-medium">RM:</span> {selectedApplication["Sourcing RM Name"]}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="overflow-y-auto max-h-[70vh]">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-200 text-left sticky top-0 z-10">
              <tr>
                <th className="py-2 px-4 border-b">Region</th>
                <th className="py-2 px-4 border-b">Branch</th>
                <th className="py-2 px-4 border-b">Customer Name</th>
                <th className="py-2 px-4 border-b">Loan Amount</th>
                <th className="py-2 px-4 border-b">Product</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allApplications.length > 0 ? (
                allApplications.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="py-2 px-4 border-b">{item.regionName}</td>
                    <td className="py-2 px-4 border-b">{item.branchName}</td>
                    <td className="py-2 px-4 border-b">{item.application["Customer Name"]}</td>
                    <td className="py-2 px-4 border-b">₹{item.application["Loan Amount Requested"]}</td>
                    <td className="py-2 px-4 border-b">{item.application.PRODUCT}</td>
                    <td className="py-2 px-4 border-b">
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.application["Application Status"] === "Approved" ? "bg-green-100 text-green-800" :
                        item.application["Application Status"] === "Rejection" ? "bg-red-100 text-red-800" :
                        item.application["Application Status"] === "Pending" ? "bg-yellow-100 text-yellow-800" :
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {item.application["Application Status"]}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <button 
                        onClick={() => setSelectedApplication(item.application)}
                        className="bg-blue-100 text-blue-600 hover:bg-blue-200 py-1 px-2 rounded text-xs"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-4 px-4 text-center text-gray-500">
                    No applications found for Delhi region
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {allApplications.length > 0 && (
            <div className="mt-4 text-right text-sm text-gray-600">
              Showing {allApplications.length} applications from {regions.length} regions
            </div>
          )}
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
  selectedULBRange
}: TableComponentProps) => {
  // Add state for Delhi popup
  const [showDelhiPopup, setShowDelhiPopup] = useState(false);
  const [modifiedData, setModifiedData] = useState<TableData>(data);
  
  useEffect(() => {
    const newData = JSON.parse(JSON.stringify(data));
    
    const delhiStateIndex = newData.tableData.findIndex(
      state => state.name.toLowerCase().includes("delhi") || 
               (state.originalStateName && state.originalStateName.toLowerCase().includes("delhi"))
    );
    
    if (delhiStateIndex >= 0) {
      const delhiApplications = csvData.filter(app => 
        app.State.toLowerCase().includes("delhi")
      );
      
      newData.tableData[delhiStateIndex].openingStock = delhiApplications.length;
      
      newData.tableData[delhiStateIndex].regions.forEach(region => {
        const regionApps = delhiApplications.filter(app => 
          app["Branch Name"].toLowerCase().includes(region.name.toLowerCase())
        );
        region.openingStock = regionApps.length;
        
        region.branches.forEach(branch => {
          const branchApps = delhiApplications.filter(app => 
            app["Branch Name"] === branch.name
          );
          branch.openingStock = branchApps.length;
        });
      });
    }
    
    setModifiedData(newData);
  }, [data, csvData, selectedULBRange]);
  
  const delhiState = modifiedData.tableData.find(
    state => state.name.toLowerCase().includes("delhi") || 
             (state.originalStateName && state.originalStateName.toLowerCase().includes("delhi"))
  );
  
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
          modifiedData.tableData
            .find((state) => state.id === stateId)
            ?.regions.forEach((region) => newSet.delete(region.id));
        } else {
          newSet.add(stateId);
        }
        return newSet;
      });
    },
    [setExpandedStates, modifiedData.tableData]
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

  const handleDelhiStockClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
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
          {modifiedData.tableData.map((state) => (
            <React.Fragment key={state.id}>
              <tr
                className="cursor-pointer"
                style={{
                  backgroundColor:
                    state.name === "Grand Total"
                      ? "#000000" 
                      : getLighterColor(getStateColor(state).bg, 0),
                  color: state.name === "Grand Total" ? "#FFFFFF" : "inherit", 
                  fontWeight: state.name === "Grand Total" ? "bold" : "normal", 
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
                      ? "#000000" 
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
                    "cursor-pointer transition-colors " : ""
                  }`} 
                  onClick={(e) => 
                    state.name.toLowerCase().includes("delhi") ? 
                    handleDelhiStockClick(e) : undefined
                  }
                  title={state.name.toLowerCase().includes("delhi") ? 
                    "Click to view Delhi regional breakdown" : undefined}
                  data-column="openingStock"
                >
                  {state.name.toLowerCase().includes("delhi") ? (
                    <div className="flex items-center">
                      <span className="font-medium">{state.openingStock}</span>
                      {/* {selectedULBRange && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-1 py-0.5 rounded">
                          Filtered
                        </span>
                      )} */}
                    </div>
                  ) : (
                    state.openingStock
                  )}
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
        csvData={csvData}
      />
    </div>
  );
};

export default TableComponent;