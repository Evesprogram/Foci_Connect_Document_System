
"use client";

import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SignaturePad } from "@/components/signature-pad";
import SignatureCanvas from "react-signature-canvas";
import { Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, WidthType, BorderStyle, HeadingLevel } from "docx";
import { saveAs } from "file-saver";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Share2 } from "lucide-react";

const MemoInputRow = ({ label, id, value, onChange }: { label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }) => (
    <div className="grid grid-cols-[80px_1fr] items-center gap-4">
        <Label htmlFor={id} className="text-right">{label}:</Label>
        <Input id={id} name={id} value={value} onChange={onChange} />
    </div>
);

const base64ToArrayBuffer = (base64: string) => {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
};

export function MemorandumForm() {
  const [formData, setFormData] = useState({
    to: "",
    from: "",
    date: "",
    subject: "",
    body: "",
    actionRequired: "",
    signatureDate: "",
  });

  const [powerAutomateUrl, setPowerAutomateUrl] = useState("");
  const { toast } = useToast();
  const sigPadRef = useRef<SignatureCanvas>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleShare = () => {
    // In a real implementation, you would post the document data to this URL.
    console.log("Sending to Power Automate URL:", powerAutomateUrl);
    toast({
      title: "Sent to Workflow",
      description: "The document has been sent to the Power Automate flow.",
    });
  };

  const handleExport = async () => {
    const sigImageBase64 = sigPadRef.current?.getTrimmedCanvas().toDataURL("image/png").split(",")[1];
    
    if (!sigImageBase64) {
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
                    <Button variant="outline"><Share2 className="mr-2 h-4 w-4" /> Share</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Share Document</DialogTitle>
                    <DialogDescription>
                        Enter a Power Automate URL to send this document to a workflow.
                    </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="powerAutomateUrl">Power Automate URL</Label>
                            <Input 
                                id="powerAutomateUrl" 
                                placeholder="https://prod.azure.com/..." 
                                value={powerAutomateUrl}
                                onChange={(e) => setPowerAutomateUrl(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                    <Button onClick={handleShare}>Send to Power Automate</Button>
                    </DialogFooter>
                </DialogContent>
                </Dialog>
                <Button onClick={handleExport}>Export to Word</Button>
            </div>
       </CardFooter>
    </Card>
  );
}

    