"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export function LeaveApplicationForm() {
  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-2xl">LEAVE APPLICATION FORM</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Employee Info */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="application-date">Application Date</Label>
              <Input id="application-date" type="date" />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="employee-id">Employee ID</Label>
              <Input id="employee-id" placeholder="Your Employee ID" />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="employee-name">Employee Name</Label>
              <Input id="employee-name" placeholder="Your Full Name" />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="department">Department</Label>
              <Input id="department" placeholder="Your Department" />
            </div>
          </div>
        </div>

        {/* Leave Type */}
        <div className="space-y-4">
          <Label>Type of Leave Requested</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="annual" />
              <Label htmlFor="annual" className="font-normal">Annual Leave</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="sick" />
              <Label htmlFor="sick" className="font-normal">Sick Leave</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="family" />
              <Label htmlFor="family" className="font-normal">Family Responsibility</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="maternity" />
              <Label htmlFor="maternity" className="font-normal">Maternity/Paternity</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="study" />
              <Label htmlFor="study" className="font-normal">Study</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="unpaid" />
              <Label htmlFor="unpaid" className="font-normal">Unpaid</Label>
            </div>
            <div className="flex items-center space-x-2 col-span-2">
               <Checkbox id="other" />
               <Label htmlFor="other" className="font-normal">Other:</Label>
               <Input id="other-specify" className="h-8"/>
            </div>
          </div>
        </div>

        {/* Leave Period */}
        <div className="space-y-4">
            <Label>Leave Period</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="leave-from">From</Label>
                    <Input id="leave-from" type="date" />
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="leave-to">To</Label>
                    <Input id="leave-to" type="date" />
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="working-days">Number of working days</Label>
                    <Input id="working-days" type="number" />
                </div>
            </div>
        </div>

        {/* Reason for Leave */}
        <div className="space-y-2">
            <Label htmlFor="reason">Reason for Leave (detailed)</Label>
            <Textarea id="reason" rows={4} />
        </div>

        {/* Declarations & Approvals */}
        <div className="space-y-6 border-t pt-6">
            <div className="space-y-2">
                <h3 className="font-semibold">Employee Declaration</h3>
                <p className="text-sm text-muted-foreground">I confirm the information above is correct.</p>
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
             <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
                <h3 className="font-semibold">For Office Use Only</h3>
                 <div className="space-y-4">
                    <Label>Supervisor/Manager Recommendation</Label>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="sup-approve" />
                            <Label htmlFor="sup-approve" className="font-normal">Approved</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="sup-decline" />
                            <Label htmlFor="sup-decline" className="font-normal">Declined</Label>
                        </div>
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="sup-comments">Comments</Label>
                        <Input id="sup-comments" />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="sup-signature">Signature</Label>
                            <Input id="sup-signature" />
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="sup-sig-date">Date</Label>
                            <Input id="sup-sig-date" type="date" />
                        </div>
                    </div>
                </div>
                 <div className="space-y-4 border-t pt-4">
                    <Label>HR / Director Final Approval</Label>
                    <div className="flex items-center space-x-4">
                         <div className="flex items-center space-x-2">
                            <Checkbox id="hr-approve" />
                            <Label htmlFor="hr-approve" className="font-normal">Approved</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="hr-decline" />
                            <Label htmlFor="hr-decline" className="font-normal">Declined</Label>
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="hr-signature">Signature</Label>
                            <Input id="hr-signature" />
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="hr-sig-date">Date</Label>
                            <Input id="hr-sig-date" type="date" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </CardContent>
       <CardFooter>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Submit Application</Button>
       </CardFooter>
    </Card>
  );
}
