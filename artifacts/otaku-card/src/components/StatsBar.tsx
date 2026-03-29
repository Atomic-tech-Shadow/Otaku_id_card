import React from 'react';
import { Binary, Activity, Star } from 'lucide-react';

export function StatsBar() {
  return (
    <div className="mt-8 grid grid-cols-3 gap-4 w-full">
      <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex items-center gap-3">
        <Binary className="text-blue-500" />
        <div>
          <div className="text-[10px] text-slate-500 uppercase font-bold">Encodage</div>
          <div className="text-sm font-mono tracking-tighter">HEX-721-OTK</div>
        </div>
      </div>
      <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex items-center gap-3">
        <Activity className="text-green-500" />
        <div>
          <div className="text-[10px] text-slate-500 uppercase font-bold">Statut</div>
          <div className="text-sm font-mono tracking-tighter text-green-400 font-bold">ACTIF</div>
        </div>
      </div>
      <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex items-center gap-3">
        <Star className="text-yellow-500" />
        <div>
          <div className="text-[10px] text-slate-500 uppercase font-bold">Rang</div>
          <div className="text-sm font-mono tracking-tighter">ÉLITE UNIVERSELLE</div>
        </div>
      </div>
    </div>
  );
}
