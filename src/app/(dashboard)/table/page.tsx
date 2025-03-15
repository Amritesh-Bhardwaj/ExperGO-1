"use client";

import { useState, useMemo, useEffect, ChangeEvent } from "react";
import TableComponent from "@/app/components/TableComponent";
import tableData from "@/app/data/tableData.json";
import HoverCard from "@/app/components/HoverCard";

interface LoanApplication {
  "Customer Name": string;
  "Loan Amount Requested": string;
  "Application Status": string;
  "Branch Name": string;
  PRODUCT: string;
  State: string;
}

interface ULBRange {
  id: string;
  name: string;
  min: number;
  max: number;
}

interface FilterDropdownProps {
  label: string;
  value: string;
  options: { id: string; name: string }[];
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

interface ApplicationCountCardProps {
  count: number;
  items: LoanApplication[];
  title: string;
}

const ULB_RANGES: ULBRange[] = [
  { id: "range1", name: "₹0 - ₹5 Lakhs", min: 0, max: 500000 },
  { id: "range2", name: "₹5 Lakhs - ₹10 Lakhs", min: 500001, max: 1000000 },
  { id: "range3", name: "₹10 Lakhs - ₹20 Lakhs", min: 1000001, max: 2000000 },
  { id: "range4", name: "₹20 Lakhs+", min: 2000001, max: Infinity },
];

const FilterDropdown = ({ label, value, options, onChange }: FilterDropdownProps) => (
  <select
    value={value}
    onChange={onChange}
    className="bg-blue-100 text-blue-600 font-medium px-4 py-2 rounded hover:bg-blue-200 cursor-pointer"
  >
    <option value="">{label}</option>
    {options.map((option) => (
      <option key={option.id} value={option.id}>
        {option.name}
      </option>
    ))}
  </select>
);

const ApplicationCountCard = ({ count, items, title }: ApplicationCountCardProps) => (
  <HoverCard
    trigger={
      <div className="text-2xl font-medium text-blue-600 cursor-pointer">
        {count} Applications
      </div>
    }
    content={
      <div className="p-2">
        <h3 className="font-bold border-b pb-2 mb-2">{title}</h3>
        {items.map((item, index) => (
          <div key={index} className="py-2 border-b border-gray-100 last:border-0">
            <p className="font-medium">{item["Customer Name"]}</p>
            <div className="grid grid-cols-2 text-sm gap-1">
              <span className="text-gray-600">Amount:</span>
              <span>₹{item["Loan Amount Requested"]}</span>
              <span className="text-gray-600">Product:</span>
              <span>{item.PRODUCT}</span>
              <span className="text-gray-600">Status:</span>
              <span>{item["Application Status"]}</span>
            </div>
          </div>
        ))}
      </div>
    }
  />
);

export default function TablePage() {
  const [csvData, setCsvData] = useState<LoanApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedState, setSelectedState] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedULBRange, setSelectedULBRange] = useState("");
  const [expandedStates, setExpandedStates] = useState<Set<string>>(new Set());
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set());

  // Load CSV data
  useEffect(() => {
    const loadCsvData = async () => {
      try {
        const response = await fetch("/status.csv");
        const text = await response.text();
        const [headerLine, ...dataLines] = text.split("\n");
        const headers = headerLine.split(",").map(h => h.trim());

        const parsedData = dataLines
          .filter(line => line.trim())
          .map(line => {
            const values = line.split(",");
            return headers.reduce((obj, header, index) => ({
              ...obj,
              [header]: values[index]?.trim() || ""
            }), {} as LoanApplication);
          });

        setCsvData(parsedData);
      } catch (error) {
        console.error("Error loading CSV data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCsvData();
  }, []);

  // Auto-expand when selecting branch
  useEffect(() => {
    if (selectedBranch) {
      const branch = allBranches.find(b => b.id === selectedBranch);
      if (branch) {
        setExpandedStates(new Set([branch.stateId]));
        setExpandedRegions(new Set([branch.regionId]));
      }
    }
  }, [selectedBranch]);

  // Get all branches
  const allBranches = useMemo(() => 
    tableData.tableData.flatMap(state =>
      state.regions.flatMap(region =>
        region.branches.map(branch => ({
          id: branch.id,
          name: branch.name,
          regionId: region.id,
          stateId: state.id,
        }))
      )
    ),
    []
  );

  // Filter loan data
  const filteredLoanData = useMemo(() => {
    if (!csvData.length) return [];

    const stateFilter = selectedState.replace(/Regional Office/g, "").trim();
    const activeRange = ULB_RANGES.find(r => r.id === selectedULBRange);

    return csvData.filter(item => {
      const amount = Number(item["Loan Amount Requested"]);
      const branchMatch = selectedBranch ? item["Branch Name"] === selectedBranch : true;
      const rangeMatch = activeRange ? amount >= activeRange.min && amount <= activeRange.max : true;
      
      return (
        (!selectedState || item.State.includes(stateFilter)) &&
        (!selectedRegion || item["Branch Name"].includes(selectedRegion)) &&
        branchMatch &&
        rangeMatch
      );
    });
  }, [csvData, selectedState, selectedRegion, selectedBranch, selectedULBRange]);

  // Filter table data for branch selection
  const filteredTableData = useMemo(() => {
    if (!selectedBranch) return tableData;

    return {
      tableData: tableData.tableData
        .map(state => ({
          ...state,
          regions: state.regions
            .map(region => ({
              ...region,
              branches: region.branches.filter(branch => branch.id === selectedBranch)
            }))
            .filter(region => region.branches.length > 0)
        }))
        .filter(state => state.regions.length > 0)
    };
  }, [selectedBranch]);

  // Status breakdown
  const statusBreakdown = useMemo(() => 
    filteredLoanData.reduce((acc, item) => {
      const status = item["Application Status"];
      acc[status] = [...(acc[status] || []), item];
      return acc;
    }, {} as Record<string, LoanApplication[]>),
  [filteredLoanData]);

  // Clear filters
  const handleClearFilters = () => {
    setSelectedState("");
    setSelectedRegion("");
    setSelectedBranch("");
    setSelectedULBRange("");
    setExpandedStates(new Set());
    setExpandedRegions(new Set());
  };

  const isFilterApplied = [selectedState, selectedRegion, selectedBranch, selectedULBRange]
    .some(value => Boolean(value));

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Loan Applications Dashboard</h1>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <FilterDropdown
          label="Select State"
          value={selectedState}
          options={tableData.tableData.map(s => ({ id: s.id, name: s.name }))}
          onChange={(e) => setSelectedState(e.target.value)}
        />

        <FilterDropdown
          label="Select Region"
          value={selectedRegion}
          options={tableData.tableData.flatMap(s => 
            s.regions.map(r => ({ id: r.id, name: r.name }))
          )}
          onChange={(e) => setSelectedRegion(e.target.value)}
        />

        <FilterDropdown
          label="Select Branch"
          value={selectedBranch}
          options={allBranches.map(b => ({ id: b.id, name: b.name }))}
          onChange={(e) => setSelectedBranch(e.target.value)}
        />

        <FilterDropdown
          label="Loan Amount Range"
          value={selectedULBRange}
          options={ULB_RANGES}
          onChange={(e) => setSelectedULBRange(e.target.value)}
        />

        {isFilterApplied && (
          <button
            onClick={handleClearFilters}
            className="bg-red-100 text-red-600 font-medium px-4 py-2 rounded hover:bg-red-200"
          > 
            Clear Filters 
          </button> 
        )} 
      </div> 

      {/* Data Display */}
      {isLoading ? (
        <div className="text-center py-4">Loading loan data...</div>
      ) : (
        <>
          {/* Status Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {Object.entries(statusBreakdown).map(([status, items]) => (
              <div key={status} className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-bold text-gray-700">{status}</h3>
                <ApplicationCountCard
                  count={items.length}
                  items={items}
                  title={`${status} Applications`}
                />
              </div>
            ))}
          </div>

          {/* Main Table */}
          <div className="bg-white p-6 rounded-lg shadow">
            <TableComponent
              data={filteredTableData}
              expandedStates={expandedStates}
              setExpandedStates={setExpandedStates}
              expandedRegions={expandedRegions}
              setExpandedRegions={setExpandedRegions}
            />
          </div>
        </>
      )}
    </div>
  );
}

