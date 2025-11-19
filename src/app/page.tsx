
"use client";

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { MemorandumForm } from '@/components/memorandum-form';
import { LeaveApplicationForm } from '@/components/leave-application-form';
import { LogSheetForm } from '@/components/log-sheet-form';
import { ProjectReportForm } from '@/components/project-report-form';
import { Button } from '@/components/ui/button';
import { Sheet, Menu } from 'lucide-react';

type DocumentType = 'memorandum' | 'leave' | 'log' | 'report';

const NavButton = ({ active, onClick, children }: { active: boolean, onClick: () => void, children: React.ReactNode }) => (
  <Button
    variant={active ? 'secondary' : 'ghost'}
    onClick={onClick}
    className="w-full justify-start"
  >
    {children}
  </Button>
);

export default function Home() {
  const [activeDocument, setActiveDocument] = useState<DocumentType>('memorandum');

  const renderActiveDocument = () => {
    switch (activeDocument) {
      case 'memorandum':
        return <MemorandumForm />;
      case 'leave':
        return <LeaveApplicationForm />;
      case 'log':
        return <LogSheetForm />;
      case 'report':
        return <ProjectReportForm />;
      default:
        return <MemorandumForm />;
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col gap-4 p-4">
          <h2 className="text-lg font-semibold tracking-tight">Documents</h2>
          <NavButton active={activeDocument === 'memorandum'} onClick={() => setActiveDocument('memorandum')}>
            <Sheet className="mr-2 h-4 w-4" />
            Memorandum
          </NavButton>
          <NavButton active={activeDocument === 'leave'} onClick={() => setActiveDocument('leave')}>
             <Sheet className="mr-2 h-4 w-4" />
            Leave Application
          </NavButton>
          <NavButton active={activeDocument === 'log'} onClick={() => setActiveDocument('log')}>
             <Sheet className="mr-2 h-4 w-4" />
            Log Sheet
          </NavButton>
          <NavButton active={activeDocument === 'report'} onClick={() => setActiveDocument('report')}>
            <Sheet className="mr-2 h-4 w-4" />
            Project Report
          </NavButton>
        </nav>
      </aside>
      <div className="flex flex-col sm:ml-60">
        <PageHeader />
        <main className="flex-1 container mx-auto px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-12">
            {renderActiveDocument()}
          </div>
        </main>
        <footer className="py-6 border-t bg-card">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-xs text-muted-foreground space-y-2">
            <p className="font-bold">Controlled Disclosure</p>
            <p>
              When downloaded or printed from the Foci Group Document Management System, this document is uncontrolled and the responsibility rests with the user to ensure it is in line with the authorized version on the system.
            </p>
            <div className="flex justify-between items-center">
              <span>© FOCI GROUP 2025 – All rights reserved</span>
              <span>File Ref: __________________</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
