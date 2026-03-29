import React from 'react';
import { Binary, Activity, Zap, Server } from 'lucide-react';

export function StatsBar() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full font-mono">
      <div className="hud-panel p-4 flex flex-col gap-2 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[#00d4ff]/5 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
        <div className="flex items-center gap-2 text-[#00d4ff]">
          <Binary className="w-4 h-4" />
          <span className="text-[10px] text-white/50 uppercase font-bold tracking-widest">Encodage</span>
        </div>
        <div className="text-sm font-bold tracking-widest text-white mt-1">HEX-721-OTK</div>
      </div>
      
      <div className="hud-panel p-4 flex flex-col gap-2 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[#00ff9d]/5 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
        <div className="flex items-center gap-2 text-[#00ff9d]">
          <Activity className="w-4 h-4" />
          <span className="text-[10px] text-white/50 uppercase font-bold tracking-widest">Statut</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-2 h-2 rounded-full bg-[#00ff9d] animate-pulse shadow-[0_0_10px_#00ff9d]"></div>
          <div className="text-sm font-bold tracking-widest text-[#00ff9d]">ACTIF_LIVE</div>
        </div>
      </div>
      
      <div className="hud-panel p-4 flex flex-col gap-2 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[#b026ff]/5 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
        <div className="flex items-center gap-2 text-[#b026ff]">
          <Zap className="w-4 h-4" />
          <span className="text-[10px] text-white/50 uppercase font-bold tracking-widest">Sync Rate</span>
        </div>
        <div className="text-sm font-bold tracking-widest text-white mt-1">99.8%</div>
        <div className="w-full h-1 bg-black/50 mt-1 rounded-full overflow-hidden">
          <div className="h-full bg-[#b026ff] w-[99.8%]"></div>
        </div>
      </div>

      <div className="hud-panel p-4 flex flex-col gap-2 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[#ff2a2a]/5 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
        <div className="flex items-center gap-2 text-[#ff2a2a]">
          <Server className="w-4 h-4" />
          <span className="text-[10px] text-white/50 uppercase font-bold tracking-widest">Network</span>
        </div>
        <div className="text-sm font-bold tracking-widest text-white mt-1 flex items-center justify-between">
          <span>MAIN_NET</span>
          <span className="text-[10px] text-[#ff2a2a]">12ms</span>
        </div>
      </div>
    </div>
  );
}
