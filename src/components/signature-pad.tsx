
"use client";

import React from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

interface SignaturePadProps {
  sigPadRef: React.RefObject<SignatureCanvas>;
  title?: string;
}

export function SignaturePad({ sigPadRef, title = "Signature" }: SignaturePadProps) {
  const clearSignature = () => {
    sigPadRef.current?.clear();
  };

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="signature">{title}</Label>
      <div className="rounded-md border border-input bg-background">
        <SignatureCanvas
          ref={sigPadRef}
          penColor="black"
          canvasProps={{
            width: 380,
            height: 150,
            className: "sigCanvas",
          }}
        />
      </div>
      <Button variant="outline" size="sm" onClick={clearSignature} className="mt-1">
        Clear Signature
      </Button>
    </div>
  );
}
