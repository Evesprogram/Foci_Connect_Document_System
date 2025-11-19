import { PageHeader } from '@/components/page-header';
import { MemorandumForm } from '@/components/memorandum-form';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <PageHeader />
      <main className="flex-1 container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <MemorandumForm />
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
  );
}
