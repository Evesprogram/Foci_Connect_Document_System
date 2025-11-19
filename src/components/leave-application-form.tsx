
"use client";

import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SignaturePad } from "@/components/signature-pad";
import SignatureCanvas from "react-signature-canvas";
import { Document, Packer, Paragraph, TextRun, ImageRun } from "docx";
import { saveAs } from "file-saver";
import { Textarea } from "./ui/textarea";

export function LeaveApplicationForm() {
  const [formData, setFormData] = useState({
    applicationDate: "",
    employeeId: "",
    employeeName: "",
    department: "",
    leaveType: "annual",
    otherLeaveType: "",
    leaveFrom: "",
    leaveTo: "",
    workingDays: "",
    reason: "",
    employeeSignatureDate: "",
    supervisorName: "",
    supervisorSignatureDate: "",
    hrSignatureDate: "",
  });

  const employeeSigRef = useRef<SignatureCanvas>(null);
  const supervisorSigRef = useRef<SignatureCanvas>(null);
  const hrSigRef = useRef<SignatureCanvas>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLeaveTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, leaveType: value }));
  };

  const handleExport = async () => {
    const employeeSignature = employeeSigRef.current?.getTrimmedCanvas().toDataURL("image/png").split(",")[1];
    const supervisorSignature = supervisorSigRef.current?.getTrimmedCanvas().toDataURL("image/png").split(",")[1];
    const hrSignature = hrSigRef.current?.getTrimmedCanvas().toDataURL("image/png").split(",")[1];

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ text: "LEAVE APPLICATION FORM", heading: "Title", alignment: "center" }),
          new Paragraph({ text: "" }),
          new Paragraph({ children: [new TextRun({ text: `Application Date: ${formData.applicationDate}\t\tEmployee ID: ${formData.employeeId}` })] }),
          new Paragraph({ children: [new TextRun({ text: `Employee Name: ${formData.employeeName}\t\tDepartment: ${formData.department}` })] }),
          new Paragraph({ text: "__________________________________________________________________________________" }),
          new Paragraph({ text: "Type of Leave Requested:", bold: true }),
          new Paragraph({ text: `[${formData.leaveType === 'annual' ? 'X' : ' '}] Annual Leave\t\t[${formData.leaveType === 'sick' ? 'X' : ' '}] Sick Leave\t\t[${formData.leaveType === 'family' ? 'X' : ' '}] Family Responsibility` }),
          new Paragraph({ text: `[${formData.leaveType === 'maternity' ? 'X' : ' '}] Maternity/Paternity\t[${formData.leaveType === 'study' ? 'X' : ' '}] Study\t\t[${formData.leaveType === 'unpaid' ? 'X' : ' '}] Unpaid` }),
          new Paragraph({ children: [new TextRun({ text: `[${formData.leaveType === 'other' ? 'X' : ' '}] Other: ${formData.otherLeaveType}`})] }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "Leave Period:", bold: true }),
          new Paragraph({ children: [new TextRun({ text: `From: ${formData.leaveFrom}\tTo: ${formData.leaveTo}\tNumber of working days: ${formData.workingDays}` })] }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "Reason for Leave (detailed):", bold: true }),
          ...formData.reason.split('\n').map(p => new Paragraph({ text: p })),
          new Paragraph({ text: "__________________________________________________________________________________" }),
          new Paragraph({ text: "Employee Declaration:", bold: true }),
          new Paragraph({ text: "I confirm the information above is correct." }),
          new Paragraph({ children: [new TextRun({ text: "Signature:", bold: true })] }),
          ...(employeeSignature ? [new Paragraph({ children: [new ImageRun({ data: Buffer.from(employeeSignature, 'base64'), transformation: { width: 150, height: 75 } })] })] : []),
          new Paragraph({ children: [new TextRun({ text: `Date: ${formData.employeeSignatureDate}` })] }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "Supervisor/Manager Recommendation:", bold: true }),
          new Paragraph({ children: [new TextRun({ text: "Signature:", bold: true })] }),
          ...(supervisorSignature ? [new Paragraph({ children: [new ImageRun({ data: Buffer.from(supervisorSignature, 'base64'), transformation: { width: 150, height: 75 } })] })] : []),
          new Paragraph({ children: [new TextRun({ text: `Date: ${formData.supervisorSignatureDate}` })] }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "HR / Director Final Approval:", bold: true }),
          new Paragraph({ children: [new TextRun({ text: "Signature:", bold: true })] }),
          ...(hrSignature ? [new Paragraph({ children: [new ImageRun({ data: Buffer.from(hrSignature, 'base64'), transformation: { width: 150, height: 75 } })] })] : []),
          new Paragraph({ children: [new TextRun({ text: `Date: ${formData.hrSignatureDate}` })] }),
        ]
      }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "LeaveApplication.docx");
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-2xl tracking-wider">LEAVE APPLICATION FORM</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6">
          <div className="space-y-2">
            <Label htmlFor="applicationDate">Application Date</Label>
            <Input id="applicationDate" name="applicationDate" type="date" value={formData.applicationDate} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="employeeId">Employee ID</Label>
            <Input id="employeeId" name="employeeId" value={formData.employeeId} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="employeeName">Employee Name</Label>
            <Input id="employeeName" name="employeeName" value={formData.employeeName} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input id="department" name="department" value={formData.department} onChange={handleInputChange} />
          </div>
        </div>

        <div className="space-y-4 border-b pb-6">
          <Label>Type of Leave Requested</Label>
          <RadioGroup value={formData.leaveType} onValueChange={handleLeaveTypeChange} className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2"><RadioGroupItem value="annual" id="annual" /><Label htmlFor="annual">Annual Leave</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="sick" id="sick" /><Label htmlFor="sick">Sick Leave</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="family" id="family" /><Label htmlFor="family">Family Responsibility</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="maternity" id="maternity" /><Label htmlFor="maternity">Maternity/Paternity</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="study" id="study" /><Label htmlFor="study">Study</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="unpaid" id="unpaid" /><Label htmlFor="unpaid">Unpaid</Label></div>
            <div className="flex items-center col-span-2 md:col-span-3 gap-2">
              <RadioGroupItem value="other" id="other" />
              <Label htmlFor="other" className="whitespace-nowrap">Other:</Label>
              <Input name="otherLeaveType" value={formData.otherLeaveType} onChange={handleInputChange} disabled={formData.leaveType !== 'other'} />
            </div>
          </RadioGroup>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-b pb-6">
            <div className="space-y-2">
                <Label htmlFor="leaveFrom">From</Label>
                <Input id="leaveFrom" name="leaveFrom" type="date" value={formData.leaveFrom} onChange={handleInputChange}/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="leaveTo">To</Label>
                <Input id="leaveTo" name="leaveTo" type="date" value={formData.leaveTo} onChange={handleInputChange}/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="workingDays">Number of working days</Label>
                <Input id="workingDays" name="workingDays" type="number" value={formData.workingDays} onChange={handleInputChange}/>
            </div>
        </div>

        <div className="space-y-2">
            <Label htmlFor="reason">Reason for Leave (detailed)</Label>
            <Textarea id="reason" name="reason" value={formData.reason} onChange={handleInputChange} rows={4} />
        </div>

      </CardContent>
       <CardFooter className="flex flex-col items-start gap-8 border-t pt-6">
          <div className="w-full space-y-4">
              <h3 className="font-semibold">Employee Declaration</h3>
              <p className="text-sm text-muted-foreground">I confirm the information above is correct.</p>
              <div className="flex flex-wrap items-end gap-6">
                <SignaturePad sigPadRef={employeeSigRef} title="Employee Signature" />
                <div className="grid w-full max-w-xs items-center gap-1.5">
                    <Label htmlFor="employeeSignatureDate">Date</Label>
                    <Input id="employeeSignatureDate" name="employeeSignatureDate" type="date" value={formData.employeeSignatureDate} onChange={handleInputChange} />
                </div>
              </div>
          </div>
          <div className="w-full space-y-4">
              <h3 className="font-semibold">Supervisor/Manager Recommendation</h3>
              <div className="flex flex-wrap items-end gap-6">
                <SignaturePad sigPadRef={supervisorSigRef} title="Supervisor/Manager Signature" />
                <div className="grid w-full max-w-xs items-center gap-1.5">
                    <Label htmlFor="supervisorSignatureDate">Date</Label>
                    <Input id="supervisorSignatureDate" name="supervisorSignatureDate" type="date" value={formData.supervisorSignatureDate} onChange={handleInputChange} />
                </div>
              </div>
          </div>
          <div className="w-full space-y-4">
              <h3 className="font-semibold">HR / Director Final Approval</h3>
              <div className="flex flex-wrap items-end gap-6">
                <SignaturePad sigPadRef={hrSigRef} title="HR / Director Signature" />
                 <div className="grid w-full max-w-xs items-center gap-1.5">
                    <Label htmlFor="hrSignatureDate">Date</Label>                    <Input id="hrSignatureDate" name="hrSignatureDate" type="date" value={formData.hrSignatureDate} onChange={handleInputChange} />
                </div>
              </div>
          </div>
          <div className="w-full flex justify-end">
            <Button onClick={handleExport}>Export to Word</Button>
          </div>
       </CardFooter>
    </Card>
  );
}
