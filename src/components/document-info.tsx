"use client";

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function DocumentInfo() {
  const [docNo, setDocNo] = React.useState('FG-APP-001');
  const [date, setDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [rev, setRev] = React.useState('00');
  const [page, setPage] = React.useState('1');
  const [pageTotal, setPageTotal] = React.useState('1');

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="grid w-full max-w-[200px] items-center gap-1.5">
            <Label htmlFor="doc-no">Document No</Label>
            <Input id="doc-no" value={docNo} onChange={(e) => setDocNo(e.target.value)} />
          </div>
          <div className="grid w-full max-w-[150px] items-center gap-1.5">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="grid w-full max-w-[80px] items-center gap-1.5">
            <Label htmlFor="rev">Rev</Label>
            <Input id="rev" value={rev} onChange={(e) => setRev(e.target.value)} />
          </div>
          <div className="flex items-end gap-2">
            <div className="grid w-full max-w-[80px] items-center gap-1.5">
              <Label htmlFor="page">Page</Label>
              <Input id="page" value={page} onChange={(e) => setPage(e.target.value)} />
            </div>
            <span className="pb-2 text-muted-foreground">of</span>
            <div className="grid w-full max-w-[80px] items-center gap-1.5">
              <Label htmlFor="page-total" className="text-muted-foreground">Total</Label>
              <Input id="page-total" value={pageTotal} onChange={(e) => setPageTotal(e.target.value)} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
