
"use client";

import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SignaturePad } from "@/components/signature-pad";
import SignatureCanvas from "react-signature-canvas";
import { Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, WidthType, BorderStyle } from "docx";
import { saveAs } from "file-saver";

const Section = ({ title, name, value, onChange }: { title: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; }) => (
    <div className="space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Textarea name={name} value={value} onChange={onChange} rows={5} />
    </div>
);

export function ProjectReportForm() {
  const [formData, setFormData] = useState({
    reportTitle: "",
    preparedBy: "",
    department: "",
    periodFrom: "",
    periodTo: "",
    dateSubmitted: "",
    executiveSummary: "",
    achievements: "",
    challenges: "",
    financialSummary: "",
    plannedActivities: "",
    preparedByDate: "",
    reviewedBy: "",
    reviewedByDate: "",
  });

  const preparedBySigRef = useRef<SignatureCanvas>(null);
  const reviewedBySigRef = useRef<SignatureCanvas>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleExport = async () => {
    const getSignatureImage = (ref: React.RefObject<SignatureCanvas>) => {
      if (ref.current && !ref.current.isEmpty()) {
        const dataUrl = ref.current.getTrimmedCanvas().toDataURL("image/png");
        return dataUrl.split(",")[1];
      }
      return null;
    };

    const preparedBySig = getSignatureImage(preparedBySigRef);
    const reviewedBySig = getSignatureImage(reviewedBySigRef);

    if (!preparedBySig) {
      alert("Please ensure the 'Prepared By' signature is provided.");
      return;
    }
    
    const createSection = (title: string, content: string) => [
        new Paragraph({ text: title, bold: true, spacing: { before: 200 } }),
        ...content.split('\n').map(p => new Paragraph({ text: p })),
    ];

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ text: "MONTHLY / PROJECT REPORT", heading: "Title", alignment: "center" }),
          new Paragraph({ text: "" }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
                new TableRow({ children: [new TableCell({ children: [new Paragraph("Report Title:")], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }), new TableCell({ children: [new Paragraph(formData.reportTitle)], columnSpan: 3, borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } })] }),
                new TableRow({ children: [new TableCell({ children: [new Paragraph("Prepared By:")], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }), new TableCell({ children: [new Paragraph(formData.preparedBy)], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }), new TableCell({ children: [new Paragraph("Department:")], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }), new TableCell({ children: [new Paragraph(formData.department)], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } })] }),
                new TableRow({ children: [new TableCell({ children: [new Paragraph("Report Period:")], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }), new TableCell({ children: [new Paragraph(`From ${formData.periodFrom} To ${formData.periodTo}`)], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }), new TableCell({ children: [new Paragraph("Date Submitted:")], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }), new TableCell({ children: [new Paragraph(formData.dateSubmitted)], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } })] }),
            ]
          }),
          new Paragraph({ text: "" }),
          ...createSection("1. Executive Summary", formData.executiveSummary),
          ...createSection("2. Key Achievements & Milestones", formData.achievements),
          ...createSection("3. Challenges Encountered & Resolutions", formData.challenges),
          ...createSection("4. Financial / Resource Summary (if applicable)", formData.financialSummary),
          ...createSection("5. Planned Activities for Next Period", formData.plannedActivities),
          new Paragraph({ text: "", spacing: { before: 400 } }),
           new Table({
               width: { size: 100, type: WidthType.PERCENTAGE },
               rows: [
                   new TableRow({ children: [new TableCell({ children: [new Paragraph("Prepared By:"), new Paragraph(formData.preparedBy), new Paragraph({ text: "" }), new Paragraph({ children: [new ImageRun({ data: preparedBySig, transformation: { width: 150, height: 75 } })] }), new Paragraph(`Date: ${formData.preparedByDate}`)], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }), new TableCell({ children: [new Paragraph("Reviewed By:"), new Paragraph(formData.reviewedBy), new Paragraph({ text: "" }), ...(reviewedBySig ? [new Paragraph({ children: [new ImageRun({ data: reviewedBySig, transformation: { width: 150, height: 75 } })] })] : [new Paragraph("")]), new Paragraph(`Date: ${formData.reviewedByDate}`)], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } })] }),
               ]
           })
        ]
      }]
    });
    
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "ProjectReport.docx");
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-2xl tracking-wider">MONTHLY / PROJECT REPORT</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4 border-b pb-6">
            <div className="space-y-2">
                <Label htmlFor="reportTitle">Report Title</Label>
                <Input id="reportTitle" name="reportTitle" value={formData.reportTitle} onChange={handleInputChange} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2"><Label htmlFor="preparedBy">Prepared By</Label><Input id="preparedBy" name="preparedBy" value={formData.preparedBy} onChange={handleInputChange} /></div>
                <div className="space-y-2"><Label htmlFor="department">Department</Label><Input id="department" name="department" value={formData.department} onChange={handleInputChange} /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2"><Label htmlFor="periodFrom">Report Period: From</Label><Input id="periodFrom" name="periodFrom" type="date" value={formData.periodFrom} onChange={handleInputChange} /></div>
                <div className="space-y-2"><Label htmlFor="periodTo">To</Label><Input id="periodTo" name="periodTo" type="date" value={formData.periodTo} onChange={handleInputChange} /></div>
                <div className="space-y-2"><Label htmlFor="dateSubmitted">Date Submitted</Label><Input id="dateSubmitted" name="dateSubmitted" type="date" value={formData.dateSubmitted} onChange={handleInputChange} /></div>
            </div>
        </div>

        <Section title="1. Executive Summary" name="executiveSummary" value={formData.executiveSummary} onChange={handleInputChange} />
        <Section title="2. Key Achievements & Milestones" name="achievements" value={formData.achievements} onChange={handleInputChange} />
        <Section title="3. Challenges Encountered & Resolutions" name="challenges" value={formData.challenges} onChange={handleInputChange} />
        <Section title="4. Financial / Resource Summary (if applicable)" name="financialSummary" value={formData.financialSummary} onChange={handleInputChange} />
        <Section title="5. Planned Activities for Next Period" name="plannedActivities" value={formData.plannedActivities} onChange={handleInputChange} />

      </CardContent>
       <CardFooter className="flex flex-col items-start gap-8 border-t pt-6">
          <div className="w-full space-y-4">
              <div className="flex flex-wrap items-end gap-6">
                <SignaturePad sigPadRef={preparedBySigRef} title="Prepared By Signature" />
                <div className="grid w-full max-w-xs items-center gap-1.5">
                    <Label htmlFor="preparedByDate">Date</Label>
                    <Input id="preparedByDate" name="preparedByDate" type="date" value={formData.preparedByDate} onChange={handleInputChange} />
                </div>
              </div>
          </div>
          <div className="w-full space-y-4">
               <div className="space-y-2">
                    <Label htmlFor="reviewedBy">Reviewed By</Label>
                    <Input id="reviewedBy" name="reviewedBy" value={formData.reviewedBy} onChange={handleInputChange} className="max-w-sm"/>
                </div>
              <div className="flex flex-wrap items-end gap-6">
                <SignaturePad sigPadRef={reviewedBySigRef} title="Reviewed By Signature" />
                 <div className="grid w-full max-w-xs items-center gap-1.5">
                    <Label htmlFor="reviewedByDate">Date</Label>
                    <Input id="reviewedByDate" name="reviewedByDate" type="date" value={formData.reviewedByDate} onChange={handleInputChange} />
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

    