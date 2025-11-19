import { FociLogo } from '@/components/foci-logo';

export function PageHeader() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between items-center py-6 gap-6">
          <div className="flex-shrink-0">
            <FociLogo className="h-10 w-auto md:h-12" />
          </div>
          <div className="flex flex-wrap gap-x-12 gap-y-4 text-sm text-muted-foreground">
            <div>
              <h3 className="font-bold text-foreground mb-1">Physical Address:</h3>
              <p>152 Dallas Avenue</p>
              <p>Waterkloof Glen</p>
              <p>Pretoria, 0010</p>
              <p className="text-xs mt-1">Located in: Corobay Corner</p>
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-1">Contact Details:</h3>
              <p>Tel: +27 12 943 6048</p>
              <p>Email: info@foci.group</p>
              <p>Web: www.foci.group</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
