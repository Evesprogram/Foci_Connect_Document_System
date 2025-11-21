
"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "./ui/textarea";
import { Document, Packer, Paragraph, TextRun, ImageRun, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } from "docx";
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

const SignaturePad = dynamic(() => import('./signature-pad').then(mod => mod.SignaturePad), { ssr: false });
const SignatureCanvas = dynamic(() => import('react-signature-canvas'), { ssr: false });


const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    return Buffer.from(base64.split(",")[1], 'base64');
};

export function NoticeLetterForm() {
  const { toast } = useToast();
  const [currentUrl, setCurrentUrl] = useState('');
  const [formData, setFormData] = useState({
    refNo: "",
    date: "",
    employeeName: "",
    employeeId: "",
    noticeType: "",
    shortDescription: "",
    detailedReason: "",
    actionRequired: "",
    deadlineDate: "",
    employeeSignatureDate: "",
    hrManagerSignatureDate: ""
  });

  const employeeSigRef = useRef<import("react-signature-canvas").default>(null);
  const hrManagerSigRef = useRef<import("react-signature-canvas").default>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
      const year = new Date().getFullYear();
      const uniqueNum = Math.floor(1000 + Math.random() * 9000);
      setFormData(prev => ({
          ...prev, 
          refNo: `NOTICE-${year}-${uniqueNum}`,
          date: new Date().toISOString().split('T')[0]
      }));
    }
  }, []);

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
    const getSignatureImage = (ref: React.RefObject<import("react-signature-canvas").default>) => {
      if (ref.current && !ref.current.isEmpty()) {
        const dataUrl = ref.current.getTrimmedCanvas().toDataURL("image/png");
        return base64ToArrayBuffer(dataUrl);
      }
      return null;
    };

    const employeeSigBuffer = getSignatureImage(employeeSigRef);
    const hrManagerSigBuffer = getSignatureImage(hrManagerSigRef);

    if (!employeeSigBuffer) {
        alert("Please ensure the employee has acknowledged with a signature.");
        return;
    }
     if (!hrManagerSigBuffer) {
        alert("Please ensure the HR Manager has signed.");
        return;
    }
    
    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ children: [new TextRun({ text: "FOCI GROUP (Pty) Ltd", bold: true })], alignment: AlignmentType.CENTER }),
          new Paragraph({text: ""}),
          new Paragraph({ text: "NOTICE LETTER", heading: "Title", alignment: AlignmentType.CENTER }),
          new Paragraph({text: ""}),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: { top: { style: 'none' }, bottom: { style: 'none' }, left: { style: 'none' }, right: { style: 'none' }, insideHorizontal: { style: 'none' }, insideVertical: { style: 'none' } },
            rows: [ new TableRow({ children: [ new TableCell({ children: [new Paragraph({text: `Ref: ${formData.refNo}`})] }), new TableCell({ children: [new Paragraph({ text: `Date: ${formData.date}`, alignment: AlignmentType.RIGHT })] }) ] }) ]
          }),
          new Paragraph({text: ""}),
          new Paragraph({text: `To: ${formData.employeeName}`}),
          new Paragraph({text: `Employee ID: ${formData.employeeId}`}),
          new Paragraph({text: ""}),
          new Paragraph({ 
            children: [
              new TextRun({ text: "Subject: ", bold: true }),
              new TextRun({text: `${formData.noticeType} – ${formData.shortDescription}`}),
            ],
            spacing: { before: 200, after: 200 }
          }),
          new Paragraph({text: `Dear ${formData.employeeName},`}),
          new Paragraph({text: ""}),
          new Paragraph({text: "You are hereby notified of the following:"}),
          new Paragraph({text: formData.detailedReason}),
          new Paragraph({text: ""}),
          new Paragraph({text: "You are required to:"}),
          new Paragraph({text: `${formData.actionRequired} by ${formData.deadlineDate}`}),
          new Paragraph({text: ""}),
          new Paragraph({text: "Failure to comply may result in further disciplinary action."}),
          new Paragraph({text: ""}),
          new Paragraph({ text: "", spacing: { after: 400 } }),
          
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            children: [
                                new Paragraph({text: "Acknowledged by Employee:"}),
                                new Paragraph({ children: [new ImageRun({ data: employeeSigBuffer, transformation: { width: 150, height: 40 } })] }),
                                new Paragraph({ children: [ new TextRun({ text: "_______________________" }) ] }),
                                new Paragraph({text: `Date: ${formData.employeeSignatureDate}`}),
                            ],
                        }),
                        new TableCell({
                             children: [
                                new Paragraph({text: "HR Manager:"}),
                                new Paragraph({ children: [new ImageRun({ data: hrManagerSigBuffer, transformation: { width: 150, height: 40 } })] }),
                                new Paragraph({ children: [ new TextRun({ text: "_______________________" }) ] }),
                                new Paragraph({text: `Date: ${formData.hrManagerSignatureDate}`}),
                            ],
                        }),
                    ],
                }),
            ]
          })
        ],
      }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Notice-Letter-${formData.refNo}.docx`);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl tracking-wider">Notice Letter</CardTitle>
        <CardDescription>Generate a formal notice for an employee.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Reference No:</Label>
            <Input value={formData.refNo} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date:</Label>
            <Input id="date" name="date" type="date" value={formData.date} onChange={handleInputChange} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
            <div className="space-y-2">
                <Label htmlFor="employeeName">To (Employee Name)</Label>
                <Input id="employeeName" name="employeeName" value={formData.employeeName} onChange={handleInputChange} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input id="employeeId" name="employeeId" value={formData.employeeId} onChange={handleInputChange} />
            </div>
        </div>
        
        <div className="space-y-4 border-t pt-6">
            <h3 className="font-semibold">Notice Details</h3>
             <div className="space-y-2">
                <Label htmlFor="noticeType">Notice Type (e.g., Warning)</Label>
                <Input id="noticeType" name="noticeType" value={formData.noticeType} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="shortDescription">Subject / Short Description</Label>
                <Input id="shortDescription" name="shortDescription" value={formData.shortDescription} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="detailedReason">Detailed Reason / Notification</Label>
                <Textarea id="detailedReason" name="detailedReason" rows={5} value={formData.detailedReason} onChange={handleInputChange} />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label htmlFor="actionRequired">Action Required</Label>
                    <Input id="actionRequired" name="actionRequired" value={formData.actionRequired} onChange={handleInputChange} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="deadlineDate">Deadline Date</Label>
                    <Input id="deadlineDate" name="deadlineDate" type="date" value={formData.deadlineDate} onChange={handleInputChange} />
                </div>
            </div>
        </div>

        <div className="space-y-6 border-t pt-6">
            <h3 className="font-semibold">Signatures</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <SignaturePad sigPadRef={employeeSigRef} title="Acknowledged by Employee" />
                     <div className="space-y-2">
                        <Label htmlFor="employeeSignatureDate">Date</Label>
                        <Input id="employeeSignatureDate" name="employeeSignatureDate" type="date" value={formData.employeeSignatureDate} onChange={handleInputChange} />
                    </div>
                </div>
                 <div className="space-y-4">
                     <SignaturePad sigPadRef={hrManagerSigRef} title="HR Manager" />
                     <div className="space-y-2">
                        <Label htmlFor="hrManagerSignatureDate">Date</Label>
                        <Input id="hrManagerSignatureDate" name="hrManagerSignatureDate" type="date" value={formData.hrManagerSignatureDate} onChange={handleInputChange} />
                    </div>
                </div>
            </div>
        </div>

      </CardContent>
      <CardFooter className="flex justify-end gap-2">
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
      </CardFooter>
    </Card>
  );
}
