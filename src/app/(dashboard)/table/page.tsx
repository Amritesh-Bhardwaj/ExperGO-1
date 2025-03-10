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

  const handleClearFilters = () => {
    setSelectedState("");
    setSelectedRegion("");
    setSelectedBranch("");
  };

  const states = tableData.tableData.map((state) => ({
    id: state.id,
    name: state.name,
  }));

  const allRegions = useMemo(() => {
    return tableData.tableData.flatMap((state) =>
      state.regions.map((region) => ({
        id: region.id,
        name: region.name,
        stateId: state.id,
      }))
    );
  }, []);

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

  const handleStateChange = (stateId: string) => {
    setSelectedState(stateId);
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

  const handleRegionChange = (regionId: string) => {
    setSelectedRegion(regionId);
    if (regionId) {
      const region = allRegions.find((r) => r.id === regionId);
      if (region) {
        setSelectedState(region.stateId);
      }
    } else if (!selectedBranch) {
      setSelectedState("");
    }
    if (selectedBranch) {
      const branch = allBranches.find((b) => b.id === selectedBranch);
      if (branch && branch.regionId !== regionId) {
        setSelectedBranch("");
      }
    }
  };

  const handleBranchChange = (branchId: string) => {
    setSelectedBranch(branchId);
    if (branchId) {
      const branch = allBranches.find((b) => b.id === branchId);
      if (branch) {
        setSelectedState(branch.stateId);
        setSelectedRegion(branch.regionId);
      }
    } else if (!selectedRegion) {
      setSelectedRegion("");
      if (!selectedState) {
        setSelectedState("");
      }
    }
  };

  const regions = useMemo(() => {
    if (selectedState) {
      return allRegions.filter((region) => region.stateId === selectedState);
    }
    return allRegions;
  }, [selectedState, allRegions]);

  const branches = useMemo(() => {
    if (selectedRegion) {
      return allBranches.filter((branch) => branch.regionId === selectedRegion);
    }
    if (selectedState) {
      return allBranches.filter((branch) => branch.stateId === selectedState);
    }
    return allBranches;
  }, [selectedState, selectedRegion, allBranches]);

  const filteredData: TableData = useMemo(() => {
    if (selectedBranch) {
      const branchInfo = allBranches.find((b) => b.id === selectedBranch);
      if (branchInfo) {
        const state = tableData.tableData.find((s) => s.id === branchInfo.stateId);
        const region = state?.regions.find((r) => r.id === branchInfo.regionId);
        const selectedBranchData = region?.branches.find((b) => b.id === selectedBranch);
        if (state && region && selectedBranchData) {
          const fakeState: State = {
            ...state,
            id: selectedBranchData.id,
            name: selectedBranchData.name,
            regions: [],
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
            originalStateName: state.name,
          };
          return { tableData: [fakeState] };
        }
      }
      return { tableData: [] };
    }

    if (selectedRegion) {
      const regionInfo = allRegions.find((r) => r.id === selectedRegion);
      if (regionInfo) {
        const state = tableData.tableData.find((s) => s.id === regionInfo.stateId);
        const selectedRegionData = state?.regions.find((r) => r.id === selectedRegion);
        if (state && selectedRegionData) {
          const fakeState: State = {
            ...state,
            id: selectedRegionData.id,
            name: selectedRegionData.name,
            regions: selectedRegionData.branches.map((branch) => ({
              ...branch,
              branches: [],
            })),
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
            originalStateName: state.name,
          };
          return { tableData: [fakeState] };
        }
      }
      return { tableData: [] };
    }

    if (selectedState) {
      const filtered = tableData.tableData.filter((state) => state.id === selectedState);
      return { tableData: filtered };
    }

    return { tableData: tableData.tableData };
  }, [selectedState, selectedRegion, selectedBranch]);

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
              className="bg-blue-100 text-blue-600 font-medium px-4 py-2 rounded hover:bg-blue-200 cursor-pointer"
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
              className="bg-blue-100 text-blue-600 font-medium px-4 py-2 rounded hover:bg-blue-200 cursor-pointer"
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
              className="bg-blue-100 text-blue-600 font-medium px-4 py-2 rounded hover:bg-blue-200 cursor-pointer"
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
