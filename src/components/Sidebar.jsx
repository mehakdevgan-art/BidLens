import React from 'react';
import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  BarChart3,
  BookOpen,
  Settings,
  ShieldCheck,
  Activity,
  PlusCircle,
  Sparkles,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Sidebar({ currentView, setCurrentView, activeTender, onStartNewScan }) {
  const pendingReviewCount = activeTender ? activeTender.requirements.length : 7;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, view: 'dashboard' },
    { id: 'tenders', label: 'Tenders', icon: FileText, view: 'tenders' },
    { id: 'compliance', label: 'Compliance', icon: CheckSquare, badge: pendingReviewCount, view: 'tender_overview' },
    {
      id: 'Compliance Matrix',
      label: 'Bid Matrix',
      icon: BarChart3,
      view: 'compliance'
    },
    { id: 'library', label: 'Clause Library', icon: BookOpen, view: 'library' },
    { id: 'settings', label: 'Settings', icon: Settings, view: 'settings' },
  ];

  return (
    <aside className="w-64 bg-[#F5F1EB] border-r border-[#E5E0DA] flex flex-col justify-between h-screen sticky top-0 select-none z-20">
      <div className="p-4 space-y-5">
        {/* Logo & Header */}
        <div className="flex items-center space-x-3 px-2 pt-1">
          <div className="w-9 h-9 rounded-xl bg-[#B3432E] flex items-center justify-center text-white shadow-sm font-bold text-lg">
            <Award className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-base tracking-tight text-[#2B2523]">BidLens</span>
              <span className="text-[10px] font-semibold tracking-wider text-[#B3432E] bg-rose-100 px-1.5 py-0.5 rounded border border-rose-200 uppercase">Enterprise</span>
            </div>
            <p className="text-[11px] text-[#786F66] font-medium">Global Procurement Unit</p>
          </div>
        </div>

        {/* Primary Action Button */}
        <Button
          onClick={onStartNewScan}
          className="w-full bg-[#B3432E] hover:bg-[#9E3824] text-white flex items-center justify-center space-x-2 py-2.5 rounded-xl font-medium text-sm shadow-sm transition-all hover:shadow"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Tender Scan</span>
        </Button>

        {/* Navigation Section */}
        <nav className="space-y-1 pt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.view;

            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.view)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                  ? 'bg-[#B3432E] text-white shadow-sm font-semibold'
                  : 'text-[#574E46] hover:bg-[#EAE4DC] hover:text-[#2B2523]'
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#786F66]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-rose-100 text-[#B3432E]'
                      }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Health & Audit Indicators */}
      <div className="p-4 border-t border-[#E5E0DA] bg-[#EFEBE4]/60 space-y-2.5">
        <div className="flex items-center justify-between text-xs text-[#786F66] px-1">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-medium text-[#2B2523]">Security Audit</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>

        <div className="flex items-center justify-between text-xs text-[#786F66] px-1">
          <div className="flex items-center space-x-2">
            <Activity className="w-3.5 h-3.5 text-[#B3432E]" />
            <span className="font-medium text-[#2B2523]">System Health</span>
          </div>
          <span className="font-semibold text-[#2B2523]">99.98%</span>
        </div>
      </div>
    </aside>
  );
}
