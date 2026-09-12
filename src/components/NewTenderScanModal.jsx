import React, { useState } from 'react';
import { Loader2, Upload, PlusCircle } from 'lucide-react';

export default function NewTenderScanModal({ open, onOpenChange, onAddNewTender }) {
  if (!open) return null;

  const [step, setStep] = useState(1);
  const [tenderTitle, setTenderTitle] = useState('');
  const [department, setDepartment] = useState('Ministry of Education');
  const [estimatedValue, setEstimatedValue] = useState('₹ 6.50 Crore');
  const [progress, setProgress] = useState(0);

  const handleStartScan = (e) => {
    e.preventDefault();
    if (!tenderTitle.trim()) return;

    setStep(2);
    setProgress(30);

    setTimeout(() => {
      setProgress(70);
    }, 1200);

    setTimeout(() => {
      setProgress(100);
      
      const newTenderId = `GEM/2024/${Math.floor(100 + Math.random() * 900)}`;
      const newTender = {
        tender_id: newTenderId,
        title: tenderTitle.trim(),
        department: department.trim(),
        bids_count: 0,
        status: 'Under Evaluation',
        last_updated: 'Just Now',
        published_date: new Date().toISOString().split('T')[0],
        deadline: '2026-10-30',
        estimated_value: estimatedValue.trim(),
        checklist_approved: false,
        requirements: [
          {
            requirement_id: `REQ_${Date.now()}_1`,
            name: "GST Registration Certificate",
            category: "FINANCIAL",
            operator: "==",
            required_value: 1,
            unit: "Active",
            source: { clause: "2.1", page: 3 },
            approved: true
          },
          {
            requirement_id: `REQ_${Date.now()}_2`,
            name: "Class-1 Local Content Supplier",
            category: "POLICY",
            operator: ">=",
            required_value: 50,
            unit: "%",
            source: { clause: "5.4", page: 9 },
            approved: true
          }
        ]
      };

      onAddNewTender(newTender);
      setStep(3);
    }, 2500);
  };

  const handleClose = () => {
    setStep(1);
    setProgress(0);
    setTenderTitle('');
    onOpenChange(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#E5E0DA] rounded-2xl p-8 max-w-2xl w-full space-y-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E0DA] pb-5">
          <div>
            <h3 className="text-xl font-extrabold text-[#2B2523]">New Tender Scan</h3>
            <p className="text-sm text-[#786F66] font-medium mt-1">Upload an RFP document to extract eligibility conditions using AI</p>
          </div>
          <button onClick={handleClose} className="text-[#786F66] hover:text-[#2B2523] text-lg font-bold px-3 py-2 rounded-xl hover:bg-[#F5F1EB] transition-colors">✕</button>
        </div>

        {step === 1 && (
          <form onSubmit={handleStartScan} className="space-y-5 text-sm">
            <div>
              <label className="font-bold text-[#2B2523] block mb-2 text-base">Tender Title</label>
              <input
                required
                placeholder="e.g. Supply of Smart Classroom Panels"
                value={tenderTitle}
                onChange={(e) => setTenderTitle(e.target.value)}
                className="w-full px-4 py-3 text-base border border-[#E5E0DA] rounded-xl focus:outline-none focus:border-[#B3432E] bg-[#FAF8F5] focus:bg-white transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="font-bold text-[#2B2523] block mb-2 text-base">Ministry / Department</label>
                <input
                  required
                  placeholder="e.g. Ministry of Education"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-3 text-base border border-[#E5E0DA] rounded-xl focus:outline-none focus:border-[#B3432E] bg-[#FAF8F5] focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="font-bold text-[#2B2523] block mb-2 text-base">Estimated Value</label>
                <input
                  required
                  placeholder="e.g. ₹ 6.50 Crore"
                  value={estimatedValue}
                  onChange={(e) => setEstimatedValue(e.target.value)}
                  className="w-full px-4 py-3 text-base border border-[#E5E0DA] rounded-xl focus:outline-none focus:border-[#B3432E] bg-[#FAF8F5] focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-[#E5E0DA] bg-[#FAF8F5] rounded-2xl p-8 text-center space-y-3 hover:border-[#B3432E]/40 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-[#B3432E] mx-auto" />
              <p className="text-base font-bold text-[#2B2523]">Upload Tender RFP Document (PDF)</p>
              <p className="text-sm text-[#786F66]">Drag & drop or click to browse • GeM specifications up to 50MB</p>
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t border-[#E5E0DA]">
              <button 
                type="button" 
                onClick={handleClose}
                className="px-5 py-2.5 border border-[#E5E0DA] text-[#574E46] hover:bg-[#FAF8F5] rounded-xl text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-6 py-2.5 bg-[#B3432E] hover:bg-[#9E3824] text-white rounded-xl text-sm font-extrabold flex items-center space-x-2 shadow-xs transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Start AI Scan</span>
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <div className="py-12 space-y-6 text-center">
            <Loader2 className="w-10 h-10 animate-spin text-[#B3432E] mx-auto" />
            <div>
              <p className="text-base font-bold text-[#2B2523]">Scanning RFP Document...</p>
              <p className="text-sm text-[#786F66] mt-1">Extracting eligibility clauses and compliance conditions</p>
            </div>
            {/* Progress bar */}
            <div className="max-w-sm mx-auto">
              <div className="w-full h-2.5 bg-[#E5E0DA] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#B3432E] rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-[#786F66] font-bold mt-2">{progress}% Complete</p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="py-10 space-y-5 text-center">
            <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">✓</span>
            </div>
            <div>
              <p className="text-xl font-extrabold text-[#2B2523]">Tender Scan Complete!</p>
              <p className="text-sm text-[#786F66] mt-1">AI extracted 2 eligibility conditions from the RFP document</p>
            </div>
            <button 
              onClick={handleClose}
              className="px-6 py-2.5 bg-[#B3432E] hover:bg-[#9E3824] text-white rounded-xl text-sm font-extrabold shadow-xs transition-colors"
            >
              Open Checklist Workstation →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
