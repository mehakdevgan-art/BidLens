import React, { useState } from 'react';
import { 
  ChevronLeft, 
  FileText, 
  Calendar, 
  Building2, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  Unlock, 
  ExternalLink,
  Info,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
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
      // Toggle unlock if officer wants to re-edit
      onApproveChecklist(tender.tender_id, false);
    } else {
      setConfirmApproveOpen(true);
    }
  };

  const handleConfirmApproval = () => {
    onApproveChecklist(tender.tender_id, true);
    setConfirmApproveOpen(false);
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs font-medium text-[#786F66]">
          <button 
            onClick={onBackToDashboard}
            className="flex items-center space-x-1 hover:text-[#B3432E] transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Tenders</span>
          </button>
          <span>/</span>
          <span className="font-mono font-bold text-[#B3432E]">{tender.tender_id}</span>
          <span>/</span>
          <span className="text-[#2B2523] font-semibold">Compliance Checklist</span>
        </div>

        <Badge variant="outline" className="text-xs border-[#E5E0DA] bg-white text-[#786F66]">
          GeM Reference: {tender.tender_id}
        </Badge>
      </div>

      {/* Tender Header Card */}
      <Card className="border-[#E5E0DA] bg-white overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#B3432E] bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  {tender.tender_id}
                </span>
                {isApproved ? (
                  <Badge variant="success" className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Checklist Approved & Locked
                  </Badge>
                ) : (
                  <Badge variant="warning" className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Pending Officer Approval
                  </Badge>
                )}
                <Badge variant="secondary" className="text-xs">{tender.department}</Badge>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#2B2523]">
                {tender.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[#786F66]">
                <div className="flex items-center space-x-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#786F66]" />
                  <span>Buyer: <strong className="text-[#2B2523]">{tender.department}</strong></span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#786F66]" />
                  <span>Published: <strong className="text-[#2B2523]">{tender.published_date}</strong></span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Deadline: <strong className="text-[#2B2523]">{tender.deadline}</strong></span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-semibold text-[#2B2523]">Est Value: {tender.estimated_value}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons Header */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDocModalOpen(true)}
                className="text-xs flex items-center space-x-2 border-[#E5E0DA] bg-white hover:bg-[#FAF8F5]"
              >
                <FileText className="w-4 h-4 text-[#B3432E]" />
                <span>View Tender Document</span>
              </Button>

              <Button
                size="sm"
                disabled={reqCount === 0}
                onClick={handleApproveClick}
                className={`text-xs font-semibold flex items-center space-x-2 transition-all ${
                  isApproved
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                    : 'bg-[#B3432E] hover:bg-[#9E3824] text-white shadow-sm'
                }`}
              >
                {isApproved ? (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Checklist Approved ✓</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve Checklist</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Horizontal Step Progress Tracker */}
      <Card className="border-[#E5E0DA] bg-[#F8F5F0]">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="flex items-center space-x-3 p-2 bg-white rounded-lg border border-[#E5E0DA]">
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                ✓
              </div>
              <div>
                <p className="font-bold text-[#2B2523]">Step 1: Document Upload</p>
                <p className="text-[11px] text-[#786F66]">GeM PDF Parsing Completed</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-2 bg-white rounded-lg border border-[#E5E0DA]">
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                ✓
              </div>
              <div>
                <p className="font-bold text-[#2B2523]">Step 2: AI Clause Extraction</p>
                <p className="text-[11px] text-[#786F66]">{reqCount} Eligibility Rules Extracted</p>
              </div>
            </div>

            <div className={`flex items-center space-x-3 p-2 rounded-lg border ${
              isApproved 
                ? 'bg-emerald-50 border-emerald-200' 
                : 'bg-rose-50 border-rose-200'
            }`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                isApproved 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-[#B3432E] text-white animate-pulse'
              }`}>
                {isApproved ? '✓' : '3'}
              </div>
              <div>
                <p className={`font-bold ${isApproved ? 'text-emerald-800' : 'text-[#B3432E]'}`}>
                  Step 3: Officer Approval
                </p>
                <p className="text-[11px] text-[#786F66]">
                  {isApproved ? 'Approved by Officer Mehak' : 'Awaiting Final Review'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs Container */}
      <Tabs defaultValue="checklist" className="w-full">
        <div className="flex items-center justify-between border-b border-[#E5E0DA] pb-2">
          <TabsList className="bg-[#F3EFE9]">
            <TabsTrigger value="checklist" className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Compliance Checklist ({reqCount})</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Raw Tender Documents</span>
            </TabsTrigger>
          </TabsList>

          <div className="hidden sm:flex items-center space-x-2 text-xs text-[#786F66]">
            <Sparkles className="w-3.5 h-3.5 text-[#B3432E]" />
            <span>AI Extraction Confidence: <strong className="text-[#2B2523]">98.4%</strong></span>
          </div>
        </div>

        {/* Tab 1: Compliance Checklist */}
        <TabsContent value="checklist" className="mt-4">
          <ChecklistTable
            tender={tender}
            requirements={tender.requirements}
            onAddRequirement={onAddRequirement}
            onEditRequirement={onEditRequirement}
            onDeleteRequirement={onDeleteRequirement}
            isApproved={isApproved}
          />
        </TabsContent>

        {/* Tab 2: Documents Tab */}
        <TabsContent value="documents" className="mt-4 space-y-4">
          <Card className="border-[#E5E0DA] bg-white p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#2B2523]">Uploaded GeM RFP Documents</h3>
                <p className="text-xs text-[#786F66]">Uploaded tender PDF specifications and clause references</p>
              </div>
              <Button size="sm" onClick={() => setDocModalOpen(true)} className="bg-[#B3432E] text-white text-xs">
                Launch Full Document Reader
              </Button>
            </div>

            <div className="border border-[#E5E0DA] rounded-lg divide-y divide-[#E5E0DA]">
              <div className="p-4 flex items-center justify-between bg-[#FAF8F5]">
                <div className="flex items-center space-x-3">
                  <FileText className="w-6 h-6 text-[#B3432E]" />
                  <div>
                    <p className="text-sm font-semibold text-[#2B2523]">Tender_Specification_GEM_2024_001.pdf</p>
                    <p className="text-xs text-[#786F66]">24 Pages • 4.2 MB • Uploaded 2026-08-28</p>
                  </div>
                </div>
                <Badge variant="success">Parsed & Indexed</Badge>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="text-sm font-semibold text-[#2B2523]">Special_Conditions_Of_Contract.pdf</p>
                    <p className="text-xs text-[#786F66]">8 Pages • 1.1 MB • Uploaded 2026-08-28</p>
                  </div>
                </div>
                <Badge variant="secondary">Supplementary</Badge>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Tender Document Modal */}
      <TenderDocModal
        open={docModalOpen}
        onOpenChange={setDocModalOpen}
        tender={tender}
      />

      {/* APPROVE CHECKLIST CONFIRMATION DIALOG */}
      <Dialog open={confirmApproveOpen} onOpenChange={setConfirmApproveOpen}>
        <DialogContent className="sm:max-w-md border-[#E5E0DA]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-[#2B2523] flex items-center space-x-2 text-[#B3432E]">
              <ShieldCheck className="w-5 h-5" />
              <span>Approve Eligibility Checklist</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-[#786F66] mt-1">
              You are approving <strong className="text-[#2B2523]">{reqCount} eligibility requirements</strong> for tender <span className="font-mono text-[#B3432E]">{tender.tender_id}</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span>Officer Compliance Certification</span>
            </div>
            <p className="text-[11px] text-amber-800">
              Once approved, these criteria will be used to evaluate incoming bidder documents on GeM portal.
            </p>
          </div>

          <DialogFooter className="pt-3">
            <Button variant="outline" size="sm" onClick={() => setConfirmApproveOpen(false)}>
              Back to Review
            </Button>
            <Button size="sm" onClick={handleConfirmApproval} className="bg-[#B3432E] hover:bg-[#9E3824] text-white">
              Confirm & Approve Checklist ✓
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
