'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path ? 'bg-blue-700' : '';
  };

  return (
    <nav className="bg-zinc-200 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">ExperGo Dashboard</Link>
        <div className="flex space-x-4">
          <Link href="/kpi" className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium ${isActive('/kpi')}`}>
            KPI
          </Link>
          <Link href="/table" className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium ${isActive('/table')}`}>
            Table
          </Link>
          <Link href="/pie-chart" className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium ${isActive('/pie-chart')}`}>
            Pie Chart
          </Link>
          <Link href="/map" className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium ${isActive('/map')}`}>
            Map
          </Link>
        </div>
      </div>
    </nav>
  );
}