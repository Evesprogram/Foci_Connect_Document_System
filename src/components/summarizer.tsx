"use client";

import { useActionState, useEffect } from "react";
import { handleSummarize, type SummarizerState } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

const initialState: SummarizerState = {
  summary: '',
  progress: '',
  error: null,
};

function SubmitButton() {
    // This hook is in canary and not yet typed for pending
    const { pending } = (useFormStatus as any)();
    return <Button type="submit" disabled={pending} className="bg-accent hover:bg-accent/90 text-accent-foreground">
        {pending ? "Summarizing..." : "Generate Summary"}
    </Button>
}

// A temporary workaround until useFormStatus is fully implemented and typed in the stable release.
declare global {
    var useFormStatus: () => { pending: boolean; data: FormData | null; method: string | null; action: ((formData: FormData) => Promise<void>) | null; };
}
const { useFormStatus } = require("react-dom");


export function Summarizer() {
  const [state, formAction] = useActionState(handleSummarize, initialState);

  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-headline font-bold text-center">AI Document Summarizer</h2>
      <Card>
        <form action={formAction}>
          <CardHeader>
            <CardTitle className="font-headline">Content Preview</CardTitle>
            <CardDescription>
              Paste the content of a document or article below to get an AI-generated summary.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              name="content"
              placeholder="Enter document content here... (minimum 50 characters)"
              rows={8}
              required
            />
             {state.error && (
                <p className="text-sm font-medium text-destructive pt-2">{state.error}</p>
            )}
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>

        {state.summary && (
           <div className="p-6 pt-0">
             <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle className="font-headline">Summary Generated!</AlertTitle>
                <AlertDescription className="space-y-2">
                    <p className="font-semibold">{state.progress}</p>
                    <p>{state.summary}</p>
                </AlertDescription>
             </Alert>
           </div>
        )}
      </Card>
    </section>
  );
}
