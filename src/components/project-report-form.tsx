
"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SignaturePad } from "@/components/signature-pad";
import SignatureCanvas from "react-signature-canvas";
import { Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, WidthType, BorderStyle, HeadingLevel, AlignmentType } from "docx";
import { saveAs } from "file-saver";
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

const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  if (!base64 || base64.indexOf(',') === -1) {
    throw new Error('Invalid base64 string');
  }
  const binary_string = window.atob(base64.split(",")[1]);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
};

export function ProjectReportForm() {
  const { toast } = useToast();
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const [formData, setFormData] = useState({
    month: new Date().toLocaleString('default', { month: 'long' }),
    year: new Date().getFullYear().toString(),
    reportNo: "",
    projectName: "",
    preparedBy: "",
    revenue: "0",
    expenses: "0",
    profitLoss: "0",
    progress: "0",
    milestones: "",
    staffCount: "0",
    leaveDays: "0",
    approvedBy: "",
    approvedByDate: "",
  });

  const approvedBySigRef = useRef<SignatureCanvas>(null);

  useEffect(() => {
    const year = new Date().getFullYear();
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const uniqueNum = Math.floor(1000 + Math.random() * 9000);
    setFormData(prev => ({...prev, reportNo: `MER-${year}${month}-${uniqueNum}`}));
  }, []);
  
  useEffect(() => {
      const revenue = parseFloat(formData.revenue) || 0;
      const expenses = parseFloat(formData.expenses) || 0;
      const profit = revenue - expenses;
      setFormData(prev => ({...prev, profitLoss: profit.toFixed(2) }))
  }, [formData.revenue, formData.expenses])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    const approvedBySigBase64 = approvedBySigRef.current?.getTrimmedCanvas().toDataURL("image/png");
    
    if (!approvedBySigBase64 || approvedBySigRef.current?.isEmpty()) {
        alert("Please provide the approver's signature.");
        return;
    }
    
    const approvedBySigBuffer = base64ToArrayBuffer(approvedBySigBase64);

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ text: "FOCI GROUP (Pty) Ltd", bold: true, alignment: AlignmentType.CENTER }),
          new Paragraph({ text: `MONTH-END REPORT – ${formData.month.toUpperCase()} ${formData.year}`, heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }),
          new Paragraph(""),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph(`Report No: ${formData.reportNo}`)], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }),
                  new TableCell({ children: [new Paragraph(`Period: ${formData.month} ${formData.year}`)], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph(`Project/Site: ${formData.projectName}`)], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }),
                  new TableCell({ children: [new Paragraph(`Prepared by: ${formData.preparedBy}`)], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }),
                ],
              }),
            ],
          }),
          new Paragraph(""),

          new Paragraph({ text: "1. Financial Summary", bold: true, spacing: { before: 200 } }),
          new Table({
              width: { size: 80, type: WidthType.PERCENTAGE },
              rows: [
                  new TableRow({ children: [new TableCell({ children: [new Paragraph("Revenue this month:")], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }), new TableCell({ children: [new Paragraph(`R ${formData.revenue}`)], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } })] }),
                  new TableRow({ children: [new TableCell({ children: [new Paragraph("Expenses this month:")], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }), new TableCell({ children: [new Paragraph(`R ${formData.expenses}`)], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } })] }),
                  new TableRow({ children: [new TableCell({ children: [new Paragraph("Profit/Loss:")], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }), new TableCell({ children: [new Paragraph(`R ${formData.profitLoss}`)], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } })] }),
              ]
          }),

          new Paragraph({ text: "2. Project Progress", bold: true, spacing: { before: 200 } }),
           new Table({
              width: { size: 80, type: WidthType.PERCENTAGE },
              rows: [
                  new TableRow({ children: [new TableCell({ children: [new Paragraph("% Complete:")], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }), new TableCell({ children: [new Paragraph(`${formData.progress}%`)], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } })] }),
                  new TableRow({ children: [new TableCell({ children: [new Paragraph("Milestones achieved:")], verticalAlign: "top", borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }), new TableCell({ children: formData.milestones.split("\n").map(p => new Paragraph(p)), borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } })] }),
              ]
          }),
          
          new Paragraph({ text: "3. HR Summary", bold: true, spacing: { before: 200 } }),
          new Table({
              width: { size: 80, type: WidthType.PERCENTAGE },
              rows: [
                  new TableRow({ children: [new TableCell({ children: [new Paragraph("Total staff on site:")], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }), new TableCell({ children: [new Paragraph(formData.staffCount)], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } })] }),
                  new TableRow({ children: [new TableCell({ children: [new Paragraph("Leave taken (days):")], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }), new TableCell({ children: [new Paragraph(formData.leaveDays)], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } })] }),
              ]
          }),

          new Paragraph({ text: "", spacing: { before: 400 } }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph(`Approved by: ${formData.approvedBy}`)], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }),
                        new TableCell({ children: [ new Paragraph({ children: [ new ImageRun({ data: approvedBySigBuffer, transformation: { width: 150, height: 40 } }) ] }) ], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }),
                        new TableCell({ children: [new Paragraph(`Date: ${formData.approvedByDate}`)], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }),
                    ]
                })
            ]
          })
        ]
      }]
    });
    
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "MonthEndReport.docx");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl tracking-wider">MONTH-END REPORT</CardTitle>
        <CardDescription>Generate a structured report for the month's activities.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4 border-b pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label>Month</Label>
                    <Input name="month" value={formData.month} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                    <Label>Year</Label>
                    <Input name="year" type="number" value={formData.year} onChange={handleInputChange} />
                </div>
            </div>
            <div className="space-y-2">
                <Label>Report No</Label>
                <Input name="reportNo" value={formData.reportNo} readOnly />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2"><Label htmlFor="projectName">Project/Site</Label><Input id="projectName" name="projectName" value={formData.projectName} onChange={handleInputChange} /></div>
                <div className="space-y-2"><Label htmlFor="preparedBy">Prepared By</Label><Input id="preparedBy" name="preparedBy" value={formData.preparedBy} onChange={handleInputChange} /></div>
            </div>
        </div>

        <div className="space-y-4">
            <h3 className="text-lg font-semibold">1. Financial Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="space-y-2"><Label htmlFor="revenue">Revenue this month</Label><Input id="revenue" name="revenue" type="number" value={formData.revenue} onChange={handleInputChange} /></div>
                 <div className="space-y-2"><Label htmlFor="expenses">Expenses this month</Label><Input id="expenses" name="expenses" type="number" value={formData.expenses} onChange={handleInputChange} /></div>
                 <div className="space-y-2"><Label htmlFor="profitLoss">Profit/Loss</Label><Input id="profitLoss" name="profitLoss" value={formData.profitLoss} readOnly className="font-medium" /></div>
            </div>
        </div>
        
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">2. Project Progress</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2"><Label htmlFor="progress">% Complete</Label><Input id="progress" name="progress" type="number" value={formData.progress} onChange={handleInputChange} /></div>
                 <div className="space-y-2"><Label htmlFor="milestones">Milestones Achieved</Label><Textarea id="milestones" name="milestones" value={formData.milestones} onChange={handleInputChange} /></div>
            </div>
        </div>

        <div className="space-y-4">
            <h3 className="text-lg font-semibold">3. HR Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2"><Label htmlFor="staffCount">Total staff on site</Label><Input id="staffCount" name="staffCount" type="number" value={formData.staffCount} onChange={handleInputChange} /></div>
                 <div className="space-y-2"><Label htmlFor="leaveDays">Leave taken (days)</Label><Input id="leaveDays" name="leaveDays" type="number" value={formData.leaveDays} onChange={handleInputChange} /></div>
            </div>
        </div>
      </CardContent>
       <CardFooter className="flex flex-col items-start gap-8 border-t pt-6">
          <div className="w-full space-y-4">
              <h3 className="font-semibold">Approval</h3>
              <div className="grid md:grid-cols-2 gap-6 items-end">
                <div className="space-y-2">
                    <Label htmlFor="approvedBy">Approved By</Label>
                    <Input id="approvedBy" name="approvedBy" value={formData.approvedBy} onChange={handleInputChange}/>
                </div>
                 <div className="grid w-full max-w-xs items-center gap-1.5">
                    <Label htmlFor="approvedByDate">Date</Label>
                    <Input id="approvedByDate" name="approvedByDate" type="date" value={formData.approvedByDate} onChange={handleInputChange} />
                </div>
              </div>
               <div className="flex flex-wrap items-end gap-6">
                <SignaturePad sigPadRef={approvedBySigRef} title="Signature" />
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
