
"use client";

import { useRef, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SignaturePad } from "@/components/signature-pad";
import SignatureCanvas from "react-signature-canvas";
import { Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, WidthType, BorderStyle, HeadingLevel } from "docx";
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

const MemoInputRow = ({ label, id, value, onChange }: { label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }) => (
    <div className="grid grid-cols-[80px_1fr] items-center gap-4">
        <Label htmlFor={id} className="text-right">{label}:</Label>
        <Input id={id} name={id} value={value} onChange={onChange} />
    </div>
);

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

export function MemorandumForm() {
  const { toast } = useToast();
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);
  
  const [formData, setFormData] = useState({
    to: "",
    from: "",
    date: "",
    subject: "",
    body: "",
    actionRequired: "",
    signatureDate: "",
  });

  const sigPadRef = useRef<SignatureCanvas>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
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
    const sigImageBase64 = sigPadRef.current?.getTrimmedCanvas().toDataURL("image/png");
    
    if (!sigImageBase64 || sigPadRef.current?.isEmpty()) {
      alert("Please provide a signature before exporting.");
      return;
    }

    const sigImage = base64ToArrayBuffer(sigImageBase64);

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ text: "MEMORANDUM", heading: HeadingLevel.TITLE, alignment: "center" }),
          new Paragraph({ text: "" }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({ children: [new TableCell({ children: [new Paragraph("To:")], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }), new TableCell({ children: [new Paragraph(formData.to)], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } })] }),
              new TableRow({ children: [new TableCell({ children: [new Paragraph("From:")], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }), new TableCell({ children: [new Paragraph(formData.from)], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } })] }),
              new TableRow({ children: [new TableCell({ children: [new Paragraph("Date:")], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }), new TableCell({ children: [new Paragraph(formData.date)], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } })] }),
              new TableRow({ children: [new TableCell({ children: [new Paragraph("Subject:")], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }), new TableCell({ children: [new Paragraph(formData.subject)], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } })] }),
            ]
          }),
          new Paragraph({ text: "" }),
          ...formData.body.split('\n').map(p => new Paragraph({ text: p })),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "Action Required:", bold: true }),
          new Paragraph({ text: formData.actionRequired }),
          new Paragraph({ text: "" }),
          new Paragraph({ children: [new TextRun({ text: "Signature:", bold: true })] }),
          new Paragraph({ children: [new ImageRun({ data: sigImage, transformation: { width: 150, height: 75 } })] }),
          new Paragraph({ children: [new TextRun({ text: `Date: ${formData.signatureDate}` })] }),
        ]
      }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "Memorandum.docx");
  };


  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-2xl tracking-wider">MEMORANDUM</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4 border-b pb-6">
            <MemoInputRow label="To" id="to" value={formData.to} onChange={handleInputChange as any} />
            <MemoInputRow label="From" id="from" value={formData.from} onChange={handleInputChange as any} />
            <MemoInputRow label="Date" id="date" value={formData.date} onChange={handleInputChange as any} />
            <MemoInputRow label="Subject" id="subject" value={formData.subject} onChange={handleInputChange as any} />
        </div>
        
        <div className="pt-6">
            <Textarea 
                id="body" 
                name="body"
                rows={10} 
                value={formData.body} 
                onChange={handleInputChange}
                className="border-none focus:ring-0 p-0"
                placeholder="Enter memorandum content here..."
            />
        </div>

        <div className="space-y-2 pt-6 border-t">
            <Label htmlFor="actionRequired">Action Required:</Label>
            <Input id="actionRequired" name="actionRequired" value={formData.actionRequired} onChange={handleInputChange as any} />
        </div>

      </CardContent>
       <CardFooter className="flex justify-between items-end border-t pt-6">
            <div className="flex flex-wrap items-end gap-6">
                <SignaturePad sigPadRef={sigPadRef} />
                 <div className="grid w-full max-w-xs items-center gap-1.5">
                    <Label htmlFor="signatureDate">Date</Label>
                    <Input id="signatureDate" name="signatureDate" type="date" value={formData.signatureDate} onChange={handleInputChange as any} />
                </div>
            </div>
            <div className="flex justify-end gap-2">
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
