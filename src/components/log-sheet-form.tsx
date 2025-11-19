"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

const LogSheetRow = () => (
    <TableRow>
      <TableCell className="p-1"><Input type="date" className="h-8"/></TableCell>
      <TableCell className="p-1"><Input type="time" className="h-8"/></TableCell>
      <TableCell className="p-1"><Input type="time" className="h-8"/></TableCell>
      <TableCell className="p-1"><Input type="text" className="h-8 w-20" /></TableCell>
      <TableCell className="p-1"><Textarea className="min-h-[32px] h-8"/></TableCell>
      <TableCell className="p-1"><Textarea className="min-h-[32px] h-8"/></TableCell>
      <TableCell className="p-1"><Input type="text" className="h-8"/></TableCell>
    </TableRow>
  );

export function LogSheetForm() {
  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-2xl">EMPLOYEE DAILY / WEEKLY LOG SHEET</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Header Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="month-year">Month/Year</Label>
            <Input id="month-year" placeholder="e.g., July 2024" />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="project-site">Project/Site</Label>
            <Input id="project-site" placeholder="Project or Site Name" />
          </div>
        </div>

        {/* Employee Info */}
        <div className="space-y-4 border-t pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="employee-name">Employee Name</Label>
                    <Input id="employee-name" placeholder="Your Full Name" />
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="employee-id">Employee ID</Label>
                    <Input id="employee-id" placeholder="Your Employee ID" />
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" placeholder="Your Role" />
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" placeholder="Your Department" />
                </div>
            </div>
        </div>

        {/* Log Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[130px]">Date</TableHead>
                <TableHead className="w-[110px]">Time In</TableHead>
                <TableHead className="w-[110px]">Time Out</TableHead>
                <TableHead className="w-[100px]">Total Hours</TableHead>
                <TableHead>Role / Tasks Performed / Project Code / Location</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead className="w-[150px]">Employee Signature</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 7 }).map((_, index) => (
                <LogSheetRow key={index} />
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Total Hours */}
        <div className="flex justify-end items-center gap-4 pt-4 border-t">
            <Label htmlFor="total-hours" className="font-bold">Total Hours this Period:</Label>
            <Input id="total-hours" className="w-32" />
        </div>


        {/* Declarations & Approvals */}
        <div className="space-y-6 border-t pt-6">
            <div className="space-y-4">
                <h3 className="font-semibold">Employee Declaration</h3>
                <p className="text-sm text-muted-foreground">I confirm the above information is correct.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                     <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="employee-signature">Signature</Label>
                        <Input id="employee-signature" placeholder="Type your name for digital signature" />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="employee-sig-date">Date</Label>
                        <Input id="employee-sig-date" type="date" />
                    </div>
                </div>
            </div>
             <div className="space-y-6 rounded-lg border bg-muted/50 p-4 mt-6">
                <h3 className="font-semibold">Supervisor / Manager Verification</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="sup-name">Name</Label>
                        <Input id="sup-name" />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="sup-role">Role</Label>
                        <Input id="sup-role" />
                    </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="sup-signature">Signature</Label>
                        <Input id="sup-signature" />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="sup-sig-date">Date</Label>
                        <Input id="sup-sig-date" type="date" />
                    </div>
                </div>
                 <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="sup-comments">Comments (if any)</Label>
                    <Textarea id="sup-comments" rows={3}/>
                </div>
            </div>
        </div>

      </CardContent>
       <CardFooter>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Submit Log Sheet</Button>
       </CardFooter>
    </Card>
  );
}
