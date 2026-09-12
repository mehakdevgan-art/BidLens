import React from 'react';
import { 
  FileText, 
  Users, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  Filter, 
  PlusCircle, 
  Sparkles,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function DashboardScreen({ tenders, onSelectTender, onStartNewScan, searchQuery }) {
  // Filter tenders based on search query
  const filteredTenders = tenders.filter(t => 
    t.tender_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeTendersCount = tenders.length;
  const totalBidsCount = tenders.reduce((acc, t) => acc + t.bids_count, 0);
  const underEvaluationCount = tenders.filter(t => t.status === 'Under Evaluation').length;
  const pendingReviewCount = tenders.filter(t => !t.checklist_approved).length;

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
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#786F66] uppercase tracking-wider mb-1">
            <span>GeM Procurement Portal</span>
            <span>•</span>
            <span className="text-[#B3432E]">Officer Workstation</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#2B2523]">Procurement Overview & Active Tenders</h1>
          <p className="text-sm text-[#786F66] mt-0.5">
            Monitor tender eligibility compliance, review AI-extracted criteria, and approve checklists for evaluation.
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

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="hover:border-[#B3432E]/30 transition-all cursor-default">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#786F66] uppercase tracking-wider">Active Tenders</span>
              <div className="p-2 bg-[#F3EFE9] rounded-lg text-[#2B2523]">
                <FileText className="w-4 h-4 text-[#B3432E]" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold tracking-tight text-[#2B2523]">{activeTendersCount}</span>
              <span className="text-xs font-medium text-emerald-600 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> +2 this week
              </span>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-[11px] text-[#786F66] mb-1">
                <span>Active Workloads</span>
                <span>85% Capacity</span>
              </div>
              <Progress value={85} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-[#B3432E]/30 transition-all cursor-default">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#786F66] uppercase tracking-wider">Bids Received</span>
              <div className="p-2 bg-[#F3EFE9] rounded-lg text-[#2B2523]">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold tracking-tight text-[#2B2523]">{totalBidsCount}</span>
              <span className="text-xs font-medium text-[#786F66]">bidders logged</span>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-[11px] text-[#786F66] mb-1">
                <span>Verification Rate</span>
                <span>92% verified</span>
              </div>
              <Progress value={92} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 hover:border-r hover:border-t hover:border-b hover:border-[#E5E0DA] transition-all cursor-default">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#786F66] uppercase tracking-wider">Under Evaluation</span>
              <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold tracking-tight text-[#2B2523]">{underEvaluationCount}</span>
              <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded font-semibold">Action Required</span>
            </div>
            <p className="text-xs text-[#786F66] mt-3">Requires officer compliance verification</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#B3432E] hover:border-r hover:border-t hover:border-b hover:border-[#E5E0DA] transition-all cursor-default">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#786F66] uppercase tracking-wider">Pending Review</span>
              <div className="p-2 bg-rose-50 rounded-lg text-[#B3432E]">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold tracking-tight text-[#B3432E]">{pendingReviewCount}</span>
              <span className="text-xs font-medium text-[#B3432E]">Checklists</span>
            </div>
            <p className="text-xs text-[#786F66] mt-3">Awaiting officer checklist approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Recent Tenders Table */}
      <Card className="overflow-hidden border border-[#E5E0DA]">
        <div className="p-5 border-b border-[#E5E0DA] bg-[#F8F5F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-[#2B2523] flex items-center space-x-2">
              <span>Recent Tenders</span>
              <Badge variant="secondary" className="text-xs">{filteredTenders.length} total</Badge>
            </h2>
            <p className="text-xs text-[#786F66]">Select any tender row to open its eligibility compliance checklist</p>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="text-xs bg-white flex items-center space-x-1.5 border-[#E5E0DA]">
              <Filter className="w-3.5 h-3.5 text-[#786F66]" />
              <span>Filter Status</span>
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[140px]">Tender ID</TableHead>
              <TableHead className="w-[320px]">Title</TableHead>
              <TableHead>Department</TableHead>
              <TableHead className="text-center">Bids</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTenders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-[#786F66]">
                  No tenders found matching "{searchQuery}".
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
                    <div className="font-medium text-[#2B2523] line-clamp-1 group-hover:text-[#B3432E] transition-colors">
                      {tender.title}
                    </div>
                    <div className="text-[11px] text-[#786F66]">Est. Value: {tender.estimated_value}</div>
                  </TableCell>
                  <TableCell className="text-xs text-[#574E46]">
                    {tender.department}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-semibold text-xs text-[#2B2523] px-2 py-0.5 bg-[#F3EFE9] rounded-md">
                      {tender.bids_count}
                    </span>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(tender.status, tender.checklist_approved)}
                  </TableCell>
                  <TableCell className="text-xs text-[#786F66]">
                    {tender.last_updated}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-xs text-[#B3432E] hover:text-[#9E3824] hover:bg-rose-50 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Review</span>
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
