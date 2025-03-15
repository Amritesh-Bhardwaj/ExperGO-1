"use client";

import React, { useState } from 'react';

const page = () => {
  const [isWipDetailsVisible, setIsWipDetailsVisible] = useState(false);

  const toggleWipDetails = () => {
    setIsWipDetailsVisible(!isWipDetailsVisible);
  };

  return (
    <div className="p-2">
      <div className="grid grid-cols-4 gap-3">
        {/* Left Section */}
        <div className="col-span-3 space-y-3">
          {/* First row - Opening Cards */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-yellow-100 p-2 rounded-md border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
              <div className="font-semibold text-sm">Opening Stock</div>
              <div className="text-3xl font-bold my-1">606</div>
              <div className="text-xs">+8.3% from last month</div>
            </div>
            <div className="bg-yellow-100 p-2 rounded-md border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
              <div className="font-semibold text-sm">Application Login</div>
              <div className="text-3xl font-bold my-1">620</div>
              <div className="text-xs">-2.7% from last month</div>
            </div>
            <div></div>
            <div></div>
          </div>

          {/* Second row */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-green-200 p-2 rounded-md border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
              <div className="font-semibold text-sm">Sanction Count</div>
              <div className="text-3xl font-bold my-1">603</div>
              <div className="text-xs">+12.1% from last month</div>
            </div>
            <div className="bg-green-200 p-2 rounded-md border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
              <div className="font-semibold text-sm">Sanction Amount (in Cr)</div>
              <div className="text-3xl font-bold my-1">32.67</div>
              <div className="text-xs">-4.5% from last month</div>
            </div>
            <div className="bg-green-200 p-2 rounded-md border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
              <div className="font-semibold text-sm">PNI Sanction Count</div>
              <div className="text-3xl font-bold my-1">427</div>
              <div className="text-xs">+6.8% from last month</div>
            </div>
            <div className="bg-green-200 p-2 rounded-md border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
              <div className="font-semibold text-sm">PNI Sanction Amount (in Cr)</div>
              <div className="text-3xl font-bold my-1">33.54</div>
              <div className="text-xs">-9.2% from last month</div>
            </div>
          </div>

          {/* Third row */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-orange-200 p-2 rounded-md border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
              <div className="font-semibold text-sm">Rejection Count</div>
              <div className="text-3xl font-bold my-1">33</div>
              <div className="text-xs">+3.4% from last month</div>
            </div>
            <div className="bg-orange-200 p-2 rounded-md border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
              <div className="font-semibold text-sm">Cancellation Count</div>
              <div className="text-3xl font-bold my-1">39</div>
              <div className="text-xs">-7.6% from last month</div>
            </div>
            <div></div>
            <div></div>
          </div>

          {/* Fourth row */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-green-500 p-2 rounded-md text-white border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
              <div className="font-semibold text-sm">DI Count</div>
              <div className="text-3xl font-bold my-1">353</div>
              <div className="text-xs">+11.9% from last month</div>
            </div>
            <div className="bg-green-500 p-2 rounded-md text-white border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
              <div className="font-semibold text-sm">DI Value</div>
              <div className="text-3xl font-bold my-1">41.64</div>
              <div className="text-xs">-1.3% from last month</div>
            </div>
            <div className="bg-green-500 p-2 rounded-md text-white border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
              <div className="font-semibold text-sm">DA Count</div>
              <div className="text-3xl font-bold my-1">36</div>
              <div className="text-xs">+4.7% from last month</div>
            </div>
            <div className="bg-green-500 p-2 rounded-md text-white border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
              <div className="font-semibold text-sm">DA Value</div>
              <div className="text-3xl font-bold my-1">35.04</div>
              <div className="text-xs">-6.1% from last month</div>
            </div>
          </div>

          {/* Fifth row - WIP Card */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-yellow-100 p-2 rounded-md col-span-4 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold text-sm">WIP</div>
                  <div className="text-3xl font-bold my-1">1118</div>
                  <div className="text-xs">+9.5% from last month</div>
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
                    <div className="text-xl font-bold my-1">322</div>
                    <div className="text-xs">+2.8% from last month</div>
                  </div>
                  <div className="bg-yellow-200 p-1 rounded-md border border-black">
                    <div className="font-semibold text-xs">WIP-CPA</div>
                    <div className="text-xl font-bold my-1">276</div>
                    <div className="text-xs">-5.9% from last month</div>
                  </div>
                  <div className="bg-yellow-200 p-1 rounded-md border border-black">
                    <div className="font-semibold text-xs">Sales Tray (Login Acceptance)</div>
                    <div className="text-xl font-bold my-1">185</div>
                    <div className="text-xs">+7.4% from last month</div>
                  </div>
                  <div className="bg-yellow-200 p-1 rounded-md border border-black">
                    <div className="font-semibold text-xs">Credit Pending (DDE & Reco Stage) </div>
                    <div className="text-xl font-bold my-1">291</div>
                    <div className="text-xs">-0.8% from last month</div>
                  </div>
                  <div className="bg-yellow-200 p-1 rounded-md border border-black">
                    <div className="font-semibold text-xs">Sales Tray (DDE & RECO)</div>
                    <div className="text-xl font-bold my-1">44</div>
                    <div className="text-xs">+13.2% from last month</div>
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
                <div className="text-3xl font-bold my-1">85%</div>
                <div className="text-xs">-3.1% from last month</div>
              </div>
            </div>
          </div>

          {/* Empty space for third row */}
          <div className="h-16"></div>

          {/* Rectangle - aligned with fourth row */}
          <div className="flex justify-center">
            <div className="bg-blue-400 text-white p-2 rounded-md w-32 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
              <div className="font-semibold text-sm">Approval Rate</div>
              <div className="text-3xl font-bold my-1">92%</div>
              <div className="text-xs">+6.5% from last month</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
