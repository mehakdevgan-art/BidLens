import React, { useState } from 'react';
import { INITIAL_TENDERS } from '@/data/mockData';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import DashboardScreen from '@/components/DashboardScreen';
import TendersListScreen from '@/components/TendersListScreen';
import TenderOverviewScreen from '@/components/TenderOverviewScreen';
import NewTenderScanModal from '@/components/NewTenderScanModal';

export default function App() {
  // Top-Level Lifted State for persistence across views
  const [tenders, setTenders] = useState(INITIAL_TENDERS);
  const [activeTenderId, setActiveTenderId] = useState('GEM/2024/001');
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' | 'tenders' | 'tender_overview'
  const [searchQuery, setSearchQuery] = useState('');
  const [scanModalOpen, setScanModalOpen] = useState(false);

  // Active tender object
  const activeTender = tenders.find(t => t.tender_id === activeTenderId) || tenders[0];

  // Navigation handlers
  const handleSelectTender = (tenderId) => {
    setActiveTenderId(tenderId);
    setCurrentView('tender_overview');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  // Requirement Handlers (Persisted in Top-Level State)
  const handleAddRequirement = (tenderId, newReq) => {
    setTenders(prevTenders =>
      prevTenders.map(tender => {
        if (tender.tender_id === tenderId) {
          return {
            ...tender,
            requirements: [...tender.requirements, newReq],
            last_updated: 'Just Now'
          };
        }
        return tender;
      })
    );
  };

  const handleEditRequirement = (tenderId, reqId, updatedReq) => {
    setTenders(prevTenders =>
      prevTenders.map(tender => {
        if (tender.tender_id === tenderId) {
          return {
            ...tender,
            requirements: tender.requirements.map(req =>
              req.requirement_id === reqId ? updatedReq : req
            ),
            last_updated: 'Just Now'
          };
        }
        return tender;
      })
    );
  };

  const handleDeleteRequirement = (tenderId, reqId) => {
    setTenders(prevTenders =>
      prevTenders.map(tender => {
        if (tender.tender_id === tenderId) {
          return {
            ...tender,
            requirements: tender.requirements.filter(req => req.requirement_id !== reqId),
            last_updated: 'Just Now'
          };
        }
        return tender;
      })
    );
  };

  const handleApproveChecklist = (tenderId, approvedState = true) => {
    setTenders(prevTenders =>
      prevTenders.map(tender => {
        if (tender.tender_id === tenderId) {
          return {
            ...tender,
            checklist_approved: approvedState,
            status: approvedState ? 'Checklist Approved' : 'Under Evaluation',
            last_updated: 'Just Now'
          };
        }
        return tender;
      })
    );
  };

  const handleAddNewTender = (newTender) => {
    setTenders(prev => [newTender, ...prev]);
    setActiveTenderId(newTender.tender_id);
    setCurrentView('tender_overview');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-row">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        activeTender={activeTender}
        onStartNewScan={() => setScanModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          onStartNewScan={() => setScanModalOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <main className="flex-1 overflow-y-auto">
          {currentView === 'dashboard' && (
            <DashboardScreen
              tenders={tenders}
              onSelectTender={handleSelectTender}
              searchQuery={searchQuery}
            />
          )}

          {currentView === 'tenders' && (
            <TendersListScreen
              tenders={tenders}
              onSelectTender={handleSelectTender}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          )}

          {currentView === 'tender_overview' && (
            <TenderOverviewScreen
              tender={activeTender}
              onBackToDashboard={handleBackToDashboard}
              onAddRequirement={handleAddRequirement}
              onEditRequirement={handleEditRequirement}
              onDeleteRequirement={handleDeleteRequirement}
              onApproveChecklist={handleApproveChecklist}
            />
          )}

          {currentView === 'audit_trail' && (
            <div className="p-8 max-w-7xl mx-auto space-y-4">
              <h1 className="text-xl font-bold text-[#2B2523]">Audit Trail Log</h1>
              <div className="border border-[#E5E0DA] bg-white rounded-xl p-8 text-center text-xs text-[#786F66]">
                Audit Trail & Officer Action Logs module (Teammate Scope). Select Dashboard or Tenders to navigate back.
              </div>
            </div>
          )}

          {currentView === 'settings' && (
            <div className="p-8 max-w-7xl mx-auto space-y-4">
              <h1 className="text-xl font-bold text-[#2B2523]">Workstation Settings</h1>
              <div className="border border-[#E5E0DA] bg-white rounded-xl p-8 text-center text-xs text-[#786F66]">
                GeM Compliance Engine & Notification Settings. Select Dashboard or Tenders to navigate back.
              </div>
            </div>
          )}
        </main>
      </div>

      {/* New Tender Scan Simulation Modal */}
      <NewTenderScanModal
        open={scanModalOpen}
        onOpenChange={setScanModalOpen}
        onAddNewTender={handleAddNewTender}
      />
    </div>
  );
}
