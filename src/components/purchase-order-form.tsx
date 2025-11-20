
"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, HeadingLevel, AlignmentType, ImageRun } from "docx";
import { saveAs } from "file-saver";
import { PlusCircle, Trash2, Share2, Copy } from "lucide-react";
import SignatureCanvas from "react-signature-canvas";
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

const SignaturePad = dynamic(() => import('./signature-pad').then(mod => mod.SignaturePad), { ssr: false });


const initialLineItem = { description: "", qty: 1, unitPrice: 0 };
const VAT_RATE = 0.15;

const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    return Buffer.from(base64.split(",")[1], 'base64');
};

export function PurchaseOrderForm() {
  const { toast } = useToast();
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);
  
  const [orderNo, setOrderNo] = useState("");
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [supplierName, setSupplierName] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [lineItems, setLineItems] = useState([initialLineItem]);
  const [totalExcl, setTotalExcl] = useState(0);
  const [vat, setVat] = useState(0);
  const [totalIncl, setTotalIncl] = useState(0);
  const [authorisedBy, setAuthorisedBy] = useState("");

  const authSigRef = useRef<SignatureCanvas>(null);

  useEffect(() => {
    const year = new Date().getFullYear();
    const uniqueNum = Math.floor(1000 + Math.random() * 9000);
    setOrderNo(`PO-FOC-${year}-${uniqueNum}`);
  }, []);

  useEffect(() => {
    const newSubtotal = lineItems.reduce((acc, item) => acc + (item.qty * item.unitPrice), 0);
    const newVat = newSubtotal * VAT_RATE;
    const newTotal = newSubtotal + newVat;
    setTotalExcl(newSubtotal);
    setVat(newVat);
    setTotalIncl(newTotal);
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
    const authSigBase64 = authSigRef.current?.getTrimmedCanvas().toDataURL("image/png");
    if (!authSigBase64 || authSigRef.current?.isEmpty()) {
        alert("Please provide the authorising signature.");
        return;
    }
    const authSigBuffer = base64ToArrayBuffer(authSigBase64);

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ children: [new TextRun({ text: "FOCI GROUP (Pty) Ltd", bold: true })], alignment: AlignmentType.CENTER }),
          new Paragraph({ text: "PURCHASE ORDER", heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }),
          new Paragraph(""),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph(`Order No: ${orderNo}`)] }),
                  new TableCell({ children: [new Paragraph({ text: `Date: ${orderDate}`, alignment: AlignmentType.RIGHT })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph(`Supplier: ${supplierName}`)] }),
                  new TableCell({ children: [new Paragraph({ text: `Delivery Date Required: ${deliveryDate}`, alignment: AlignmentType.RIGHT })] }),
                ],
              }),
            ],
          }),
          new Paragraph(""),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Item", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Description", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Qty", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Unit Price", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Total", bold: true })] })] }),
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
              new TableRow({ children: [new TableCell({ children: [] }), new TableCell({ children: [new Paragraph({ text: "Total Order Value (excl VAT):", alignment: AlignmentType.RIGHT })] }), new TableCell({ children: [new Paragraph({ text: `R ${formatCurrency(totalExcl)}`, alignment: AlignmentType.RIGHT })] })] }),
              new TableRow({ children: [new TableCell({ children: [] }), new TableCell({ children: [new Paragraph({ text: "VAT:", alignment: AlignmentType.RIGHT })] }), new TableCell({ children: [new Paragraph({ text: `R ${formatCurrency(vat)}`, alignment: AlignmentType.RIGHT })] })] }),
              new TableRow({ children: [new TableCell({ children: [] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Total Order Value (incl VAT):", bold: true })], alignment: AlignmentType.RIGHT })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `R ${formatCurrency(totalIncl)}`, bold: true })], alignment: AlignmentType.RIGHT })] })] }),
            ]
          }),
          new Paragraph(""),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
                 new TableRow({
                    children: [
                        new TableCell({
                            children: [
                                new Paragraph(`Authorised by: ${authorisedBy}`),
                            ],
                            borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({text: "Signature:"}),
                                new Paragraph({ children: [new ImageRun({ data: authSigBuffer, transformation: { width: 150, height: 40 } })] }),
                            ],
                            borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }
                        }),
                    ],
                }),
            ]
          })
        ],
      }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Purchase-Order-${orderNo}.docx`);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl tracking-wider">PURCHASE ORDER</CardTitle>
        <CardDescription>Create and export a new purchase order.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Order No:</Label>
            <Input value={orderNo} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="orderDate">Date:</Label>
            <Input id="orderDate" type="date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <Label htmlFor="supplierName">Supplier</Label>
            <Input id="supplierName" value={supplierName} onChange={(e) => setSupplierName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deliveryDate">Delivery Date Required</Label>
            <Input id="deliveryDate" type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
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
              <span className="text-muted-foreground">Total (excl VAT):</span>
              <span className="font-medium">R {formatCurrency(totalExcl)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">VAT (15%):</span>
              <span className="font-medium">R {formatCurrency(vat)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="font-bold text-lg">TOTAL (incl VAT):</span>
              <span className="font-bold text-lg">R {formatCurrency(totalIncl)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 border-t pt-6">
            <h3 className="font-semibold">Authorisation</h3>
            <div className="flex flex-wrap items-end gap-6">
                <div className="space-y-2 flex-grow">
                    <Label htmlFor="authorisedBy">Authorised by</Label>
                    <Input id="authorisedBy" value={authorisedBy} onChange={(e) => setAuthorisedBy(e.target.value)} />
                </div>
                <SignaturePad sigPadRef={authSigRef} title="Signature" />
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

    
