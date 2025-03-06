"use client";
import React from 'react';
import KpiCard from '../../components/KpiCard';

export default function KpiPage() {
  const kpis = [
    { title: 'Application Login', value: '620', change: 12 },
    { title: 'Sanction Count', value: '603.00', change: 8.5 },
    { title: 'Sanction Amount (in Cr)', value: '32.67', change: 15.3 },
    { title: 'PNI Sanction Count', value: '427', change: 2.1 },
    { title: 'PNI Sanction Amount (in Cr)', value: '33.54', change: -1.5 },
    { title: 'Rejection Count', value: '33', change: -3.2 },
    { title: 'Cancellation Count', value: '39', change: 5.7 },
    { title: 'DI Count', value: '353', change: 0.3 },
    { title: 'DI Value', value: '41.64', change: 7.8 },
    { title: 'DA Count', value: '36.19', change: -0.5 },
    { title: 'DA Value', value: '35.04', change: 3.6 },
  ];
  
  // WIP child cards data
  const wipChildrenData = [
    { title: 'Pending Approval', value: '322', change: 2.1 },
    { title: 'Under Review', value: '276', change: -5.3 },
    { title: 'Awaiting Documents', value: '185', change: 7.8 },
    { title: 'Verification Stage', value: '291', change: -1.2 },
    { title: 'Final Processing', value: '44', change: 12.5 },
  ];
  
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">KPI Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Regular KPI cards */}
        {kpis.map((kpi, index) => {
          // For all cards except WIP
          if (kpi.title !== "WIP") {
            return (
              <KpiCard
                key={index}
                title={kpi.title}
                value={kpi.value}
                change={kpi.change}
              />
            );
          }
          return null;
        })}
        
        {/* WIP card with expandable children */}
        <KpiCard
          title="WIP"
          value="1118.00"
          change={-12.4}
          isExpandable={true}
        >
          {/* Empty placeholder - we'll render children outside of parent card */}
        </KpiCard>
      </div>

      {/* WIP child cards section with initial hidden state */}
      <div id="wip-children" className="mt-8 w-full" style={{ display: 'none' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {wipChildrenData.map((childKpi, index) => (
            <div key={index} className="bg-gray-50 rounded-md p-4 shadow-sm">
              <h4 className="text-gray-600 text-xs font-medium">{childKpi.title}</h4>
              <p className="text-xl font-bold">{childKpi.value}</p>
              <p className={`text-xs ${childKpi.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {`${childKpi.change >= 0 ? '+' : ''}${childKpi.change}% from last month`}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
