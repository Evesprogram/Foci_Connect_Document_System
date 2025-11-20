
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "./ui/textarea";
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, HeadingLevel, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import { PlusCircle, Trash2, Share2, Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast";


const initialLineItem = { description: "", qty: 1, unitPrice: 0 };
const VAT_RATE = 0.15;

export function TaxInvoiceForm() {
  const { toast } = useToast();
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);
  
  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientVat, setClientVat] = useState("");
  const [siteAddress, setSiteAddress] = useState("");
  const [lineItems, setLineItems] = useState([initialLineItem]);
  const [subtotal, setSubtotal] = useState(0);
  const [vat, setVat] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const year = new Date().getFullYear();
    const uniqueNum = Math.floor(1000 + Math.random() * 9000);
    setInvoiceNo(`INV-FOC-${year}-${uniqueNum}`);
  }, []);

  useEffect(() => {
    const newSubtotal = lineItems.reduce((acc, item) => acc + (item.qty * item.unitPrice), 0);
    const newVat = newSubtotal * VAT_RATE;
    const newTotal = newSubtotal + newVat;
    setSubtotal(newSubtotal);
    setVat(newVat);
    setTotal(newTotal);
  }, [lineItems]);

  const handleLineItemChange = (index: number, field: keyof typeof initialLineItem, value: string | number) => {
    const updatedLineItems = [...lineItems];
    const item = updatedLineItems[index];
    if (typeof item[field] === 'number') {
      (item[field] as number) = Number(value);
    } else {
      (item[field] as string) = String(value);
    }
    setLineItems(updatedLineItems);
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { ...initialLineItem }]);
  };

  const removeLineItem = (index: number) => {
    const updatedLineItems = [...lineItems];
    updatedLineItems.splice(index, 1);
    setLineItems(updatedLineItems);
  };

  const formatCurrency = (amount: number) => {
    return amount.toFixed(2);
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
    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ text: "FOCI GROUP (Pty) Ltd", bold: true, alignment: AlignmentType.CENTER }),
          new Paragraph({ text: "TAX INVOICE", heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }),
          new Paragraph(""),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph(`Invoice No: ${invoiceNo}`)] }),
                  new TableCell({ children: [new Paragraph({ text: `Date: ${invoiceDate}`, alignment: AlignmentType.RIGHT })] }),
                ],
              }),
            ],
          }),
          new Paragraph(""),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({ text: "Bill To:", bold: true }),
                      ...clientName.split('\n').map(p => new Paragraph(p)),
                      ...clientAddress.split('\n').map(p => new Paragraph(p)),
                      ...clientVat.split('\n').map(p => new Paragraph(p)),
                    ]
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({ text: "Ship To:", bold: true }),
                      ...siteAddress.split('\n').map(p => new Paragraph(p)),
                    ]
                  }),
                ]
              })
            ]
          }),
          new Paragraph(""),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Item", bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: "Description", bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: "Qty", bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: "Unit Price", bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: "Line Total", bold: true })] }),
                ],
              }),
              ...lineItems.map((item, index) => new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph(String(index + 1))] }),
                  new TableCell({ children: [new Paragraph(item.description)] }),
                  new TableCell({ children: [new Paragraph(String(item.qty))] }),
                  new TableCell({ children: [new Paragraph(formatCurrency(item.unitPrice))] }),
                  new TableCell({ children: [new Paragraph(formatCurrency(item.qty * item.unitPrice))] }),
                ]
              }))
            ]
          }),
          new Paragraph(""),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
            rows: [
              new TableRow({ children: [new TableCell({ children: [] }), new TableCell({ children: [new Paragraph({ text: "Subtotal:", alignment: AlignmentType.RIGHT })] }), new TableCell({ children: [new Paragraph({ text: `R ${formatCurrency(subtotal)}`, alignment: AlignmentType.RIGHT })] })] }),
              new TableRow({ children: [new TableCell({ children: [] }), new TableCell({ children: [new Paragraph({ text: "VAT (15%):", alignment: AlignmentType.RIGHT })] }), new TableCell({ children: [new Paragraph({ text: `R ${formatCurrency(vat)}`, alignment: AlignmentType.RIGHT })] })] }),
              new TableRow({ children: [new TableCell({ children: [] }), new TableCell({ children: [new Paragraph({ text: "TOTAL AMOUNT DUE:", bold: true, alignment: AlignmentType.RIGHT })] }), new TableCell({ children: [new Paragraph({ text: `R ${formatCurrency(total)}`, bold: true, alignment: AlignmentType.RIGHT })] })] }),
            ]
          }),
          new Paragraph(""),
          new Paragraph({ text: `Bank Details: FNB | Acc: 628 495 821 33 | Branch: 25-01-55 | Ref: ${invoiceNo}`, bold: true }),
          new Paragraph(""),
          new Paragraph({ text: "Terms: Payment within 30 days of invoice date.", italics: true }),
        ],
      }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Invoice-${invoiceNo}.docx`);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl tracking-wider">TAX INVOICE</CardTitle>
        <CardDescription>Create and export a new tax invoice.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Invoice No:</Label>
            <Input value={invoiceNo} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invoiceDate">Date:</Label>
            <Input id="invoiceDate" type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="font-semibold">Bill To:</h3>
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input id="clientName" value={clientName} onChange={(e) => setClientName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientAddress">Client Address</Label>
              <Textarea id="clientAddress" value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientVat">Client VAT No.</Label>
              <Input id="clientVat" value={clientVat} onChange={(e) => setClientVat(e.target.value)} />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold">Ship To:</h3>
            <div className="space-y-2">
              <Label htmlFor="siteAddress">Site/Delivery Address</Label>
              <Textarea id="siteAddress" value={siteAddress} onChange={(e) => setSiteAddress(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Line Items</h3>
          <div className="space-y-4">
            {lineItems.map((item, index) => (
              <div key={index} className="flex flex-wrap items-end gap-4 p-4 border rounded-md">
                <div className="flex-grow space-y-2 min-w-[200px]">
                  <Label htmlFor={`desc-${index}`}>Description</Label>
                  <Input id={`desc-${index}`} value={item.description} onChange={(e) => handleLineItemChange(index, "description", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`qty-${index}`}>Qty</Label>
                  <Input id={`qty-${index}`} type="number" value={item.qty} onChange={(e) => handleLineItemChange(index, "qty", e.target.value)} className="w-20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`price-${index}`}>Unit Price</Label>
                  <Input id={`price-${index}`} type="number" value={item.unitPrice} onChange={(e) => handleLineItemChange(index, "unitPrice", e.target.value)} className="w-32" />
                </div>
                <p className="font-medium min-w-[100px] text-right">R {formatCurrency(item.qty * item.unitPrice)}</p>
                <Button variant="ghost" size="icon" onClick={() => removeLineItem(index)} aria-label="Remove line item">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
          <Button variant="outline" onClick={addLineItem}><PlusCircle className="mr-2 h-4 w-4" />Add Line Item</Button>
        </div>

        <div className="flex justify-end">
          <div className="w-full max-w-sm space-y-2 text-right">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-medium">R {formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">VAT (15%):</span>
              <span className="font-medium">R {formatCurrency(vat)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="font-bold text-lg">TOTAL:</span>
              <span className="font-bold text-lg">R {formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
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
