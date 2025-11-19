import { PageHeader } from '@/components/page-header';
import { DocumentInfo } from '@/components/document-info';
import { ServiceShowcase } from '@/components/service-showcase';
import { Summarizer } from '@/components/summarizer';
import { ContactForm } from '@/components/contact-form';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <PageHeader />
      <main className="flex-1 container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          <DocumentInfo />
          <ServiceShowcase />
          <Summarizer />
          <ContactForm />
        </div>
      </main>
      <footer className="py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} FOCI GROUP (Pty) Ltd. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
