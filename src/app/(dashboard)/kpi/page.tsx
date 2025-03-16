"use client";

import React, { useState, useEffect } from 'react';

interface Branch {
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

interface Region {
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

interface State {
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

interface TableData {
  tableData: State[];
}

interface DashboardData {
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

interface WipBreakdown {
  pendingForAllocation: number;
  wipCpa: number;
  salesTrayLogin: number;
  creditPending: number;
  salesTrayDde: number;
}

// Mock historical data for month-over-month comparisons
const mockHistoricalPercentages = {
  openingStock: 8.3,
  applicationLogin: -2.7,
  sanctionCount: 12.1,
  sanctionAmt: -4.5,
  pniSanctionCount: 6.8,
  pniSanctionAmount: -9.2,
  diCount: 11.9,
  diAmt: -1.3,
  daCount: 4.7,
  daValue: -6.1,
  rejection: 3.4,
  cancellation: -7.6,
  wip: 9.5,
  pendingForAllocation: 2.8,
  wipCpa: -5.9,
  salesTrayLogin: 7.4,
  creditPending: -0.8,
  salesTrayDde: 13.2,
  ftr: -3.1,
  approvalRate: 6.5
};

const Page = () => {
  const [isWipDetailsVisible, setIsWipDetailsVisible] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [wipBreakdown, setWipBreakdown] = useState<WipBreakdown | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toggleWipDetails = () => {
    setIsWipDetailsVisible(!isWipDetailsVisible);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/data/tableData.json");
        
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        
        const data: TableData = await response.json();
        
        // Calculate totals across all states
        const totalData: DashboardData = {
          openingStock: 0,
          applicationLogin: 0,
          sanctionCount: 0,
          sanctionAmt: 0,
          pniSanctionCount: 0,
          pniSanctionAmount: 0,
          freshDisbCount: 0,
          freshDisbAmt: 0,
          totalDisbAmt: 0,
          diAmt: 0,
          rejection: 0,
          cancellation: 0,
          wip: 0
        };
        
        // Sum up all values from states
        data.tableData.forEach(state => {
          totalData.openingStock += state.openingStock;
          totalData.applicationLogin += state.applicationLogin;
          totalData.sanctionCount += state.sanctionCount;
          totalData.sanctionAmt += state.sanctionAmt;
          totalData.pniSanctionCount += state.pniSanctionCount;
          totalData.pniSanctionAmount += state.pniSanctionAmount;
          totalData.freshDisbCount += state.freshDisbCount;
          totalData.freshDisbAmt += state.freshDisbAmt;
          totalData.totalDisbAmt += state.totalDisbAmt;
          totalData.diAmt += state.diAmt;
          totalData.rejection += state.rejection;
          totalData.cancellation += state.cancellation;
          totalData.wip += state.wip;
        });
        
        // Calculate WIP breakdown (using proportions since actual breakdown isn't in the data)
        // In a real application, this would come from your actual data structure
        const totalWip = totalData.wip;
        const wipData: WipBreakdown = {
          pendingForAllocation: Math.round(totalWip * 0.29), // ~29% of total WIP
          wipCpa: Math.round(totalWip * 0.25), // ~25% of total WIP
          salesTrayLogin: Math.round(totalWip * 0.16), // ~16% of total WIP
          creditPending: Math.round(totalWip * 0.26), // ~26% of total WIP
          salesTrayDde: Math.round(totalWip * 0.04) // ~4% of total WIP
        };
        
        setDashboardData(totalData);
        setWipBreakdown(wipData);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (isLoading) {
    return <div className="p-4">Loading dashboard data...</div>;
  }

  if (error || !dashboardData || !wipBreakdown) {
    return <div className="p-4 text-red-500">Error loading dashboard: {error}</div>;
  }

  return (
    <div className="p-2">
      <div className="grid grid-cols-4 gap-3">
        {/* Left Section */}
        <div className="col-span-3 space-y-3">
          {/* First row - Opening Cards */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-yellow-100 p-2 rounded-md border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
              <div className="font-semibold text-sm">Opening Stock</div>
              <div className="text-3xl font-bold my-1">{dashboardData.openingStock}</div>
              <div className="text-xs">
                {mockHistoricalPercentages.openingStock > 0 ? '+' : ''}
                {mockHistoricalPercentages.openingStock}% from last month
              </div>
            </div>
            <div className="bg-yellow-100 p-2 rounded-md border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
              <div className="font-semibold text-sm">Application Login</div>
              <div className="text-3xl font-bold my-1">{dashboardData.applicationLogin}</div>
              <div className="text-xs">
                {mockHistoricalPercentages.applicationLogin > 0 ? '+' : ''}
                {mockHistoricalPercentages.applicationLogin}% from last month
              </div>
            </div>
            <div></div>
            <div></div>
          </div>

          {/* Second row */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-green-200 p-2 rounded-md border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
              <div className="font-semibold text-sm">Sanction Count</div>
              <div className="text-3xl font-bold my-1">{dashboardData.sanctionCount}</div>
              <div className="text-xs">
                {mockHistoricalPercentages.sanctionCount > 0 ? '+' : ''}
                {mockHistoricalPercentages.sanctionCount}% from last month
              </div>
            </div>
            <div className="bg-green-200 p-2 rounded-md border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
              <div className="font-semibold text-sm">Sanction Amount (in Cr)</div>
              <div className="text-3xl font-bold my-1">{dashboardData.sanctionAmt.toFixed(2)}</div>
              <div className="text-xs">
                {mockHistoricalPercentages.sanctionAmt > 0 ? '+' : ''}
                {mockHistoricalPercentages.sanctionAmt}% from last month
              </div>
            </div>
            <div className="bg-green-200 p-2 rounded-md border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
              <div className="font-semibold text-sm">PNI Sanction Count</div>
              <div className="text-3xl font-bold my-1">{dashboardData.pniSanctionCount}</div>
              <div className="text-xs">
                {mockHistoricalPercentages.pniSanctionCount > 0 ? '+' : ''}
                {mockHistoricalPercentages.pniSanctionCount}% from last month
              </div>
            </div>
            <div className="bg-green-200 p-2 rounded-md border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
              <div className="font-semibold text-sm">PNI Sanction Amount (in Cr)</div>
              <div className="text-3xl font-bold my-1">{dashboardData.pniSanctionAmount.toFixed(2)}</div>
              <div className="text-xs">
                {mockHistoricalPercentages.pniSanctionAmount > 0 ? '+' : ''}
                {mockHistoricalPercentages.pniSanctionAmount}% from last month
              </div>
            </div>
          </div>

          {/* Third row */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-orange-200 p-2 rounded-md border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
              <div className="font-semibold text-sm">Rejection Count</div>
              <div className="text-3xl font-bold my-1">{dashboardData.rejection}</div>
              <div className="text-xs">
                {mockHistoricalPercentages.rejection > 0 ? '+' : ''}
                {mockHistoricalPercentages.rejection}% from last month
              </div>
            </div>
            <div className="bg-orange-200 p-2 rounded-md border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
              <div className="font-semibold text-sm">Cancellation Count</div>
              <div className="text-3xl font-bold my-1">{dashboardData.cancellation}</div>
              <div className="text-xs">
                {mockHistoricalPercentages.cancellation > 0 ? '+' : ''}
                {mockHistoricalPercentages.cancellation}% from last month
              </div>
            </div>
            <div></div>
            <div></div>
          </div>

          {/* Fourth row */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-green-500 p-2 rounded-md text-white border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
              <div className="font-semibold text-sm">DI Count</div>
              <div className="text-3xl font-bold my-1">{dashboardData.freshDisbCount}</div>
              <div className="text-xs">
                {mockHistoricalPercentages.diCount > 0 ? '+' : ''}
                {mockHistoricalPercentages.diCount}% from last month
              </div>
            </div>
            <div className="bg-green-500 p-2 rounded-md text-white border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
              <div className="font-semibold text-sm">DI Value</div>
              <div className="text-3xl font-bold my-1">{dashboardData.diAmt.toFixed(2)}</div>
              <div className="text-xs">
                {mockHistoricalPercentages.diAmt > 0 ? '+' : ''}
                {mockHistoricalPercentages.diAmt}% from last month
              </div>
            </div>
            <div className="bg-green-500 p-2 rounded-md text-white border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
              <div className="font-semibold text-sm">DA Count</div>
              <div className="text-3xl font-bold my-1">{dashboardData.totalDisbAmt ? Math.round(dashboardData.totalDisbAmt / 100) : 0}</div>
              <div className="text-xs">
                {mockHistoricalPercentages.daCount > 0 ? '+' : ''}
                {mockHistoricalPercentages.daCount}% from last month
              </div>
            </div>
            <div className="bg-green-500 p-2 rounded-md text-white border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
              <div className="font-semibold text-sm">DA Value</div>
              <div className="text-3xl font-bold my-1">{dashboardData.totalDisbAmt.toFixed(2)}</div>
              <div className="text-xs">
                {mockHistoricalPercentages.daValue > 0 ? '+' : ''}
                {mockHistoricalPercentages.daValue}% from last month
              </div>
            </div>
          </div>

          {/* Fifth row - WIP Card */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-yellow-100 p-2 rounded-md col-span-4 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold text-sm">WIP</div>
                  <div className="text-3xl font-bold my-1">{dashboardData.wip}</div>
                  <div className="text-xs">
                    {mockHistoricalPercentages.wip > 0 ? '+' : ''}
                    {mockHistoricalPercentages.wip}% from last month
                  </div>
                </div>
                <button
                  onClick={toggleWipDetails}
                  className="bg-yellow-300 px-3 py-1 text-sm rounded-md hover:bg-yellow-400 transition-colors duration-300 cursor-pointer border border-black"
                >
                  {isWipDetailsVisible ? 'Hide Details' : 'Show Details'}
                </button>
              </div>
              {isWipDetailsVisible && (
                <div className="mt-2 grid grid-cols-5 gap-2">
                  <div className="bg-yellow-200 p-1 rounded-md border border-black">
                    <div className="font-semibold text-xs">Pending for allocation by CPA</div>
                    <div className="text-xl font-bold my-1">{wipBreakdown.pendingForAllocation}</div>
                    <div className="text-xs">
                      {mockHistoricalPercentages.pendingForAllocation > 0 ? '+' : ''}
                      {mockHistoricalPercentages.pendingForAllocation}% from last month
                    </div>
                  </div>
                  <div className="bg-yellow-200 p-1 rounded-md border border-black">
                    <div className="font-semibold text-xs">WIP-CPA</div>
                    <div className="text-xl font-bold my-1">{wipBreakdown.wipCpa}</div>
                    <div className="text-xs">
                      {mockHistoricalPercentages.wipCpa > 0 ? '+' : ''}
                      {mockHistoricalPercentages.wipCpa}% from last month
                    </div>
                  </div>
                  <div className="bg-yellow-200 p-1 rounded-md border border-black">
                    <div className="font-semibold text-xs">Sales Tray (Login Acceptance)</div>
                    <div className="text-xl font-bold my-1">{wipBreakdown.salesTrayLogin}</div>
                    <div className="text-xs">
                      {mockHistoricalPercentages.salesTrayLogin > 0 ? '+' : ''}
                      {mockHistoricalPercentages.salesTrayLogin}% from last month
                    </div>
                  </div>
                  <div className="bg-yellow-200 p-1 rounded-md border border-black">
                    <div className="font-semibold text-xs">Credit Pending (DDE & Reco Stage) </div>
                    <div className="text-xl font-bold my-1">{wipBreakdown.creditPending}</div>
                    <div className="text-xs">
                      {mockHistoricalPercentages.creditPending > 0 ? '+' : ''}
                      {mockHistoricalPercentages.creditPending}% from last month
                    </div>
                  </div>
                  <div className="bg-yellow-200 p-1 rounded-md border border-black">
                    <div className="font-semibold text-xs">Sales Tray (DDE & RECO)</div>
                    <div className="text-xl font-bold my-1">{wipBreakdown.salesTrayDde}</div>
                    <div className="text-xs">
                      {mockHistoricalPercentages.salesTrayDde > 0 ? '+' : ''}
                      {mockHistoricalPercentages.salesTrayDde}% from last month
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-3">
          {/* Empty space for first row */}
          <div className="h-16"></div>
          
          {/* Star shape - aligned with second row */}
          <div className="flex justify-center">
            <div className="bg-blue-400 text-white p-2 relative w-32 h-32 border border-black hover:scale-102 transition-all duration-300">
              <div className="absolute inset-0 transform rotate-45 bg-blue-400 z-0"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                <div className="font-semibold text-sm">FTR</div>
                <div className="text-3xl font-bold my-1">
                  {Math.round((dashboardData.sanctionCount / 
                    (dashboardData.sanctionCount + dashboardData.rejection + dashboardData.cancellation)) *
                    100)}%
                </div>
                <div className="text-xs">
                  {mockHistoricalPercentages.ftr > 0 ? '+' : ''}
                  {mockHistoricalPercentages.ftr}% from last month
                </div>
              </div>
            </div>
          </div>

          {/* Empty space for third row */}
          <div className="h-16"></div>

          {/* Rectangle - aligned with fourth row */}
          <div className="flex justify-center">
            <div className="bg-blue-400 text-white p-2 rounded-md w-32 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
              <div className="font-semibold text-sm">Approval Rate</div>
              <div className="text-3xl font-bold my-1">
                {Math.round((dashboardData.sanctionCount / 
                  (dashboardData.sanctionCount + dashboardData.rejection)) * 
                  100)}%
              </div>
              <div className="text-xs">
                {mockHistoricalPercentages.approvalRate > 0 ? '+' : ''}
                {mockHistoricalPercentages.approvalRate}% from last month
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;