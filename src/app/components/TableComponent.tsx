"use client";

import React, { useCallback } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

// Define and export the interfaces
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

const TableComponent = ({
  data,
  expandedStates,
  setExpandedStates,
  expandedRegions,
  setExpandedRegions,
}: TableComponentProps) => {
  const toggleState = useCallback(
    (stateId: string) => {
      setExpandedStates((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(stateId)) {
          newSet.delete(stateId);
          // Reset regions when collapsing a state
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
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => toggleState(state.id)}
              >
                <td className="py-2 px-4 border-b flex items-center">
                  {state.name}{" "}
                  {expandedStates.has(state.id) ? (
                    <ChevronDown className="ml-2 h-4 w-4" />
                  ) : (
                    <ChevronRight className="ml-2 h-4 w-4" />
                  )}
                </td>
                <td className="py-2 px-4 border-b">{state.openingStock}</td>
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
                      className="cursor-pointer hover:bg-gray-100"
                      onClick={() => toggleRegion(region.id)}
                    >
                      <td className="py-2 px-4 border-b pl-8 flex items-center">
                        {region.name}{" "}
                        {expandedRegions.has(region.id) ? (
                          <ChevronDown className="ml-2 h-4 w-4" />
                        ) : (
                          <ChevronRight className="ml-2 h-4 w-4" />
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
                        <tr key={branch.id} className="hover:bg-gray-100">
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
    </div>
  );
};

export default TableComponent;
