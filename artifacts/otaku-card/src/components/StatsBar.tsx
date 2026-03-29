import React from 'react';
import { Activity, Server, ShieldCheck, FileCheck } from 'lucide-react';

export function StatsBar() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full font-mono">
      <div className="oia-panel p-4 flex flex-col gap-2 relative overflow-hidden group border-t-0 border-l-0 border-r-0 border-b-2 border-[#10b981]">
        <div className="flex items-center gap-2 text-slate-400">
          <Activity className="w-4 h-4" />
          <span className="text-[10px] uppercase font-bold tracking-widest">SYSTÈME</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-2 h-2 rounded-full bg-[#10b981]"></div>
          <div className="text-sm font-bold tracking-widest text-slate-200">OPÉRATIONNEL</div>
        </div>
      </div>
      
      <div className="oia-panel p-4 flex flex-col gap-2 relative overflow-hidden group border-t-0 border-l-0 border-r-0 border-b-2 border-[#3b82f6]">
        <div className="flex items-center gap-2 text-slate-400">
          <Server className="w-4 h-4" />
          <span className="text-[10px] uppercase font-bold tracking-widest">SERVEUR CENTRAL</span>
        </div>
        <div className="flex flex-col gap-1 mt-1">
          <div className="text-sm font-bold tracking-widest text-slate-200 flex justify-between">
            <span>UPTIME</span>
            <span className="text-[#3b82f6]">99.9%</span>
          </div>
          <div className="w-full h-1 bg-slate-800 mt-1 rounded-full overflow-hidden">
            <div className="h-full bg-[#3b82f6] w-[99.9%]"></div>
          </div>
        </div>
      </div>

      <div className="oia-panel p-4 flex flex-col gap-2 relative overflow-hidden group border-t-0 border-l-0 border-r-0 border-b-2 border-[#d4af37]">
        <div className="flex items-center gap-2 text-slate-400">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[10px] uppercase font-bold tracking-widest">ACCRÉDITATION</span>
        </div>
        <div className="text-sm font-bold tracking-widest text-[#d4af37] mt-1">NIVEAU ALPHA</div>
      </div>

      <div className="oia-panel p-4 flex flex-col gap-2 relative overflow-hidden group border-t-0 border-l-0 border-r-0 border-b-2 border-slate-600">
        <div className="flex items-center gap-2 text-slate-400">
          <FileCheck className="w-4 h-4" />
          <span className="text-[10px] uppercase font-bold tracking-widest">DOCUMENTS ÉMIS</span>
        </div>
        <div className="text-sm font-bold tracking-widest text-slate-200 mt-1 font-mono">
          8,492,103
        </div>
      </div>
    </div>
  );
}