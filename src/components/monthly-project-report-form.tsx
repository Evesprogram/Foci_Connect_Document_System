"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const ReportSection = ({ title, number, rows = 3 }: { title: string; number: number; rows?: number }) => (
    <div className="space-y-2">
        <h3 className="font-semibold">{number}. {title}</h3>
        <Textarea rows={rows} />
    </div>
);


export function MonthlyProjectReportForm() {
  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-2xl">MONTHLY / PROJECT REPORT</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Header Info */}
        <div className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="report-title">Report Title</Label>
                <Input id="report-title" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="prepared-by">Prepared By</Label>
                    <Input id="prepared-by" />
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" />
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="date-submitted">Date Submitted</Label>
                    <Input id="date-submitted" type="date" />
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="period-from">Report Period: From</Label>
                    <Input id="period-from" type="date" />
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="period-to">Report Period: To</Label>
                    <Input id="period-to" type="date" />
                </div>
            </div>
        </div>

        {/* Report Sections */}
        <div className="space-y-6 border-t pt-6">
            <ReportSection number={1} title="Executive Summary" />
            <ReportSection number={2} title="Key Achievements & Milestones" />
            <ReportSection number={3} title="Challenges Encountered & Resolutions" />
            <ReportSection number={4} title="Financial / Resource Summary (if applicable)" />
            <ReportSection number={5} title="Planned Activities for Next Period" />
        </div>

        {/* Approvals */}
        <div className="space-y-6 border-t pt-6">
            <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
                <h3 className="font-semibold">Prepared By</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="prep-name">Name</Label>
                        <Input id="prep-name" />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="prep-sig">Signature</Label>
                        <Input id="prep-sig" />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="prep-date">Date</Label>
                        <Input id="prep-date" type="date" />
                    </div>
                </div>
            </div>
             <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
                <h3 className="font-semibold">Reviewed By</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="rev-name">Name</Label>
                        <Input id="rev-name" />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="rev-sig">Signature</Label>
                        <Input id="rev-sig" />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="rev-date">Date</Label>
                        <Input id="rev-date" type="date" />
                    </div>
                </div>
            </div>
        </div>

      </CardContent>
       <CardFooter>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Submit Report</Button>
       </CardFooter>
    </Card>
  );
}
