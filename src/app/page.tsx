
import { Suspense } from 'react';
import { PageContent } from './page-content';

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}

