import React from 'react';
import { Search, Bell, Settings, Plus, Sparkles, User, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TopBar({ onStartNewScan, searchQuery, setSearchQuery }) {
  return (
    <header className="h-16 bg-white border-b border-[#E5E0DA] px-6 flex items-center justify-between sticky top-0 z-10">
      {/* Left branding & quick nav links */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 text-sm font-semibold text-[#2B2523]">
          <span className="text-base font-bold tracking-tight text-[#2B2523]">BidLens</span>
          <span className="text-[#786F66] font-normal">|</span>
          <span className="text-xs font-medium text-[#786F66] hover:text-[#2B2523] cursor-pointer">Enterprise Suite</span>
          <span className="text-xs font-medium text-[#786F66] hover:text-[#2B2523] cursor-pointer">Help Center</span>
          <span className="text-xs font-medium text-[#786F66] hover:text-[#2B2523] cursor-pointer">API Docs</span>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="flex-1 max-w-md mx-6">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#786F66]" />
          <Input
            type="text"
            placeholder="Search RFPs, clauses, eligibility criteria..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-1.5 h-9 text-xs bg-[#FAF8F5] border-[#E5E0DA] focus:bg-white rounded-lg transition-all"
          />
        </div>
      </div>

      {/* Right User Actions */}
      <div className="flex items-center space-x-3">
        <Button
          onClick={onStartNewScan}
          size="sm"
          className="bg-[#B3432E] hover:bg-[#9E3824] text-white flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded-lg shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Tender Scan</span>
        </Button>

        <div className="h-4 w-px bg-[#E5E0DA]" />

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-[#F3EFE9] text-[#786F66] hover:text-[#2B2523] transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#B3432E]" />
        </button>

        {/* Settings */}
        <button className="p-2 rounded-lg hover:bg-[#F3EFE9] text-[#786F66] hover:text-[#2B2523] transition-colors">
          <Settings className="w-4 h-4" />
        </button>

        {/* Profile Avatar */}
        <div className="flex items-center space-x-2 pl-2 border-l border-[#E5E0DA]">
          <div className="w-8 h-8 rounded-full bg-[#B3432E]/10 border border-[#B3432E]/20 flex items-center justify-center text-[#B3432E] font-bold text-xs">
            MP
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-[#2B2523] leading-tight">Officer Mehak</p>
            <p className="text-[10px] text-[#786F66]">GeM Officer • Ministry</p>
          </div>
        </div>
      </div>
    </header>
  );
}
