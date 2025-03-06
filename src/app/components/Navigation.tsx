'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path ? 'bg-white' : '';
  };

  return (
    <nav className="bg-zinc-200 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="font-bold text-xl">ExperGo Dashboard</Link>
        <div className="flex space-x-4">
          <Link href="/kpi" className={`px-4 py-2 rounded hover:bg-white transition-colors ${isActive('/kpi')}`}>
            KPI
          </Link>
          <Link href="/table" className={`px-4 py-2 rounded hover:bg-white transition-colors ${isActive('/table')}`}>
            Table
          </Link>
          <Link href="/map" className={`px-4 py-2 rounded hover:bg-white transition-colors ${isActive('/map')}`}>
            Map
          </Link>
        </div>
      </div>
    </nav>
  );
}