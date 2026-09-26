import React, { useState } from 'react';
import { ShieldAlert, Clock, Key, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MaintenanceScreen: React.FC = () => {
  const { maintenanceState, bypassMaintenance } = useApp();
  const [bypassCode, setBypassCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleBypassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const success = bypassMaintenance(bypassCode);
    if (!success) {
      setErrorMsg('Invalid authorization code. Please verify credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden text-slate-100">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl w-full text-center relative z-10 bg-slate-900/80 border border-slate-800 rounded-3xl p-8 sm:p-10 backdrop-blur-xl shadow-2xl">
        
        {/* Animated Badge Icon */}
        <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-6 text-amber-400 shadow-xl shadow-amber-500/10">
          <ShieldAlert className="w-10 h-10 animate-pulse" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold tracking-wide uppercase mb-4 border border-amber-500/30">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          Scheduled Platform Maintenance
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-amber-200 via-white to-slate-300 bg-clip-text text-transparent mb-4">
          Study Student Shop is on Hold
        </h1>

        <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6">
          {maintenanceState.message || "We are performing scheduled system infrastructure and price database optimizations. All services will resume shortly."}
        </p>

        {/* Estimated Uptime Card */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 mb-8 flex items-center justify-center gap-4 text-xs sm:text-sm">
          <Clock className="w-5 h-5 text-blue-400 flex-shrink-0" />
          <div className="text-left">
            <div className="text-slate-400 text-xs">Estimated System Availability</div>
            <div className="text-slate-200 font-semibold">
              {new Date(maintenanceState.estimatedUptime).toLocaleString(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short'
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
          <button
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700/80"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Check Live Status
          </button>

          <button
            onClick={() => setShowCodeInput(!showCodeInput)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-semibold transition-all"
          >
            <Key className="w-3.5 h-3.5" />
            Admin / Dev Bypass
          </button>
        </div>

        {/* Bypass Code Modal */}
        {showCodeInput && (
          <form onSubmit={handleBypassSubmit} className="mt-4 pt-4 border-t border-slate-800/80 text-left">
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Enter Administrative Access Key:
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="e.g. SSS-ADMIN-DEV-2026"
                value={bypassCode}
                onChange={(e) => setBypassCode(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/30"
              >
                Unlock
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-[10px] text-slate-500 mt-2">
              Default demo key: <code className="text-blue-400">SSS-ADMIN-DEV-2026</code>
            </div>
            {errorMsg && (
              <p className="text-rose-400 text-xs mt-2 font-medium">{errorMsg}</p>
            )}
          </form>
        )}

      </div>

      {/* Footer Branding */}
      <div className="mt-8 text-slate-500 text-xs text-center flex items-center gap-2">
        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
        <span>Study Student Shop (SSS) Enterprise Cloud Infrastructure</span>
      </div>

    </div>
  );
};
