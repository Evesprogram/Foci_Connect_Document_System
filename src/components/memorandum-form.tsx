"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const MemoInputRow = ({ label, id }: { label: string; id: string }) => (
    <div className="flex items-center gap-4">
        <Label htmlFor={id} className="w-20 text-right">{label}:</Label>
        <Input id={id} />
    </div>
);

export function MemorandumForm() {
  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-2xl tracking-wider">MEMORANDUM</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
            <MemoInputRow label="To" id="to" />
            <MemoInputRow label="From" id="from" />
            <MemoInputRow label="Date" id="date" />
            <MemoInputRow label="Subject" id="subject" />
        </div>
        
        <div className="border-t pt-6">
            <Textarea rows={10} />
        </div>

        <div className="space-y-2">
            <Label htmlFor="action-required">Action Required:</Label>
            <Input id="action-required" />
        </div>

      </CardContent>
       <CardFooter className="flex justify-end border-t pt-6">
            <div className="flex items-center gap-6">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="signature">Signature</Label>
                    <Input id="signature" />
                </div>
                 <div className="grid w-full max-w-xs items-center gap-1.5">
                    <Label htmlFor="signature-date">Date</Label>
                    <Input id="signature-date" type="date" />
                </div>
            </div>
       </CardFooter>
    </Card>
  );
}
