
"use client";

import { useRef, useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import SignatureCanvas from "react-signature-canvas";
import { Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, WidthType, BorderStyle, HeadingLevel, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Copy, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SignaturePad = dynamic(() => import('./signature-pad').then(mod => mod.SignaturePad), { ssr: false });


const initialRows = Array.from({ length: 7 }, () => ({
  date: "", timeIn: "", timeOut: "", totalHours: "", tasks: "", remarks: "",
}));

const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    return Buffer.from(base64.split(",")[1], 'base64');
};

export function LogSheetForm() {
  const { toast } = useToast();
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const [formData, setFormData] = useState({
    monthYear: "",
    projectSite: "",
    employeeName: "",
    employeeId: "",
    role: "",
    department: "",
    totalHours: "",
    employeeDeclarationDate: "",
    supervisorName: "",
    supervisorRole: "",
    supervisorSignatureDate: "",
    supervisorComments: "",
  });
  const [rows, setRows] = useState(initialRows);

  const employeeSigRef = useRef<SignatureCanvas>(null);
  const supervisorSigRef = useRef<SignatureCanvas>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRowChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newRows = [...rows];
    (newRows[index] as any)[name] = value;
    setRows(newRows);
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      toast({
        title: "URL Copied!",
        description: "You can now share the link with your team.",
      });
    }, (err) => {
      toast({
        variant: "destructive",
        title: "Failed to copy",
        description: "Could not copy URL to clipboard.",
      });
    });
  };

  const handleExport = async () => {
    const getSignatureImage = (ref: React.RefObject<SignatureCanvas>) => {
      if (ref.current && !ref.current.isEmpty()) {
        const dataUrl = ref.current.getTrimmedCanvas().toDataURL("image/png");
        return base64ToArrayBuffer(dataUrl);
      }
      return null;
    };
    
    const employeeSignature = getSignatureImage(employeeSigRef);
    const supervisorSignature = getSignatureImage(supervisorSigRef);

    if (!employeeSignature) {
      alert("Please provide the employee's signature.");
      return;
    }

    const tableHeader = new TableRow({
      tableHeader: true,
      children: [
        new TableCell({ children: [new Paragraph({children: [new TextRun({text: "Date", bold: true})]})] }),
        new TableCell({ children: [new Paragraph({children: [new TextRun({text: "Time In", bold: true})]})] }),
        new TableCell({ children: [new Paragraph({children: [new TextRun({text: "Time Out", bold: true})]})] }),
        new TableCell({ children: [new Paragraph({children: [new TextRun({text: "Total Hours", bold: true})]})] }),
        new TableCell({ children: [new Paragraph({children: [new TextRun({text: "Role / Tasks", bold: true})]})] }),
        new TableCell({ children: [new Paragraph({children: [new TextRun({text: "Remarks", bold: true})]})] }),
      ],
    });

    const dataRows = rows.map(row => 
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph(row.date)] }),
          new TableCell({ children: [new Paragraph(row.timeIn)] }),
          new TableCell({ children: [new Paragraph(row.timeOut)] }),
          new TableCell({ children: [new Paragraph(row.totalHours)] }),
          new TableCell({ children: [new Paragraph(row.tasks)] }),
          new TableCell({ children: [new Paragraph(row.remarks)] }),
        ],
      })
    );

    const table = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [tableHeader, ...dataRows]
    });

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ text: "EMPLOYEE DAILY / WEEKLY LOG SHEET", heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER }),
          new Paragraph({ text: "" }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
            rows: [
                new TableRow({ children: [new TableCell({ children: [new Paragraph("Month/Year:")] }), new TableCell({ children: [new Paragraph(formData.monthYear)] }), new TableCell({ children: [new Paragraph("Project/Site:")] }), new TableCell({ children: [new Paragraph(formData.projectSite)] })] }),
                new TableRow({ children: [new TableCell({ children: [new Paragraph("Employee Name:")] }), new TableCell({ children: [new Paragraph(formData.employeeName)] }), new TableCell({ children: [new Paragraph("Employee ID:")] }), new TableCell({ children: [new Paragraph(formData.employeeId)] })] }),
                new TableRow({ children: [new TableCell({ children: [new Paragraph("Role:")] }), new TableCell({ children: [new Paragraph(formData.role)] }), new TableCell({ children: [new Paragraph("Department:")] }), new TableCell({ children: [new Paragraph(formData.department)] })] }),
            ]
          }),
          new Paragraph({ text: "" }),
          table,
          new Paragraph({ text: "" }),
          new Paragraph({ children: [new TextRun({ text: `Total Hours this Period: ${formData.totalHours}`}) ]}),
          new Paragraph({ text: "" }),
          new Paragraph({ children: [new TextRun({ text: "Employee Declaration: I confirm the above information is correct.", bold: true })] }),
          new Paragraph({ children: [new TextRun({ text: "Signature:", bold: true })] }),
          new Paragraph({ children: [new ImageRun({ data: employeeSignature, transformation: { width: 150, height: 75 } })] }),
          new Paragraph({ children: [new TextRun({ text: `Date: ${formData.employeeDeclarationDate}` })] }),
          new Paragraph({ text: "" }),
          new Paragraph({ children: [new TextRun({ text: "Supervisor / Manager Verification:", bold: true })] }),
          new Paragraph({ children: [new TextRun({ text: `Name: ${formData.supervisorName}\tRole: ${formData.supervisorRole}` })] }),
          new Paragraph({ children: [new TextRun({ text: "Signature:", bold: true })] }),
          ...(supervisorSignature ? [new Paragraph({ children: [new ImageRun({ data: supervisorSignature, transformation: { width: 150, height: 75 } })] })] : [new Paragraph('')]),
          new Paragraph({ children: [new TextRun({ text: `Date: ${formData.supervisorSignatureDate}` })] }),
           new Paragraph({ children: [new TextRun({ text: "Comments (if any):", bold: true })] }),
          ...formData.supervisorComments.split('\n').map(p => new Paragraph({ text: p })),
        ]
      }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "LogSheet.docx");
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-2xl tracking-wider">EMPLOYEE DAILY / WEEKLY LOG SHEET</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6">
            <div className="space-y-2"><Label htmlFor="monthYear">Month/Year</Label><Input id="monthYear" name="monthYear" value={formData.monthYear} onChange={handleInputChange} /></div>
            <div className="space-y-2"><Label htmlFor="projectSite">Project/Site</Label><Input id="projectSite" name="projectSite" value={formData.projectSite} onChange={handleInputChange} /></div>
            <div className="space-y-2"><Label htmlFor="employeeName">Employee Name</Label><Input id="employeeName" name="employeeName" value={formData.employeeName} onChange={handleInputChange} /></div>
            <div className="space-y-2"><Label htmlFor="employeeId">Employee ID</Label><Input id="employeeId" name="employeeId" value={formData.employeeId} onChange={handleInputChange} /></div>
            <div className="space-y-2"><Label htmlFor="role">Role</Label><Input id="role" name="role" value={formData.role} onChange={handleInputChange} /></div>
            <div className="space-y-2"><Label htmlFor="department">Department</Label><Input id="department" name="department" value={formData.department} onChange={handleInputChange} /></div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left font-semibold">Date</th>
                <th className="p-2 text-left font-semibold">Time In</th>
                <th className="p-2 text-left font-semibold">Time Out</th>
                <th className="p-2 text-left font-semibold">Total Hours</th>
                <th className="p-2 text-left font-semibold">Tasks / Project</th>
                <th className="p-2 text-left font-semibold">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b">
                  <td className="p-1"><Input type="date" name="date" value={row.date} onChange={e => handleRowChange(i, e)} className="w-full"/></td>
                  <td className="p-1"><Input type="time" name="timeIn" value={row.timeIn} onChange={e => handleRowChange(i, e)} className="w-full"/></td>
                  <td className="p-1"><Input type="time" name="timeOut" value={row.timeOut} onChange={e => handleRowChange(i, e)} className="w-full"/></td>
                  <td className="p-1"><Input type="text" name="totalHours" value={row.totalHours} onChange={e => handleRowChange(i, e)} className="w-24"/></td>
                  <td className="p-1"><Input name="tasks" value={row.tasks} onChange={e => handleRowChange(i, e)} className="w-full"/></td>
                  <td className="p-1"><Input name="remarks" value={row.remarks} onChange={e => handleRowChange(i, e)} className="w-full"/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-2">
            <Label htmlFor="totalHours">Total Hours this Period</Label>
            <Input id="totalHours" name="totalHours" value={formData.totalHours} onChange={handleInputChange} />
        </div>
      </CardContent>
       <CardFooter className="flex flex-col items-start gap-8 border-t pt-6">
          <div className="w-full space-y-4">
              <h3 className="font-semibold">Employee Declaration</h3>
               <p className="text-sm text-muted-foreground">I confirm the above information is correct.</p>
              <div className="flex flex-wrap items-end gap-6">
                <SignaturePad sigPadRef={employeeSigRef} title="Employee Signature" />
                <div className="grid w-full max-w-xs items-center gap-1.5">
                    <Label htmlFor="employeeDeclarationDate">Date</Label>
                    <Input id="employeeDeclarationDate" name="employeeDeclarationDate" type="date" value={formData.employeeDeclarationDate} onChange={handleInputChange} />
                </div>
              </div>
          </div>
          <div className="w-full space-y-4">
              <h3 className="font-semibold">Supervisor / Manager Verification</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2"><Label htmlFor="supervisorName">Name</Label><Input id="supervisorName" name="supervisorName" value={formData.supervisorName} onChange={handleInputChange} /></div>
                <div className="space-y-2"><Label htmlFor="supervisorRole">Role</Label><Input id="supervisorRole" name="supervisorRole" value={formData.supervisorRole} onChange={handleInputChange} /></div>
              </div>
              <div className="flex flex-wrap items-end gap-6">
                <SignaturePad sigPadRef={supervisorSigRef} title="Supervisor Signature" />
                <div className="grid w-full max-w-xs items-center gap-1.5">
                    <Label htmlFor="supervisorSignatureDate">Date</Label>
                    <Input id="supervisorSignatureDate" name="supervisorSignatureDate" type="date" value={formData.supervisorSignatureDate} onChange={handleInputChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="supervisorComments">Comments (if any)</Label>
                <Textarea id="supervisorComments" name="supervisorComments" value={formData.supervisorComments} onChange={handleInputChange} />
              </div>
          </div>
          <div className="w-full flex justify-end gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share Document</DialogTitle>
                  <DialogDescription>
                    Anyone with the link can view and fill out this form.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                  <Input value={currentUrl} readOnly />
                  <Button type="button" size="icon" onClick={handleCopy}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <DialogFooter>
                  <Button onClick={handleExport}>Export to Word</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
       </CardFooter>
    </Card>
  );
}

    
