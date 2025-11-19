
"use client";

import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SignaturePad } from "@/components/signature-pad";
import SignatureCanvas from "react-signature-canvas";
import { Document, Packer, Paragraph, TextRun, ImageRun } from "docx";
import { saveAs } from "file-saver";

const MemoInputRow = ({ label, id, value, onChange }: { label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }) => (
    <div className="grid grid-cols-[80px_1fr] items-center gap-4">
        <Label htmlFor={id} className="text-right">{label}:</Label>
        <Input id={id} name={id} value={value} onChange={onChange} />
    </div>
);

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

  const sigPadRef = useRef<SignatureCanvas>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleExport = async () => {
    if (sigPadRef.current?.isEmpty()) {
      alert("Please provide a signature before exporting.");
      return;
    }
    const sigImage = sigPadRef.current?.getTrimmedCanvas().toDataURL("image/png");
    // The docx library expects the base64 string without the data URI prefix.
    const base64Image = sigImage!.split(",")[1];

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({ text: "MEMORANDUM", heading: "Title", alignment: "center" }),
            new Paragraph({ text: "" }),
            new Paragraph({
              children: [new TextRun({ text: "To:\t", bold: true }), new TextRun(formData.to)],
            }),
            new Paragraph({
              children: [new TextRun({ text: "From:\t", bold: true }), new TextRun(formData.from)],
            }),
            new Paragraph({
              children: [new TextRun({ text: "Date:\t", bold: true }), new TextRun(formData.date)],
            }),
            new Paragraph({
              children: [new TextRun({ text: "Subject:\t", bold: true }), new TextRun(formData.subject)],
            }),
            new Paragraph({ text: "__________________________________________________________________________________" }),
            new Paragraph({ text: "" }),
            ...formData.body.split('\n').map(p => new Paragraph({ text: p })),
            new Paragraph({ text: "" }),
            new Paragraph({
              children: [new TextRun({ text: "Action Required:\t", bold: true }), new TextRun(formData.actionRequired)],
            }),
            new Paragraph({ text: "" }),
            new Paragraph({
              children: [
                new TextRun({ text: "Signature:", bold: true }),
              ],
            }),
            new Paragraph({
                children: [
                    new ImageRun({
                        data: base64Image,
                        transformation: {
                            width: 200,
                            height: 100,
                        },
                    }),
                ]
            }),
            new Paragraph({
              children: [new TextRun({ text: "Date:\t", bold: true }), new TextRun(formData.signatureDate)],
            }),
          ],
        },
      ],
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
            <MemoInputRow label="To" id="to" value={formData.to} onChange={handleInputChange} />
            <MemoInputRow label="From" id="from" value={formData.from} onChange={handleInputChange} />
            <MemoInputRow label="Date" id="date" value={formData.date} onChange={handleInputChange} />
            <MemoInputRow label="Subject" id="subject" value={formData.subject} onChange={handleInputChange} />
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
            <Input id="actionRequired" name="actionRequired" value={formData.actionRequired} onChange={handleInputChange} />
        </div>

      </CardContent>
       <CardFooter className="flex justify-between items-end border-t pt-6">
            <div className="flex flex-wrap items-end gap-6">
                <SignaturePad sigPadRef={sigPadRef} />
                 <div className="grid w-full max-w-xs items-center gap-1.5">
                    <Label htmlFor="signatureDate">Date</Label>
                    <Input id="signatureDate" name="signatureDate" type="date" value={formData.signatureDate} onChange={handleInputChange} />
                </div>
            </div>
             <Button onClick={handleExport}>Export to Word</Button>
       </CardFooter>
    </Card>
  );
}
