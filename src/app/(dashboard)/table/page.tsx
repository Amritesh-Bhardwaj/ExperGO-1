"use client";

import { useState, useMemo, useEffect, ChangeEvent } from "react";
import TableComponent from "@/app/components/TableComponent";
import tableData from "@/app/data/tableData.json";
// import HoverCard from "@/app/components/HoverCard";

interface LoanApplication {
  "Customer Name": string;
  "Loan Amount Requested": string;
  "Application Status": string;
  "Branch Name": string;
  PRODUCT: string;
  State: string;
  "Application Number": string;
  "Application Received Date": string;
  "Last Login Acceptance Date": string;
  "SCHEME": string;
  "Loan Purpose": string;
  "Sanctioned Amount": string;
  "User Sanction Date": string;
  "First Disbursal Date": string;
  "Sourcing RM Name": string;
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

export default function TablePage() {
  const [csvData, setCsvData] = useState<LoanApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedState, setSelectedState] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedULBRange, setSelectedULBRange] = useState("");
  const [expandedStates, setExpandedStates] = useState<Set<string>>(new Set());
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set());
  const [dynamicTableData, setDynamicTableData] = useState(tableData);

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
        setCsvData([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCsvData();
  }, []);

  useEffect(() => {
    if (selectedBranch) {
      const branch = allBranches.find(b => b.id === selectedBranch);
      if (branch) {
        setExpandedStates(new Set([branch.stateId]));
        setExpandedRegions(new Set([branch.regionId]));
      }
    }
  }, [selectedBranch]);

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

  useEffect(() => {
    const newTableData = JSON.parse(JSON.stringify(tableData));
    
    const delhiStateIndex = newTableData.tableData.findIndex(
      state => state.name.toLowerCase().includes("delhi")
    );
    
    if (delhiStateIndex >= 0) {
      const delhiApplications = filteredLoanData.filter(app => 
        app.State.toLowerCase().includes("delhi")
      );
      
      newTableData.tableData[delhiStateIndex].openingStock = delhiApplications.length;
      
      newTableData.tableData[delhiStateIndex].regions.forEach(region => {
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
      
      if (delhiApplications.length > 0) {
        const rejectionCount = delhiApplications.filter(app => 
          app["Application Status"] === "Rejection"
        ).length;
        
        const cancellationCount = delhiApplications.filter(app => 
          app["Application Status"] === "Cancellation"
        ).length;
        
        const sanctionCount = delhiApplications.filter(app => 
          app["Application Status"] === "Approved" || 
          app["Application Status"] === "Disbursal"
        ).length;
        
        newTableData.tableData[delhiStateIndex].rejection = rejectionCount;
        newTableData.tableData[delhiStateIndex].cancellation = cancellationCount;
        newTableData.tableData[delhiStateIndex].sanctionCount = sanctionCount;
        
        newTableData.tableData[delhiStateIndex].wip = 
          delhiApplications.length - (rejectionCount + cancellationCount + sanctionCount);
      }
    }
    
    const grandTotalIndex = newTableData.tableData.findIndex(
      state => state.name === "Grand Total"
    );
    
    if (grandTotalIndex >= 0) {
      const totalOpeningStock = newTableData.tableData
        .filter(state => state.name !== "Grand Total")
        .reduce((sum, state) => sum + state.openingStock, 0);
        
      newTableData.tableData[grandTotalIndex].openingStock = totalOpeningStock;
      
    }
    
    setDynamicTableData(newTableData);
  }, [filteredLoanData]);

  const filteredTableData = useMemo(() => {
    if (!selectedBranch) return dynamicTableData;

    return {
      tableData: dynamicTableData.tableData
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
  }, [selectedBranch, dynamicTableData]);

  const statusBreakdown = useMemo(() => 
    filteredLoanData.reduce((acc, item) => {
      const status = item["Application Status"];
      acc[status] = [...(acc[status] || []), item];
      return acc;
    }, {} as Record<string, LoanApplication[]>),
  [filteredLoanData]);

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

          {/* Main Table */}
          <div className="bg-white p-6 rounded-lg shadow">
            <TableComponent
              data={filteredTableData}
              expandedStates={expandedStates}
              setExpandedStates={setExpandedStates}
              expandedRegions={expandedRegions}
              setExpandedRegions={setExpandedRegions}
              csvData={filteredLoanData}
              selectedULBRange={selectedULBRange}
            />
          </div>
        </>
      )}
    </div>
  );
}
