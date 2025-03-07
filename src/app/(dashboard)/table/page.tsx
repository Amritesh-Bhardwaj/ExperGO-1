"use client";

import { useState, useMemo } from "react";
import TableComponent from "@/app/components/TableComponent";
import tableData from "@/app/data/tableData.json";
import { TableData, State, Region, Branch } from "@/app/components/TableComponent";

export default function TablePage() {
  const [expandedStates, setExpandedStates] = useState<Set<string>>(new Set());
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set());
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("");

  const handleExpandAll = () => {
    const allStateIds = new Set(
      filteredData.tableData.map((state) => state.id)
    );
    const allRegionIds = new Set(
      filteredData.tableData.flatMap((state) =>
        state.regions.map((region) => region.id)
      )
    );
    setExpandedStates(allStateIds);
    setExpandedRegions(allRegionIds);
  };

  const handleCollapseAll = () => {
    setExpandedStates(new Set());
    setExpandedRegions(new Set());
  };

  // Function to clear all filters
  const handleClearFilters = () => {
    setSelectedState("");
    setSelectedRegion("");
    setSelectedBranch("");
  };

  // Get all unique states
  const states = tableData.tableData.map((state) => ({
    id: state.id,
    name: state.name,
  }));

  // Get all unique regions (with their parent state)
  const allRegions = useMemo(() => {
    return tableData.tableData.flatMap((state) =>
      state.regions.map((region) => ({
        id: region.id,
        name: region.name,
        stateId: state.id,
      }))
    );
  }, []);

  // Get all unique branches (with their parent region and state)
  const allBranches = useMemo(() => {
    return tableData.tableData.flatMap((state) =>
      state.regions.flatMap((region) =>
        region.branches.map((branch) => ({
          id: branch.id,
          name: branch.name,
          regionId: region.id,
          stateId: state.id,
        }))
      )
    );
  }, []);

  // Handle state selection
  const handleStateChange = (stateId: string) => {
    setSelectedState(stateId);
    // Reset region and branch if they don't belong to the new state
    if (selectedRegion) {
      const region = allRegions.find((r) => r.id === selectedRegion);
      if (region && region.stateId !== stateId) {
        setSelectedRegion("");
        setSelectedBranch("");
      }
    }
    if (selectedBranch) {
      const branch = allBranches.find((b) => b.id === selectedBranch);
      if (branch && branch.stateId !== stateId) {
        setSelectedBranch("");
      }
    }
  };

  // Handle region selection
  const handleRegionChange = (regionId: string) => {
    setSelectedRegion(regionId);
    // Automatically set the state if a region is selected
    if (regionId) {
      const region = allRegions.find((r) => r.id === regionId);
      if (region) {
        setSelectedState(region.stateId);
      }
    } else if (!selectedBranch) {
      // Clear state only if no branch is selected
      setSelectedState("");
    }
    // Reset branch if it doesn't belong to the new region
    if (selectedBranch) {
      const branch = allBranches.find((b) => b.id === selectedBranch);
      if (branch && branch.regionId !== regionId) {
        setSelectedBranch("");
      }
    }
  };

  // Handle branch selection
  const handleBranchChange = (branchId: string) => {
    setSelectedBranch(branchId);
    // Automatically set the state and region if a branch is selected
    if (branchId) {
      const branch = allBranches.find((b) => b.id === branchId);
      if (branch) {
        setSelectedState(branch.stateId);
        setSelectedRegion(branch.regionId);
      }
    } else if (!selectedRegion) {
      // Clear region and state only if no region is selected
      setSelectedRegion("");
      if (!selectedState) {
        setSelectedState("");
      }
    }
  };

  // Filter regions based on selected state (if any)
  const regions = useMemo(() => {
    if (selectedState) {
      return allRegions.filter((region) => region.stateId === selectedState);
    }
    return allRegions;
  }, [selectedState, allRegions]);

  // Filter branches based on selected region or state
  const branches = useMemo(() => {
    if (selectedRegion) {
      return allBranches.filter((branch) => branch.regionId === selectedRegion);
    }
    if (selectedState) {
      return allBranches.filter((branch) => branch.stateId === selectedState);
    }
    return allBranches;
  }, [selectedState, selectedRegion, allBranches]);

  // Filter the data based on selected state, region, and branch
  const filteredData: TableData = useMemo(() => {
    // Case 1: If a branch is selected, show only that branch as a top-level row
    if (selectedBranch) {
      const branchInfo = allBranches.find((b) => b.id === selectedBranch);
      if (branchInfo) {
        const state = tableData.tableData.find((s) => s.id === branchInfo.stateId);
        const region = state?.regions.find((r) => r.id === branchInfo.regionId);
        const selectedBranchData = region?.branches.find((b) => b.id === selectedBranch);
        if (state && region && selectedBranchData) {
          // Create a fake state with the branch promoted to the top level
          const fakeState: State = {
            ...state,
            id: selectedBranchData.id,
            name: selectedBranchData.name, // Show branch name as top-level row
            regions: [], // No regions, since this is a branch
            openingStock: selectedBranchData.openingStock,
            applicationLogin: selectedBranchData.applicationLogin,
            sanctionCount: selectedBranchData.sanctionCount,
            sanctionAmt: selectedBranchData.sanctionAmt,
            pniSanctionCount: selectedBranchData.pniSanctionCount,
            pniSanctionAmount: selectedBranchData.pniSanctionAmount,
            freshDisbCount: selectedBranchData.freshDisbCount,
            freshDisbAmt: selectedBranchData.freshDisbAmt,
            totalDisbAmt: selectedBranchData.totalDisbAmt,
            diAmt: selectedBranchData.diAmt,
            rejection: selectedBranchData.rejection,
            cancellation: selectedBranchData.cancellation,
            wip: selectedBranchData.wip,
            // Add the original state name to preserve color mapping
            originalStateName: state.name,
          };
          return { tableData: [fakeState] };
        }
      }
      return { tableData: [] };
    }

    // Case 2: If a region is selected (but no branch), show only that region as a top-level row
    if (selectedRegion) {
      const regionInfo = allRegions.find((r) => r.id === selectedRegion);
      if (regionInfo) {
        const state = tableData.tableData.find((s) => s.id === regionInfo.stateId);
        const selectedRegionData = state?.regions.find((r) => r.id === selectedRegion);
        if (state && selectedRegionData) {
          // Create a fake state with the region promoted to the top level
          const fakeState: State = {
            ...state,
            id: selectedRegionData.id,
            name: selectedRegionData.name, // Show region name as top-level row
            regions: selectedRegionData.branches.map((branch) => ({
              ...branch,
              branches: [], // Ensure no further nesting
            })), // Directly use branches as regions
            openingStock: selectedRegionData.openingStock,
            applicationLogin: selectedRegionData.applicationLogin,
            sanctionCount: selectedRegionData.sanctionCount,
            sanctionAmt: selectedRegionData.sanctionAmt,
            pniSanctionCount: selectedRegionData.pniSanctionCount,
            pniSanctionAmount: selectedRegionData.pniSanctionAmount,
            freshDisbCount: selectedRegionData.freshDisbCount,
            freshDisbAmt: selectedRegionData.freshDisbAmt,
            totalDisbAmt: selectedRegionData.totalDisbAmt,
            diAmt: selectedRegionData.diAmt,
            rejection: selectedRegionData.rejection,
            cancellation: selectedRegionData.cancellation,
            wip: selectedRegionData.wip,
            // Add the original state name to preserve color mapping
            originalStateName: state.name,
          };
          return { tableData: [fakeState] };
        }
      }
      return { tableData: [] };
    }

    // Case 3: If a state is selected (but no region or branch), show the state with all its regions
    if (selectedState) {
      const filtered = tableData.tableData.filter((state) => state.id === selectedState);
      return { tableData: filtered };
    }

    // Case 4: If nothing is selected, show all data
    return { tableData: tableData.tableData };
  }, [selectedState, selectedRegion, selectedBranch]);

  // Determine if the clear button should be visible
  const isFilterApplied = selectedState || selectedRegion || selectedBranch;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold">Table Page</h1>
          <div>
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="border rounded px-2 py-2"
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={selectedRegion}
              onChange={(e) => handleRegionChange(e.target.value)}
              className="border rounded px-2 py-2"
            >
              <option value="">Select Region</option>
              {regions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={selectedBranch}
              onChange={(e) => handleBranchChange(e.target.value)}
              className="border rounded px-2 py-2"
            >
              <option value="">Select Branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
          {isFilterApplied && (
            <button
              onClick={handleClearFilters}
              className="bg-blue-100 text-blue-600 font-medium px-4 py-2 rounded hover:bg-blue-200 cursor-pointer"
            >
              Clear Filters
            </button>
          )}
        </div>
        <div>
          <button
            className="bg-blue-100 text-blue-600 font-medium px-4 py-2 rounded mr-2 hover:bg-blue-200 cursor-pointer"
            onClick={handleExpandAll}
          >
            Expand All
          </button>
          <button
            className="bg-blue-100 text-blue-600 font-medium px-4 py-2 rounded hover:bg-blue-200 cursor-pointer"
            onClick={handleCollapseAll}
          >
            Collapse All
          </button>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <TableComponent
          data={filteredData}
          expandedStates={expandedStates}
          setExpandedStates={setExpandedStates}
          expandedRegions={expandedRegions}
          setExpandedRegions={setExpandedRegions}
        />
      </div>
    </div>
  );
}
