
"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "./ui/textarea";
import { Document, Packer, Paragraph, TextRun, ImageRun, AlignmentType, Table, TableRow, TableCell, WidthType } from "docx";
import { saveAs } from "file-saver";
import SignatureCanvas from "react-signature-canvas";
import { SignaturePad } from "./signature-pad";

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

export function AcceptanceLetterForm() {
  const [formData, setFormData] = useState({
    refNo: "",
    date: new Date().toISOString().split('T')[0],
    clientName: "",
    clientAddress: "",
    contactPerson: "",
    projectName: "",
    awardDate: "",
    amount: "",
    startDate: "",
    endDate: "",
    authorisedSignatory: "",
  });

  const signatorySigRef = useRef<SignatureCanvas>(null);
  const directorSigRef = useRef<SignatureCanvas>(null);

  useEffect(() => {
    const year = new Date().getFullYear();
    const uniqueNum = Math.floor(1000 + Math.random() * 9000);
    setFormData(prev => ({...prev, refNo: `ACCEPT-${year}-${uniqueNum}`}));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleExport = async () => {
    const signatorySigBase64 = signatorySigRef.current?.getTrimmedCanvas().toDataURL("image/png");
    const directorSigBase64 = directorSigRef.current?.getTrimmedCanvas().toDataURL("image/png");
    
    if (!signatorySigBase64 || signatorySigRef.current?.isEmpty()) {
        alert("Please provide the Authorised Signatory's signature.");
        return;
    }
     if (!directorSigBase64 || directorSigRef.current?.isEmpty()) {
        alert("Please provide the Director's signature.");
        return;
    }

    const signatorySigBuffer = base64ToArrayBuffer(signatorySigBase64);
    const directorSigBuffer = base64ToArrayBuffer(directorSigBase64);

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ text: "FOCI GROUP (Pty) Ltd", bold: true, alignment: AlignmentType.CENTER }),
          new Paragraph(""),
          new Paragraph({ text: `Ref: ${formData.refNo}`, alignment: AlignmentType.LEFT }),
          new Paragraph({ text: `Date: ${formData.date}`, alignment: AlignmentType.LEFT }),
          new Paragraph(""),
          new Paragraph(formData.clientName),
          ...formData.clientAddress.split('\n').map(p => new Paragraph(p)),
          new Paragraph(""),
          new Paragraph(`Dear ${formData.contactPerson},`),
          new Paragraph(""),
          new Paragraph({ 
            children: [
              new TextRun({ text: "SUBJECT: ACCEPTANCE OF CONTRACT / TENDER AWARD – ", bold: true, underline: {} }),
              new TextRun({ text: formData.projectName, bold: true, underline: {} }),
            ]
          }),
          new Paragraph(""),
          new Paragraph({
            children: [
              new TextRun("We are pleased to accept the award of the above contract dated "),
              new TextRun({ text: formData.awardDate }),
              new TextRun(" for the amount of R"),
              new TextRun({ text: formData.amount }),
              new TextRun(" (excl. VAT)."),
            ]
          }),
          new Paragraph(""),
          new Paragraph(`We confirm commencement date: ${formData.startDate}`),
          new Paragraph(`Expected completion date:     ${formData.endDate}`),
          new Paragraph(""),
          new Paragraph("Thank you for the opportunity."),
          new Paragraph(""),
          new Paragraph("Yours sincerely,"),
          new Paragraph(""),
          new Paragraph(""),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: { top: { style: 'none' }, bottom: { style: 'none' }, left: { style: 'none' }, right: { style: 'none' }, insideHorizontal: { style: 'none' }, insideVertical: { style: 'none' } },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            children: [
                                new Paragraph({ children: [new ImageRun({ data: signatorySigBuffer, transformation: { width: 150, height: 40 } })] }),
                                new Paragraph({ children: [ new TextRun({ text: "_______________________" }) ] }),
                                new Paragraph(formData.authorisedSignatory),
                                new Paragraph("FOCI GROUP (Pty) Ltd"),
                            ],
                        }),
                        new TableCell({
                             children: [
                                new Paragraph({ children: [new ImageRun({ data: directorSigBuffer, transformation: { width: 150, height: 40 } })] }),
                                new Paragraph({ children: [ new TextRun({ text: "_______________________" }) ] }),
                                new Paragraph("Director"),
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
    saveAs(blob, `Acceptance-Letter-${formData.refNo}.docx`);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl tracking-wider">Acceptance of Contract / Tender Award</CardTitle>
        <CardDescription>Generate a formal acceptance letter.</CardDescription>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="clientName">Client Name</Label>
                <Input id="clientName" name="clientName" value={formData.clientName} onChange={handleInputChange} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input id="contactPerson" name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="clientAddress">Client Address</Label>
                <Textarea id="clientAddress" name="clientAddress" value={formData.clientAddress} onChange={handleInputChange} />
            </div>
        </div>
        
        <div className="space-y-4 border-t pt-6">
             <div className="space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input id="projectName" name="projectName" value={formData.projectName} onChange={handleInputChange} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label htmlFor="awardDate">Award Date</Label>
                    <Input id="awardDate" name="awardDate" type="date" value={formData.awardDate} onChange={handleInputChange} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="amount">Amount (excl. VAT)</Label>
                    <Input id="amount" name="amount" type="number" value={formData.amount} onChange={handleInputChange} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="startDate">Commencement Date</Label>
                    <Input id="startDate" name="startDate" type="date" value={formData.startDate} onChange={handleInputChange} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="endDate">Expected Completion Date</Label>
                    <Input id="endDate" name="endDate" type="date" value={formData.endDate} onChange={handleInputChange} />
                </div>
            </div>
        </div>

        <div className="space-y-6 border-t pt-6">
            <h3 className="font-semibold">Signatories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="authorisedSignatory">Authorised Signatory Name</Label>
                        <Input id="authorisedSignatory" name="authorisedSignatory" value={formData.authorisedSignatory} onChange={handleInputChange} />
                    </div>
                    <SignaturePad sigPadRef={signatorySigRef} title="Authorised Signatory's Signature" />
                </div>
                 <div className="space-y-4">
                     <SignaturePad sigPadRef={directorSigRef} title="Director's Signature" />
                </div>
            </div>
        </div>

      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button onClick={handleExport}>Export to Word</Button>
      </CardFooter>
    </Card>
  );
}
