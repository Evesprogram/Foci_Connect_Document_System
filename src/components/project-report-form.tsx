
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
        return ref.current.getTrimmedCanvas().toDataURL("image/png").split(",")[1];
      }
      return null;
    };

    const preparedBySig = getSignatureImage(preparedBySigRef);
    const reviewedBySig = getSignatureImage(reviewedBySigRef);

    if (!preparedBySig) {
      alert("Please ensure the 'Prepared By' signature is provided.");
      return;
    }

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ text: "MONTHLY / PROJECT REPORT", heading: "Title", alignment: "center" }),
          new Paragraph({ text: "" }),
          new Paragraph({ children: [new TextRun({ text: "Report Title: ", bold: true }), new TextRun(formData.reportTitle)] }),
          new Paragraph({ children: [new TextRun({ text: `Prepared By: ${formData.preparedBy}\t\tDepartment: ${formData.department}` })] }),
          new Paragraph({ children: [new TextRun({ text: `Report Period: From ${formData.periodFrom} To ${formData.periodTo}\tDate Submitted: ${formData.dateSubmitted}` })] }),
          new Paragraph({ text: "__________________________________________________________________________________" }),
          new Paragraph({ text: "1. Executive Summary", bold: true }),
          ...formData.executiveSummary.split('\n').map(p => new Paragraph({ text: p })),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "2. Key Achievements & Milestones", bold: true }),
          ...formData.achievements.split('\n').map(p => new Paragraph({ text: p })),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "3. Challenges Encountered & Resolutions", bold: true }),
          ...formData.challenges.split('\n').map(p => new Paragraph({ text: p })),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "4. Financial / Resource Summary (if applicable)", bold: true }),
          ...formData.financialSummary.split('\n').map(p => new Paragraph({ text: p })),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "5. Planned Activities for Next Period", bold: true }),
          ...formData.plannedActivities.split('\n').map(p => new Paragraph({ text: p })),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "__________________________________________________________________________________" }),
          new Paragraph({ text: "" }),
          new Paragraph({ children: [new TextRun({ text: `Prepared By: ${formData.preparedBy}\t` })] }),
          new Paragraph({ children: [new TextRun({ text: "Signature:", bold: true })] }),
          new Paragraph({ children: [new ImageRun({ data: Buffer.from(preparedBySig, 'base64'), transformation: { width: 150, height: 75 } })] }),
          new Paragraph({ children: [new TextRun({ text: `Date: ${formData.preparedByDate}` })] }),
          new Paragraph({ text: "" }),
          new Paragraph({ children: [new TextRun({ text: `Reviewed By: ${formData.reviewedBy}\t` })] }),
          new Paragraph({ children: [new TextRun({ text: "Signature:", bold: true })] }),
          ...(reviewedBySig ? [new Paragraph({ children: [new ImageRun({ data: Buffer.from(reviewedBySig, 'base64'), transformation: { width: 150, height: 75 } })] })] : []),
          new Paragraph({ children: [new TextRun({ text: `Date: ${formData.reviewedByDate}` })] }),
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
