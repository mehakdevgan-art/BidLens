import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, CheckCircle, Search, ExternalLink } from 'lucide-react';
import { MOCK_TENDER_DOCUMENT } from '@/data/mockData';

export default function TenderDocModal({ open, onOpenChange, tender }) {
  const doc = MOCK_TENDER_DOCUMENT;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-0 overflow-hidden border-[#E5E0DA]">
        {/* Header */}
        <div className="p-6 bg-[#F8F5F0] border-b border-[#E5E0DA]">
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#B3432E] uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>GeM Tender Document Viewer</span>
          </div>
          <DialogTitle className="text-lg font-bold text-[#2B2523] mt-1">
            {tender ? tender.title : doc.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-[#786F66] mt-1">
            Tender Reference: <span className="font-mono font-bold text-[#B3432E]">{tender?.tender_id || 'GEM/2024/001'}</span> • Published 2026-08-28
          </DialogDescription>
        </div>

        {/* Clauses Document Viewer Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[60vh] bg-[#FAF8F5]">
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs text-[#B3432E]">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4.5 h-4.5 text-[#B3432E] shrink-0" />
              <span className="font-semibold text-xs text-[#9E3824]">AI Clause Extraction Engine scanned 24 PDF pages and identified 7 eligibility conditions.</span>
            </div>
            <Badge variant="maroon" className="text-[11px] px-2 py-0.5 font-bold">98.4% Confidence</Badge>
          </div>

          <div className="space-y-4">
            {doc.clauses.map((clause, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-[#E5E0DA] rounded-xl p-5 space-y-3 hover:border-[#B3432E]/30 transition-all shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="font-sans text-xs font-bold bg-[#F3EFE9] text-[#2B2523]">
                      Clause {clause.clause}
                    </Badge>
                    <span className="text-xs font-semibold text-[#786F66]">Page {clause.page}</span>
                  </div>
                  <Badge variant="outline" className="text-[11px] font-semibold text-[#B3432E] border-rose-200 bg-rose-50">
                    Extracted Condition
                  </Badge>
                </div>
                <h4 className="text-base font-bold text-[#1C1917] tracking-tight">{clause.title}</h4>
                <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E5E0DA] text-sm text-[#1C1917] font-sans leading-relaxed tracking-normal">
                  "{clause.text}"
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="p-4 bg-[#F8F5F0] border-t border-[#E5E0DA] flex items-center justify-between sm:justify-between">
          <div className="text-xs text-[#786F66]">
            Showing 7 parsed clauses from original tender PDF
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} className="text-xs">
              Close Preview
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
