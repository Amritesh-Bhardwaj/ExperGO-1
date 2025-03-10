// "use client";

// import React from "react";
// import KpiCard from "../../components/KpiCard";

// export default function KpiPage() {
//   const kpis = [
//     { title: "Opening Stock", value: "606", change: 10.5 },
//     { title: "Application Login", value: "620", change: 12 },
//     { title: "Sanction Count", value: "603.00", change: 8.5 },
//     { title: "Sanction Amount (in Cr)", value: "32.67", change: 15.3 },
//     { title: "PNI Sanction Count", value: "427", change: 2.1 },
//     { title: "PNI Sanction Amount (in Cr)", value: "33.54", change: -1.5 },
//     { title: "Rejection Count", value: "33", change: -3.2 },
//     { title: "Cancellation Count", value: "39", change: 5.7 },
//     { title: "DI Count", value: "353", change: 0.3 },
//     { title: "DI Value", value: "41.64", change: 7.8 },
//     { title: "DA Count", value: "36.19", change: -0.5 },
//     { title: "DA Value", value: "35.04", change: 3.6 },
//   ];

//   // WIP child cards data
//   const wipChildrenData = [
//     { title: "Pending Approval", value: "322", change: 2.1 },
//     { title: "Under Review", value: "276", change: -5.3 },
//     { title: "Awaiting Documents", value: "185", change: 7.8 },
//     { title: "Verification Stage", value: "291", change: -1.2 },
//     { title: "Final Processing", value: "44", change: 12.5 },
//   ];

//   // New components for the vertical box
//   const additionalKpis = [
//     { title: "FTR", value: "85%", change: 4.2 },
//     { title: "Approval Rate", value: "92%", change: -1.8 },
//   ];

//   // Helper function to filter KPIs by titles
//   const getKpisByTitles = (titles: string[]) => {
//     return kpis.filter((kpi) => titles.includes(kpi.title));
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6">KPI Dashboard</h1>

//       {/* Main layout: 75% left, 25% right */}
//       <div className="flex flex-col lg:flex-row gap-6">
//         {/* Left Section (75%): Horizontal Boxes */}
//         <div className="w-full lg:w-3/4 flex flex-col gap-6">
//           {/* 1st Horizontal Box: Opening Stock, Application Login */}
//           <div className="bg-[rgba(255,206,86,0.6)] rounded-lg p-4">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               {getKpisByTitles(["Opening Stock", "Application Login"]).map((kpi, index) => (
//                 <div key={index} className={index < 2 ? "col-span-1" : "col-span-0"}>
//                   <KpiCard
//                     title={kpi.title}
//                     value={kpi.value}
//                     change={kpi.change}
//                   />
//                 </div>
//               ))}
//               {/* Empty columns to maintain alignment with 4-column grid */}
//               <div className="col-span-1 hidden md:block"></div>
//               <div className="col-span-1 hidden md:block"></div>
//             </div>
//           </div>

//           {/* 2nd Horizontal Box: Sanction Count, Sanction Amount, PNI Count, PNI Amount */}
//           <div className="bg-[rgba(75,192,192,0.6)] rounded-lg p-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//               {getKpisByTitles([
//                 "Sanction Count",
//                 "Sanction Amount (in Cr)",
//                 "PNI Sanction Count",
//                 "PNI Sanction Amount (in Cr)",
//               ]).map((kpi, index) => (
//                 <KpiCard
//                   key={index}
//                   title={kpi.title}
//                   value={kpi.value}
//                   change={kpi.change}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* 3rd Horizontal Box: Rejection Count, Cancellation Count */}
//           <div className="bg-[rgba(255,159,64,0.6)] rounded-lg p-4">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               {getKpisByTitles(["Rejection Count", "Cancellation Count"]).map((kpi, index) => (
//                 <div key={index} className={index < 2 ? "col-span-1" : "col-span-0"}>
//                   <KpiCard
//                     title={kpi.title}
//                     value={kpi.value}
//                     change={kpi.change}
//                   />
//                 </div>
//               ))}
//               {/* Empty columns to maintain alignment with 4-column grid */}
//               <div className="col-span-1 hidden md:block"></div>
//               <div className="col-span-1 hidden md:block"></div>
//             </div>
//           </div>

//           {/* 4th Horizontal Box: DI Count, DI Value, DA Count, DA Value */}
//           <div className="bg-[rgba(54,162,235,0.6)] rounded-lg p-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//               {getKpisByTitles(["DI Count", "DI Value", "DA Count", "DA Value"]).map((kpi, index) => (
//                 <KpiCard
//                   key={index}
//                   title={kpi.title}
//                   value={kpi.value}
//                   change={kpi.change}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* 5th Horizontal Box: WIP (Expandable) */}
//           <div className="bg-[rgba(153,102,255,0.6)] rounded-lg p-4">
//             <KpiCard
//               title="WIP"
//               value="1118.00"
//               change={-12.4}
//               isExpandable={true}
//             >
//               {/* Render WIP child cards inside the parent */}
//               {(isExpanded: boolean) =>
//                 isExpanded && (
//                   <div className="mt-2 pl-4 border-l-2 border-gray-200 space-y-2">
//                     {wipChildrenData.map((childKpi, index) => (
//                       <div
//                         key={index}
//                         className="bg-gray-50 rounded-lg p-4"
//                       >
//                         <h4 className="text-gray-600 text-xs font-medium">
//                           {childKpi.title}
//                         </h4>
//                         <p className="text-xl font-bold">{childKpi.value}</p>
//                         <p
//                           className={`text-xs ${
//                             childKpi.change >= 0 ? "text-green-500" : "text-red-500"
//                           }`}
//                         >
//                           {`${childKpi.change >= 0 ? "+" : ""}${childKpi.change}% from last month`}
//                         </p>
//                       </div>
//                     ))}
//                   </div>
//                 )
//               }
//             </KpiCard>
//           </div>
//         </div>

//         {/* Right Section (25%): Vertical Box with FTR and Approval Rate */}
//         <div className="w-full lg:w-1/4">
//           <div className="bg-gray-100 rounded-lg p-4 flex flex-col gap-4">
//             {additionalKpis.map((kpi, index) => (
//               <KpiCard
//                 key={index}
//                 title={kpi.title}
//                 value={kpi.value}
//                 change={kpi.change}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

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
              <div className="text-3xl font-bold my-1">603.00</div>
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
              <div className="text-3xl font-bold my-1">36.19</div>
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
                  <div className="text-3xl font-bold my-1">1118.00</div>
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
                    <div className="font-semibold text-xs">Pending Approval</div>
                    <div className="text-xl font-bold my-1">322</div>
                    <div className="text-xs">+2.8% from last month</div>
                  </div>
                  <div className="bg-yellow-200 p-1 rounded-md border border-black">
                    <div className="font-semibold text-xs">Under Review</div>
                    <div className="text-xl font-bold my-1">276</div>
                    <div className="text-xs">-5.9% from last month</div>
                  </div>
                  <div className="bg-yellow-200 p-1 rounded-md border border-black">
                    <div className="font-semibold text-xs">Awaiting Documents</div>
                    <div className="text-xl font-bold my-1">185</div>
                    <div className="text-xs">+7.4% from last month</div>
                  </div>
                  <div className="bg-yellow-200 p-1 rounded-md border border-black">
                    <div className="font-semibold text-xs">Verification Stage</div>
                    <div className="text-xl font-bold my-1">291</div>
                    <div className="text-xs">-0.8% from last month</div>
                  </div>
                  <div className="bg-yellow-200 p-1 rounded-md border border-black">
                    <div className="font-semibold text-xs">Final Processing</div>
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
