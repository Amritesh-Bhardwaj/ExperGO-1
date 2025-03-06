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
    // If a region is selected and doesn't belong to the new state, reset it
    if (selectedRegion) {
      const region = allRegions.find((r) => r.id === selectedRegion);
      if (region && region.stateId !== stateId) {
        setSelectedRegion("");
        setSelectedBranch("");
      }
    }
    // If a branch is selected and doesn't belong to the new state, reset it
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
    // If a branch is selected and doesn't belong to the new region, reset it
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
    let filtered = tableData.tableData;

    // Filter by state
    if (selectedState) {
      filtered = filtered.filter((state) => state.id === selectedState);
    }

    // Filter regions within the filtered states
    if (selectedRegion && filtered.length > 0) {
      filtered = filtered.map((state) => ({
        ...state,
        regions: state.regions.filter((region) => region.id === selectedRegion),
      })).filter((state) => state.regions.length > 0);
    }

    // Filter branches within the filtered regions
    if (selectedBranch && filtered.length > 0) {
      filtered = filtered.map((state) => ({
        ...state,
        regions: state.regions.map((region) => ({
          ...region,
          branches: region.branches.filter((branch) => branch.id === selectedBranch),
        })).filter((region) => region.branches.length > 0),
      })).filter((state) => state.regions.length > 0);
    }

    return { tableData: filtered };
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