
"use client";

import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SignaturePad } from "@/components/signature-pad";
import SignatureCanvas from "react-signature-canvas";
import jsPDF from "jspdf";

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

  const handleExport = () => {
    if (sigPadRef.current?.isEmpty()) {
      alert("Please provide a signature before exporting.");
      return;
    }
    const sigImage = sigPadRef.current?.getTrimmedCanvas().toDataURL("image/png");

    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("MEMORANDUM", doc.internal.pageSize.getWidth() / 2, 20, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);

    let y = 40;
    const lineSpacing = 7;
    const leftMargin = 15;
    const valueMargin = 40;

    const drawLine = (yPos: number) => {
        doc.setDrawColor(180, 180, 180);
        doc.line(valueMargin, yPos + 1, doc.internal.pageSize.getWidth() - leftMargin, yPos + 1);
    }
    
    doc.text("To:", leftMargin, y);
    doc.setFont("helvetica", "normal");
    doc.text(formData.to, valueMargin, y);
    drawLine(y);
    y += lineSpacing * 1.5;

    doc.setFont("helvetica", "bold");
    doc.text("From:", leftMargin, y);
    doc.setFont("helvetica", "normal");
    doc.text(formData.from, valueMargin, y);
    drawLine(y);
    y += lineSpacing * 1.5;

    doc.setFont("helvetica", "bold");
    doc.text("Date:", leftMargin, y);
    doc.setFont("helvetica", "normal");
    doc.text(formData.date, valueMargin, y);
    drawLine(y);
    y += lineSpacing * 1.5;

    doc.setFont("helvetica", "bold");
    doc.text("Subject:", leftMargin, y);
    doc.setFont("helvetica", "normal");
    doc.text(formData.subject, valueMargin, y);
    drawLine(y);
    y += lineSpacing * 2;
    
    doc.setFont("helvetica", "normal");
    const bodyLines = doc.splitTextToSize(formData.body, doc.internal.pageSize.getWidth() - leftMargin * 2);
    doc.text(bodyLines, leftMargin, y);
    y += bodyLines.length * lineSpacing + lineSpacing;

    doc.setFont("helvetica", "bold");
    doc.text("Action Required:", leftMargin, y);
    doc.setFont("helvetica", "normal");
    doc.text(formData.actionRequired, valueMargin + 15, y);
    drawLine(y);
    y += lineSpacing * 2;

    doc.setFont("helvetica", "bold");
    doc.text("Signature:", leftMargin, y);
    if (sigImage) {
        doc.addImage(sigImage, "PNG", leftMargin, y + 2, 50, 25);
    }
    y += 35;
    
    doc.setFont("helvetica", "bold");
    doc.text(`Date:`, leftMargin, y);
    doc.setFont("helvetica", "normal");
    doc.text(formData.signatureDate, leftMargin + 15, y);


    doc.save("Memorandum.pdf");
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
             <Button onClick={handleExport}>Export to PDF</Button>
       </CardFooter>
    </Card>
  );
}
