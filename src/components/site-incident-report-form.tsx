
"use client";

import { useRef, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SignaturePad } from "@/components/signature-pad";
import SignatureCanvas from "react-signature-canvas";
import { Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, WidthType, BorderStyle, HeadingLevel, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
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
  const base64Data = base64.split(",")[1];
  return Buffer.from(base64Data, 'base64').buffer;
};

const initialIssueRow = { issue: "", risk: "", action: "" };
const initialActionRow = { action: "", responsible: "", due: "" };

export function SiteIncidentReportForm() {
  const { toast } = useToast();
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const [formData, setFormData] = useState({
    reportNo: "",
    date: "",
    rev: "00",
    reportType: "siteVisit",
    otherReportType: "",
    projectSiteName: "",
    client: "",
    reportPreparedBy: "",
    dateOfEvent: "",
    location: "",
    purpose: "",
    observations: "",
    conclusion: "",
    preparedBy: "",
    preparedByDate: "",
    reviewedBy: "",
    reviewedByDate: "",
  });

  const [issues, setIssues] = useState([initialIssueRow]);
  const [actions, setActions] = useState([initialActionRow]);

  const preparedBySigRef = useRef<SignatureCanvas>(null);
  const reviewedBySigRef = useRef<SignatureCanvas>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleReportTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, reportType: value }));
  };
  
  const handleTableChange = (setter: any) => (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setter((prev: any[]) => {
      const newRows = [...prev];
      newRows[index] = { ...newRows[index], [name]: value };
      return newRows;
    });
  };
  
  const addTableRow = (setter: any, initialRow: any) => () => setter((prev: any) => [...prev, initialRow]);

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

    const preparedBySig = getSignatureImage(preparedBySigRef);
    const reviewedBySig = getSignatureImage(reviewedBySigRef);
    
    if (!preparedBySig) {
      alert("Please provide the 'Prepared By' signature.");
      return;
    }
    
    const createSection = (title: string, content: string) => [
        new Paragraph({ text: title, bold: true, spacing: { before: 200 } }),
        ...content.split('\n').map(p => new Paragraph({ text: p })),
    ];

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ text: "FOCI GROUP (Pty) Ltd", bold: true, alignment: AlignmentType.CENTER }),
          new Paragraph({ text: "SITE / PROJECT / INCIDENT REPORT", heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }),
          new Paragraph({ text: "" }),
          
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
            rows: [ new TableRow({ children: [ new TableCell({ children: [new Paragraph({text: `Report No: ${formData.reportNo}`})]}), new TableCell({ children: [new Paragraph({text: `Date: ${formData.date}`})]}), new TableCell({ children: [new Paragraph({text: `Rev: ${formData.rev}`})]}) ]}) ]
          }),
          
          new Paragraph({ text: "" }),
          new Paragraph({ text: `Report Type: [${formData.reportType === 'siteVisit' ? 'X':' '}] Site Visit  [${formData.reportType === 'incident' ? 'X':' '}] Incident  [${formData.reportType === 'progress' ? 'X':' '}] Progress  [${formData.reportType === 'technical' ? 'X':' '}] Technical  [${formData.reportType === 'audit' ? 'X':' '}] Audit  [${formData.reportType === 'other' ? 'X':' '}] Other: ${formData.otherReportType}`}),
          new Paragraph({ text: "" }),
          
          new Table({
             width: { size: 100, type: WidthType.PERCENTAGE },
             borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
             rows: [
                 new TableRow({ children: [ new TableCell({ children: [new Paragraph({text: `Project / Site Name: ${formData.projectSiteName}`})] }) ]}),
                 new TableRow({ children: [ new TableCell({ children: [new Paragraph({text: `Client: ${formData.client}`})] }), new TableCell({ children: [new Paragraph({text: `Report Prepared By: ${formData.reportPreparedBy}`})] }) ]}),
                 new TableRow({ children: [ new TableCell({ children: [new Paragraph({text: `Date of Event/Visit: ${formData.dateOfEvent}`})] }), new TableCell({ children: [new Paragraph({text: `Location: ${formData.location}`})] }) ]}),
             ]
          }),

          ...createSection("1. Purpose of Visit / Report", formData.purpose),
          ...createSection("2. Observations / Findings", formData.observations),

          new Paragraph({ text: "3. Issues Identified & Risk Level", bold: true, spacing: { before: 200 } }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({ children: [new Paragraph("No")] }),
                  new TableCell({ children: [new Paragraph("Issue Description")] }),
                  new TableCell({ children: [new Paragraph("Risk (Low/Med/High)")] }),
                  new TableCell({ children: [new Paragraph("Recommended Action")] }),
                ],
              }),
              ...issues.map((issue, i) => new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph(String(i + 1))] }),
                  new TableCell({ children: [new Paragraph(issue.issue)] }),
                  new TableCell({ children: [new Paragraph(issue.risk)] }),
                  new TableCell({ children: [new Paragraph(issue.action)] }),
                ]
              }))
            ]
          }),

          new Paragraph({ text: "4. Recommendations & Corrective Actions", bold: true, spacing: { before: 200 } }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({ children: [new Paragraph("No")] }),
                  new TableCell({ children: [new Paragraph("Action Required")] }),
                  new TableCell({ children: [new Paragraph("Responsible Person")] }),
                  new TableCell({ children: [new Paragraph("Due Date")] }),
                ],
              }),
               ...actions.map((act, i) => new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph(String(i + 1))] }),
                  new TableCell({ children: [new Paragraph(act.action)] }),
                  new TableCell({ children: [new Paragraph(act.responsible)] }),
                  new TableCell({ children: [new Paragraph(act.due)] }),
                ]
              }))
            ]
          }),

          ...createSection("5. Conclusion", formData.conclusion),
          
          new Paragraph({ text: "", spacing: { before: 400 } }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({text: `Prepared By: ${formData.preparedBy}`}),
                      new Paragraph({ children: [new ImageRun({ data: preparedBySig, transformation: { width: 150, height: 75 } })] }),
                      new Paragraph({text: `Date: ${formData.preparedByDate}`}),
                    ]
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({text: `Reviewed By: ${formData.reviewedBy}`}),
                      ...(reviewedBySig ? [new Paragraph({ children: [new ImageRun({ data: reviewedBySig, transformation: { width: 150, height: 75 } })] })] : [new Paragraph("") ]),
                      new Paragraph({text: `Date: ${formData.reviewedByDate}`}),
                    ]
                  }),
                ]
              })
            ]
          })
        ]
      }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "Site-Incident-Report.docx");
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-2xl tracking-wider">FOCI GROUP (Pty) Ltd</CardTitle>
        <CardDescription className="font-headline text-xl">SITE / PROJECT / INCIDENT REPORT</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2"><Label>Report No</Label><Input name="reportNo" value={formData.reportNo} onChange={handleInputChange} /></div>
            <div className="space-y-2"><Label>Date</Label><Input name="date" type="date" value={formData.date} onChange={handleInputChange} /></div>
            <div className="space-y-2"><Label>Rev</Label><Input name="rev" value={formData.rev} onChange={handleInputChange} /></div>
        </div>

        <div className="space-y-3">
          <Label>Report Type</Label>
          <RadioGroup value={formData.reportType} onValueChange={handleReportTypeChange} className="flex flex-wrap gap-x-4 gap-y-2">
            <div className="flex items-center space-x-2"><RadioGroupItem value="siteVisit" id="siteVisit" /><Label htmlFor="siteVisit">Site Visit</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="incident" id="incident" /><Label htmlFor="incident">Incident</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="progress" id="progress" /><Label htmlFor="progress">Progress</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="technical" id="technical" /><Label htmlFor="technical">Technical</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="audit" id="audit" /><Label htmlFor="audit">Audit</Label></div>
            <div className="flex items-center gap-2"><RadioGroupItem value="other" id="other" /><Label htmlFor="other">Other:</Label><Input name="otherReportType" disabled={formData.reportType !== 'other'} value={formData.otherReportType} onChange={handleInputChange}/></div>
          </RadioGroup>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
            <div className="space-y-2"><Label>Project / Site Name</Label><Input name="projectSiteName" value={formData.projectSiteName} onChange={handleInputChange}/></div>
            <div className="space-y-2"><Label>Client</Label><Input name="client" value={formData.client} onChange={handleInputChange}/></div>
            <div className="space-y-2"><Label>Report Prepared By</Label><Input name="reportPreparedBy" value={formData.reportPreparedBy} onChange={handleInputChange}/></div>
            <div className="space-y-2"><Label>Date of Event/Visit</Label><Input name="dateOfEvent" type="date" value={formData.dateOfEvent} onChange={handleInputChange}/></div>
            <div className="space-y-2"><Label>Location</Label><Input name="location" value={formData.location} onChange={handleInputChange}/></div>
        </div>

        <div className="space-y-2 pt-6 border-t"><Label className="text-lg font-semibold">1. Purpose of Visit / Report</Label><Textarea name="purpose" value={formData.purpose} onChange={handleInputChange} /></div>
        <div className="space-y-2"><Label className="text-lg font-semibold">2. Observations / Findings</Label><Textarea name="observations" value={formData.observations} onChange={handleInputChange} /></div>
        
        <div className="space-y-4 pt-6 border-t">
          <Label className="text-lg font-semibold">3. Issues Identified & Risk Level</Label>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b"><th className="p-2 text-left">No</th><th className="p-2 text-left">Issue Description</th><th className="p-2 text-left">Risk</th><th className="p-2 text-left">Recommended Action</th></tr>
                </thead>
                <tbody>
                    {issues.map((row, i) => (
                        <tr key={i}><td className="p-1">{i + 1}</td><td className="p-1"><Input name="issue" value={row.issue} onChange={(e) => handleTableChange(setIssues)(i, e)} /></td><td className="p-1"><Input name="risk" value={row.risk} onChange={(e) => handleTableChange(setIssues)(i, e)} /></td><td className="p-1"><Input name="action" value={row.action} onChange={(e) => handleTableChange(setIssues)(i, e)} /></td></tr>
                    ))}
                </tbody>
            </table>
          </div>
          <Button variant="outline" size="sm" onClick={addTableRow(setIssues, initialIssueRow)}>Add Issue</Button>
        </div>
        
        <div className="space-y-4 pt-6 border-t">
          <Label className="text-lg font-semibold">4. Recommendations & Corrective Actions</Label>
           <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b"><th className="p-2 text-left">No</th><th className="p-2 text-left">Action Required</th><th className="p-2 text-left">Responsible Person</th><th className="p-2 text-left">Due Date</th></tr>
                </thead>
                <tbody>
                    {actions.map((row, i) => (
                        <tr key={i}><td className="p-1">{i + 1}</td><td className="p-1"><Input name="action" value={row.action} onChange={(e) => handleTableChange(setActions)(i, e)} /></td><td className="p-1"><Input name="responsible" value={row.responsible} onChange={(e) => handleTableChange(setActions)(i, e)} /></td><td className="p-1"><Input name="due" type="date" value={row.due} onChange={(e) => handleTableChange(setActions)(i, e)} /></td></tr>
                    ))}
                </tbody>
            </table>
          </div>
          <Button variant="outline" size="sm" onClick={addTableRow(setActions, initialActionRow)}>Add Action</Button>
        </div>

        <div className="space-y-2 pt-6 border-t"><Label className="text-lg font-semibold">5. Conclusion</Label><Textarea name="conclusion" value={formData.conclusion} onChange={handleInputChange} /></div>

      </CardContent>
      <CardFooter className="flex flex-col items-start gap-8 border-t pt-6">
        <div className="w-full grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <div className="space-y-2"><Label>Prepared By</Label><Input name="preparedBy" value={formData.preparedBy} onChange={handleInputChange} /></div>
                <div className="flex flex-wrap items-end gap-6"><SignaturePad sigPadRef={preparedBySigRef} title="Signature" /><div className="space-y-2 flex-1 min-w-[150px]"><Label>Date</Label><Input name="preparedByDate" type="date" value={formData.preparedByDate} onChange={handleInputChange} /></div></div>
            </div>
             <div className="space-y-4">
                <div className="space-y-2"><Label>Reviewed By</Label><Input name="reviewedBy" value={formData.reviewedBy} onChange={handleInputChange} /></div>
                <div className="flex flex-wrap items-end gap-6"><SignaturePad sigPadRef={reviewedBySigRef} title="Signature" /><div className="space-y-2 flex-1 min-w-[150px]"><Label>Date</Label><Input name="reviewedByDate" type="date" value={formData.reviewedByDate} onChange={handleInputChange} /></div></div>
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
