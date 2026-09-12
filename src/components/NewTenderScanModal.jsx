import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, UploadCloud, FileText, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';

export default function NewTenderScanModal({ open, onOpenChange, onAddNewTender }) {
  const [step, setStep] = useState(1); // 1: Input details, 2: Scanning simulation, 3: Completed
  const [tenderTitle, setTenderTitle] = useState('');
  const [department, setDepartment] = useState('Ministry of Education');
  const [estimatedValue, setEstimatedValue] = useState('₹ 6.50 Crore');
  const [progress, setProgress] = useState(0);
  const [currentActionText, setCurrentActionText] = useState('');

  const handleStartScan = (e) => {
    e.preventDefault();
    if (!tenderTitle.trim()) return;

    setStep(2);
    setProgress(15);
    setCurrentActionText('Step 1/3: Reading uploaded GeM RFP PDF document...');

    setTimeout(() => {
      setProgress(45);
      setCurrentActionText('Step 2/3: Running AI NLP Clause Extractor on 18 pages...');
    }, 1200);

    setTimeout(() => {
      setProgress(85);
      setCurrentActionText('Step 3/3: Mapping eligibility requirements & clause references...');
    }, 2400);

    setTimeout(() => {
      setProgress(100);
      setCurrentActionText('Extraction Complete!');
      
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
          },
          {
            requirement_id: `REQ_${Date.now()}_3`,
            name: "Past Execution Experience",
            category: "EXPERIENCE",
            operator: ">=",
            required_value: 3,
            unit: "Years",
            source: { clause: "7.1", page: 15 },
            approved: true
          }
        ]
      };

      onAddNewTender(newTender);
      setStep(3);
    }, 3600);
  };

  const handleClose = () => {
    setStep(1);
    setProgress(0);
    setTenderTitle('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg border-[#E5E0DA]">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-[#2B2523] flex items-center space-x-2">
            <PlusCircle className="w-5 h-5 text-[#B3432E]" />
            <span>New Tender Scan & Extraction</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-[#786F66]">
            Upload a new GeM RFP document to automatically extract eligibility checklist conditions using AI.
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <form onSubmit={handleStartScan} className="space-y-4 py-2">
            <div>
              <label className="text-xs font-medium text-[#2B2523] block mb-1">Tender Title / Name</label>
              <Input
                required
                placeholder="e.g. Supply of Interactive Smart Classroom Panels"
                value={tenderTitle}
                onChange={(e) => setTenderTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[#2B2523] block mb-1">Ministry / Dept</label>
                <Input
                  required
                  placeholder="e.g. Ministry of Education"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#2B2523] block mb-1">Est. Tender Value</label>
                <Input
                  required
                  placeholder="e.g. ₹ 6.50 Crore"
                  value={estimatedValue}
                  onChange={(e) => setEstimatedValue(e.target.value)}
                />
              </div>
            </div>

            {/* Drag & Drop Simulation */}
            <div className="border-2 border-dashed border-[#E5E0DA] bg-[#FAF8F5] rounded-xl p-6 text-center space-y-2 hover:border-[#B3432E] transition-colors cursor-pointer">
              <UploadCloud className="w-8 h-8 text-[#B3432E] mx-auto" />
              <p className="text-xs font-semibold text-[#2B2523]">
                Click or drag tender PDF document here
              </p>
              <p className="text-[11px] text-[#786F66]">
                Supports GeM RFP PDFs up to 50MB (automatic OCR & clause parsing)
              </p>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-[#B3432E] hover:bg-[#9E3824] text-white">
                Start AI Scan
              </Button>
            </DialogFooter>
          </form>
        )}

        {step === 2 && (
          <div className="py-8 space-y-6 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-[#B3432E] flex items-center justify-center mx-auto border border-rose-200">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-[#2B2523]">Processing Tender Document</h3>
              <p className="text-xs text-[#786F66] font-mono">{currentActionText}</p>
            </div>

            <div className="px-6 space-y-1">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-[10px] text-[#786F66]">
                <span>Uploading</span>
                <span>Extracting Clauses</span>
                <span>{progress}%</span>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="py-6 space-y-5 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#2B2523]">Tender Scan Complete!</h3>
              <p className="text-xs text-[#786F66]">
                Successfully extracted eligibility criteria and created checklist.
              </p>
            </div>

            <DialogFooter className="pt-2 flex justify-center sm:justify-center">
              <Button size="sm" onClick={handleClose} className="bg-[#B3432E] hover:bg-[#9E3824] text-white">
                Open Checklist Workstation
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
