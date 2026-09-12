import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  PlusCircle, 
  Building2, 
  Calendar,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

export default function TendersListScreen({ tenders, onSelectTender, onStartNewScan, searchQuery, setSearchQuery }) {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');

  // Filter tenders list
  const filteredTenders = tenders.filter(tender => {
    const matchesSearch = 
      tender.tender_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tender.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tender.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || 
      (statusFilter === 'APPROVED' && tender.checklist_approved) ||
      (statusFilter === 'EVALUATION' && !tender.checklist_approved && tender.status === 'Under Evaluation') ||
      (statusFilter === 'DRAFT' && tender.status === 'Draft');

    const matchesDept = deptFilter === 'ALL' || tender.department === deptFilter;

    return matchesSearch && matchesStatus && matchesDept;
  });

  const departments = ['ALL', ...Array.from(new Set(tenders.map(t => t.department)))];

  const getStatusBadge = (status, approved) => {
    if (approved || status === 'Checklist Approved') {
      return <Badge variant="success" className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Checklist Approved</Badge>;
    }
    if (status === 'Under Evaluation') {
      return <Badge variant="warning" className="flex items-center gap-1"><Clock className="w-3 h-3" /> Under Evaluation</Badge>;
    }
    return <Badge variant="secondary" className="flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Draft</Badge>;
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#786F66] uppercase tracking-wider mb-1">
            <span>Tenders Directory</span>
            <span>•</span>
            <span className="text-[#B3432E]">GeM RFP Master Index</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#2B2523]">All Government Procurement Tenders</h1>
          <p className="text-sm text-[#786F66] mt-0.5">
            Search, filter, and inspect tender eligibility checklists across all active government buyers.
          </p>
        </div>

        <Button 
          onClick={onStartNewScan}
          className="bg-[#B3432E] hover:bg-[#9E3824] text-white shadow-sm flex items-center space-x-2 self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Tender Scan</span>
        </Button>
      </div>

      {/* Filter & Search Toolbar */}
      <Card className="border-[#E5E0DA] bg-white">
        <CardContent className="p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search bar inside toolbar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#786F66]" />
            <Input
              type="text"
              placeholder="Search by Tender ID, Title, or Department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs bg-[#FAF8F5] border-[#E5E0DA]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-[#786F66] font-medium">Status:</span>
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-9 text-xs">
                <option value="ALL">All Statuses</option>
                <option value="EVALUATION">Under Evaluation</option>
                <option value="APPROVED">Checklist Approved</option>
                <option value="DRAFT">Draft</option>
              </Select>
            </div>

            {/* Department Filter */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-[#786F66] font-medium">Department:</span>
              <Select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="h-9 text-xs">
                {departments.map(d => (
                  <option key={d} value={d}>{d === 'ALL' ? 'All Departments' : d}</option>
                ))}
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tenders Table */}
      <Card className="overflow-hidden border border-[#E5E0DA]">
        <div className="p-4 border-b border-[#E5E0DA] bg-[#F8F5F0] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-[#B3432E]" />
            <h3 className="text-sm font-bold text-[#2B2523]">GeM Tender Directory Index</h3>
            <Badge variant="secondary" className="text-xs">{filteredTenders.length} tenders listed</Badge>
          </div>
          <span className="text-xs text-[#786F66]">Click any tender row to inspect eligibility checklist</span>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[140px]">Tender ID</TableHead>
              <TableHead className="w-[320px]">Title & Est. Value</TableHead>
              <TableHead>Department / Buyer</TableHead>
              <TableHead className="text-center">Bids</TableHead>
              <TableHead>Submission Deadline</TableHead>
              <TableHead>Checklist Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTenders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-[#786F66]">
                  No tenders found matching current filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredTenders.map((tender) => (
                <TableRow
                  key={tender.tender_id}
                  onClick={() => onSelectTender(tender.tender_id)}
                  className="cursor-pointer hover:bg-[#FAF6F0] transition-colors group"
                >
                  <TableCell className="font-mono text-xs font-bold text-[#B3432E]">
                    {tender.tender_id}
                  </TableCell>

                  <TableCell>
                    <div className="font-medium text-[#2B2523] group-hover:text-[#B3432E] transition-colors">
                      {tender.title}
                    </div>
                    <div className="text-xs text-[#786F66] font-semibold mt-0.5">
                      Value: {tender.estimated_value}
                    </div>
                  </TableCell>

                  <TableCell className="text-xs text-[#574E46]">
                    <div className="flex items-center space-x-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#786F66]" />
                      <span>{tender.department}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <span className="font-bold text-xs text-[#2B2523] px-2.5 py-1 bg-[#F3EFE9] rounded-md">
                      {tender.bids_count}
                    </span>
                  </TableCell>

                  <TableCell className="text-xs text-[#786F66]">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-[#786F66]" />
                      <span>{tender.deadline}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    {getStatusBadge(tender.status, tender.checklist_approved)}
                  </TableCell>

                  <TableCell className="text-right">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-xs text-[#B3432E] hover:text-[#9E3824] hover:bg-rose-50"
                    >
                      <span>Open Checklist</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
