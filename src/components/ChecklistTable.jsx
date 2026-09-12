import React, { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Layers,
  Filter,
  Check
} from 'lucide-react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

export default function ChecklistTable({ 
  tender, 
  requirements, 
  onAddRequirement, 
  onEditRequirement, 
  onDeleteRequirement,
  isApproved 
}) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  
  // Dialog state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Form states
  const [editingReq, setEditingReq] = useState(null);
  const [deletingReqId, setDeletingReqId] = useState(null);

  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('POLICY');
  const [formOperator, setFormOperator] = useState('>=');
  const [formValue, setFormValue] = useState('');
  const [formUnit, setFormUnit] = useState('%');
  const [formClause, setFormClause] = useState('');
  const [formPage, setFormPage] = useState('');

  const categories = ['ALL', 'POLICY', 'FINANCIAL', 'LEGAL', 'QUALITY', 'AUTHORIZATION', 'EXPERIENCE'];

  const filteredRequirements = selectedCategory === 'ALL'
    ? requirements
    : requirements.filter(r => r.category === selectedCategory);

  const handleOpenAdd = () => {
    setFormName('');
    setFormCategory('POLICY');
    setFormOperator('>=');
    setFormValue('50');
    setFormUnit('%');
    setFormClause('8.2');
    setFormPage('14');
    setIsAddOpen(true);
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const newReq = {
      requirement_id: `REQ_${Date.now().toString().slice(-4)}`,
      name: formName.trim(),
      category: formCategory,
      operator: formOperator,
      required_value: isNaN(Number(formValue)) ? formValue : Number(formValue),
      unit: formUnit.trim(),
      source: {
        clause: formClause.trim() || '1.0',
        page: Number(formPage) || 1
      },
      approved: true
    };

    onAddRequirement(tender.tender_id, newReq);
    setIsAddOpen(false);
  };

  const handleOpenEdit = (req) => {
    setEditingReq(req);
    setFormName(req.name);
    setFormCategory(req.category);
    setFormOperator(req.operator);
    setFormValue(req.required_value.toString());
    setFormUnit(req.unit);
    setFormClause(req.source.clause);
    setFormPage(req.source.page.toString());
    setIsEditOpen(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingReq || !formName.trim()) return;

    const updatedReq = {
      ...editingReq,
      name: formName.trim(),
      category: formCategory,
      operator: formOperator,
      required_value: isNaN(Number(formValue)) ? formValue : Number(formValue),
      unit: formUnit.trim(),
      source: {
        clause: formClause.trim(),
        page: Number(formPage) || 1
      }
    };

    onEditRequirement(tender.tender_id, editingReq.requirement_id, updatedReq);
    setIsEditOpen(false);
    setEditingReq(null);
  };

  const handleOpenDelete = (reqId) => {
    setDeletingReqId(reqId);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingReqId) {
      onDeleteRequirement(tender.tender_id, deletingReqId);
      setIsDeleteOpen(false);
      setDeletingReqId(null);
    }
  };

  const getCategoryBadgeVariant = (cat) => {
    switch (cat) {
      case 'POLICY': return 'maroon';
      case 'FINANCIAL': return 'info';
      case 'LEGAL': return 'warning';
      case 'QUALITY': return 'success';
      case 'AUTHORIZATION': return 'secondary';
      case 'EXPERIENCE': return 'outline';
      default: return 'secondary';
    }
  };

  const formatCondition = (req) => {
    const valDisplay = req.unit ? `${req.required_value} ${req.unit}` : req.required_value;
    return `${req.operator} ${valDisplay}`;
  };

  return (
    <div className="space-y-5">
      {/* Table Header & Category Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-[#786F66] flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-[#B3432E] text-white shadow-xs font-semibold'
                  : 'bg-white border border-[#E5E0DA] text-[#574E46] hover:bg-[#F3EFE9]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2 self-end sm:self-auto">
          <span className="text-xs text-[#786F66]">
            Showing <strong className="text-[#2B2523]">{filteredRequirements.length}</strong> of <strong>{requirements.length}</strong> clauses
          </span>
        </div>
      </div>

      {/* Checklist Table using shadcn Table */}
      <div className="bg-white rounded-xl border border-[#E5E0DA] overflow-hidden shadow-xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-center">#</TableHead>
              <TableHead className="w-[240px]">Requirement Name</TableHead>
              <TableHead className="w-[200px]">Condition / Expected Value</TableHead>
              <TableHead className="w-[180px]">Source Reference</TableHead>
              <TableHead className="w-[140px]">Category</TableHead>
              <TableHead className="text-right w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequirements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-[#786F66]">
                  No requirements found in category "{selectedCategory}".
                </TableCell>
              </TableRow>
            ) : (
              filteredRequirements.map((req, idx) => (
                <TableRow key={req.requirement_id} className="hover:bg-[#FAF6F0] transition-colors">
                  <TableCell className="text-center font-mono text-xs font-bold text-[#786F66]">
                    {idx + 1}
                  </TableCell>

                  <TableCell className="font-semibold text-sm text-[#2B2523]">
                    <div className="flex items-center space-x-2">
                      <span>{req.name}</span>
                      <span className="text-[10px] font-mono text-[#786F66]">({req.requirement_id})</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="font-semibold text-xs text-[#B3432E] bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200 inline-block">
                      {formatCondition(req)}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center space-x-1.5 text-xs text-[#574E46]">
                      <FileText className="w-3.5 h-3.5 text-[#786F66]" />
                      <span>Clause <strong className="text-[#2B2523]">{req.source.clause}</strong></span>
                      <span className="text-[#786F66]">•</span>
                      <span className="text-[#786F66]">Page {req.source.page}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant={getCategoryBadgeVariant(req.category)} className="text-[11px] px-2 py-0.5">
                      {req.category}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        disabled={isApproved}
                        onClick={() => handleOpenEdit(req)}
                        title="Edit Requirement"
                        className="h-8 w-8 text-[#786F66] hover:text-[#B3432E] hover:bg-rose-50"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        disabled={isApproved}
                        onClick={() => handleOpenDelete(req.requirement_id)}
                        title="Delete Requirement"
                        className="h-8 w-8 text-[#786F66] hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Add Requirement Row / Button at bottom */}
        <div className="p-3 bg-[#F8F5F0] border-t border-[#E5E0DA] flex items-center justify-between">
          <Button
            onClick={handleOpenAdd}
            disabled={isApproved}
            variant="outline"
            className="w-full sm:w-auto border-dashed border-[#B3432E]/40 text-[#B3432E] hover:bg-rose-50 hover:border-[#B3432E] flex items-center justify-center space-x-2 text-xs font-semibold py-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Manual Condition / Requirement</span>
          </Button>

          <span className="hidden sm:block text-xs text-[#786F66]">
            {isApproved ? 'Checklist is approved and locked' : 'Click + to add missed tender clause condition'}
          </span>
        </div>
      </div>

      {/* ADD REQUIREMENT DIALOG */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md border-[#E5E0DA]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-[#2B2523] flex items-center space-x-2">
              <Plus className="w-4 h-4 text-[#B3432E]" />
              <span>Add Eligibility Requirement</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-[#786F66]">
              Manually add a missed eligibility condition to tender checklist.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveAdd} className="space-y-4 py-2">
            <div>
              <label className="text-xs font-medium text-[#2B2523] block mb-1">Requirement Name</label>
              <Input
                required
                placeholder="e.g. Local Content Percentage"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[#2B2523] block mb-1">Category</label>
                <Select value={formCategory} onChange={(e) => setFormCategory(e.target.value)}>
                  {categories.filter(c => c !== 'ALL').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-[#2B2523] block mb-1">Operator</label>
                <Select value={formOperator} onChange={(e) => setFormOperator(e.target.value)}>
                  <option value=">=">&gt;= (At least)</option>
                  <option value="<=">&lt;= (Maximum)</option>
                  <option value="==">== (Exact match)</option>
                  <option value=">">&gt; (Greater than)</option>
                  <option value="<">&lt; (Less than)</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[#2B2523] block mb-1">Required Value</label>
                <Input
                  required
                  placeholder="e.g. 50"
                  value={formValue}
                  onChange={(e) => setFormValue(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#2B2523] block mb-1">Unit / Format</label>
                <Input
                  placeholder="e.g. %, Cr, Years, Valid"
                  value={formUnit}
                  onChange={(e) => setFormUnit(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[#2B2523] block mb-1">Clause Ref</label>
                <Input
                  placeholder="e.g. 8.2"
                  value={formClause}
                  onChange={(e) => setFormClause(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#2B2523] block mb-1">Page Number</label>
                <Input
                  type="number"
                  placeholder="e.g. 14"
                  value={formPage}
                  onChange={(e) => setFormPage(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-[#B3432E] hover:bg-[#9E3824] text-white">
                Save Requirement
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT REQUIREMENT DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md border-[#E5E0DA]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-[#2B2523] flex items-center space-x-2">
              <Edit3 className="w-4 h-4 text-[#B3432E]" />
              <span>Edit Requirement Rule</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-[#786F66]">
              Modify condition values or source clause details.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveEdit} className="space-y-4 py-2">
            <div>
              <label className="text-xs font-medium text-[#2B2523] block mb-1">Requirement Name</label>
              <Input
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[#2B2523] block mb-1">Category</label>
                <Select value={formCategory} onChange={(e) => setFormCategory(e.target.value)}>
                  {categories.filter(c => c !== 'ALL').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-[#2B2523] block mb-1">Operator</label>
                <Select value={formOperator} onChange={(e) => setFormOperator(e.target.value)}>
                  <option value=">=">&gt;= (At least)</option>
                  <option value="<=">&lt;= (Maximum)</option>
                  <option value="==">== (Exact match)</option>
                  <option value=">">&gt; (Greater than)</option>
                  <option value="<">&lt; (Less than)</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[#2B2523] block mb-1">Required Value</label>
                <Input
                  required
                  value={formValue}
                  onChange={(e) => setFormValue(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#2B2523] block mb-1">Unit / Format</label>
                <Input
                  value={formUnit}
                  onChange={(e) => setFormUnit(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[#2B2523] block mb-1">Clause Ref</label>
                <Input
                  value={formClause}
                  onChange={(e) => setFormClause(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#2B2523] block mb-1">Page Number</label>
                <Input
                  type="number"
                  value={formPage}
                  onChange={(e) => setFormPage(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-[#B3432E] hover:bg-[#9E3824] text-white">
                Update Requirement
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-sm border-[#E5E0DA]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-[#2B2523] flex items-center space-x-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span>Confirm Requirement Deletion</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-[#786F66] mt-2">
              Are you sure you want to remove this requirement from the compliance checklist? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-3">
            <Button variant="outline" size="sm" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" variant="destructive" onClick={handleConfirmDelete}>
              Delete Requirement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
