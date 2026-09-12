import React, { useState } from 'react';
import { ChevronLeft, Lock, CheckCircle2 } from 'lucide-react';
import ChecklistTable from './ChecklistTable';
import TenderDocModal from './TenderDocModal';

export default function TenderOverviewScreen({ 
  tender, 
  onBackToDashboard, 
  onAddRequirement, 
  onEditRequirement, 
  onDeleteRequirement,
  onApproveChecklist 
}) {
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [confirmApproveOpen, setConfirmApproveOpen] = useState(false);

  if (!tender) return null;

  const isApproved = tender.checklist_approved;
  const reqCount = tender.requirements.length;

  const handleApproveClick = () => {
    if (reqCount === 0) return;
    if (isApproved) {
      onApproveChecklist(tender.tender_id, false);
    } else {
      setConfirmApproveOpen(true);
    }
  };

  const handleConfirmApproval = () => {
    onApproveChecklist(tender.tender_id, true);
    setConfirmApproveOpen(false);
  };

  const renderStatusLabel = () => {
    if (isApproved) {
      return (
        <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md inline-block">
          Checklist Approved & Locked
        </span>
      );
    }
    return (
      <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-md inline-block">
        Pending Officer Approval
      </span>
    );
  };

  return (
    <div className="w-full px-8 py-8 space-y-8">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between text-sm text-[#786F66]">
        <div className="flex items-center space-x-2 font-semibold">
          <button 
            onClick={onBackToDashboard}
            className="flex items-center space-x-1 hover:text-[#B3432E] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Tenders</span>
          </button>
          <span>/</span>
          <span className="font-mono font-extrabold text-[#B3432E]">{tender.tender_id}</span>
          <span>/</span>
          <span className="text-[#2B2523] font-extrabold">Compliance Checklist</span>
        </div>

        <span className="font-mono font-bold text-[#786F66]">GeM Ref: {tender.tender_id}</span>
      </div>

      {/* Tender Header & Plain Label/Value Rows Stack */}
      <div className="border border-[#E5E0DA] bg-white rounded-2xl p-8 space-y-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#E5E0DA]">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="font-mono font-extrabold text-sm text-[#B3432E]">{tender.tender_id}</span>
              {renderStatusLabel()}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#2B2523]">{tender.title}</h1>
          </div>

          {/* Action Header: EXACTLY ONE SOLID PRIMARY BUTTON */}
          <div className="flex items-center space-x-4 shrink-0">
            {/* Secondary Action: Plain Outlined Button */}
            <button
              onClick={() => setDocModalOpen(true)}
              className="px-5 py-2.5 border border-[#E5E0DA] hover:bg-[#FAF8F5] text-[#2B2523] rounded-xl text-sm font-semibold transition-colors"
            >
              View Tender Document
            </button>

            {/* SINGLE SOLID PRIMARY BUTTON FOR SCREEN */}
            <button
              disabled={reqCount === 0}
              onClick={handleApproveClick}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center space-x-2 transition-colors ${
                isApproved
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  : 'bg-[#B3432E] hover:bg-[#9E3824] text-white shadow-xs'
              }`}
            >
              {isApproved ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Checklist Approved ✓</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Checklist</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* STACKED LIST: Plain Label/Value Rows (High Readability) */}
        <div className="divide-y divide-[#E5E0DA] text-sm md:text-base">
          <div className="py-3.5 flex justify-between items-center">
            <span className="text-[#786F66] font-medium">Buyer Department</span>
            <span className="font-bold text-[#2B2523]">{tender.department}</span>
          </div>

          <div className="py-3.5 flex justify-between items-center">
            <span className="text-[#786F66] font-medium">Published Date</span>
            <span className="font-semibold text-[#2B2523]">{tender.published_date}</span>
          </div>

          <div className="py-3.5 flex justify-between items-center">
            <span className="text-[#786F66] font-medium">Submission Deadline</span>
            <span className="font-extrabold text-amber-900">{tender.deadline}</span>
          </div>

          <div className="py-3.5 flex justify-between items-center">
            <span className="text-[#786F66] font-medium">Estimated Value</span>
            <span className="font-extrabold text-[#2B2523] text-lg">{tender.estimated_value}</span>
          </div>
        </div>
      </div>

      {/* CLEAN STEP TRACKER STRIP */}
      <div className="border border-[#E5E0DA] bg-white rounded-2xl p-5 text-sm font-semibold text-[#574E46] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div><strong className="text-[#2B2523] font-bold">Step 1:</strong> Document Upload — Completed</div>
          <span className="hidden sm:inline text-[#E5E0DA]">│</span>
          <div><strong className="text-[#2B2523] font-bold">Step 2:</strong> AI Clause Extraction — Completed ({reqCount} Rules)</div>
          <span className="hidden sm:inline text-[#E5E0DA]">│</span>
          <div>
            <strong className="text-[#2B2523] font-bold">Step 3:</strong> Officer Approval —{' '}
            <span className={isApproved ? 'text-emerald-800 font-extrabold' : 'text-[#B3432E] font-extrabold'}>
              {isApproved ? 'Approved' : 'Pending Review'}
            </span>
          </div>
        </div>
      </div>

      {/* MAIN CHECKLIST WORKSTATION SECTION */}
      <div className="space-y-5 pt-2">
        <div className="border-b border-[#E5E0DA] pb-3 flex items-center justify-between">
          <h2 className="text-base font-extrabold text-[#2B2523] uppercase tracking-wider">AI-Extracted Eligibility Conditions Checklist</h2>
          <span className="text-xs text-[#786F66] font-bold">AI Extraction Confidence: 98.4%</span>
        </div>

        <ChecklistTable
          tender={tender}
          requirements={tender.requirements}
          onAddRequirement={onAddRequirement}
          onEditRequirement={onEditRequirement}
          onDeleteRequirement={onDeleteRequirement}
          isApproved={isApproved}
        />
      </div>

      {/* Tender Document Modal */}
      <TenderDocModal
        open={docModalOpen}
        onOpenChange={setDocModalOpen}
        tender={tender}
      />

      {/* APPROVE CHECKLIST CONFIRMATION DIALOG */}
      {confirmApproveOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E5E0DA] rounded-2xl p-8 max-w-lg w-full space-y-5 shadow-2xl">
            <h3 className="text-lg font-extrabold text-[#2B2523]">Approve Eligibility Checklist</h3>
            <p className="text-sm text-[#786F66] leading-relaxed">
              You are approving <strong className="text-[#2B2523] font-bold">{reqCount} eligibility requirements</strong> for tender <span className="font-mono font-bold text-[#B3432E]">{tender.tender_id}</span>. Once approved, these criteria lock the evaluation rules on the GeM portal.
            </p>

            <div className="flex justify-end space-x-3 pt-3">
              <button 
                onClick={() => setConfirmApproveOpen(false)}
                className="px-4 py-2 border border-[#E5E0DA] text-[#574E46] hover:bg-[#FAF8F5] rounded-xl text-sm font-semibold"
              >
                Back to Review
              </button>
              <button 
                onClick={handleConfirmApproval}
                className="px-5 py-2 bg-[#B3432E] hover:bg-[#9E3824] text-white rounded-xl text-sm font-extrabold shadow-xs"
              >
                Confirm & Approve Checklist ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
