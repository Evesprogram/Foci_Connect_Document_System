
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Bot, Building, Cog, Mail, Phone, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { handleContactSubmit, type ContactFormState, handleSummarize, type SummarizerState } from "@/app/actions";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";


import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import { FociLogo } from "./foci-logo";


const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

function ContactForm() {
    const { toast } = useToast();

    const form = useForm<z.infer<typeof contactFormSchema>>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            name: "",
            email: "",
            message: "",
        },
    });

    async function onSubmit(values: z.infer<typeof contactFormSchema>) {
        const result: ContactFormState = await handleContactSubmit(values);
        if (result.success) {
            toast({
                title: "Inquiry Sent!",
                description: result.message,
            });
            form.reset();
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: result.message,
            });
        }
    }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us how we can help..."
                  className="resize-none"
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Sending...' : 'Send Inquiry'}
        </Button>
      </form>
    </Form>
  );
}


const ServiceCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg border shadow-sm">
        <div className="p-4 bg-primary/10 rounded-full mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-headline font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
    </div>
)


function Summarizer() {
  const initialState: SummarizerState = { summary: '', progress: '' };
  const [state, formAction] = useActionState(handleSummarize, initialState);
  const { pending } = useFormStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Summarizer</CardTitle>
        <CardDescription>
          Paste any document content below and our AI will generate a concise summary for you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <Textarea
            name="content"
            placeholder="Paste your document content here..."
            className="resize-y"
            rows={8}
          />
          {state.error && <p className="text-sm font-medium text-destructive">{state.error}</p>}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Summarizing...' : 'Summarize Content'}
          </Button>
        </form>
        {(state.summary || state.progress) && (
            <div className="mt-6 space-y-4 rounded-lg border bg-secondary/50 p-4">
                {state.progress && <p className="text-sm text-muted-foreground">{state.progress}</p>}
                {state.summary && (
                    <div>
                        <h4 className="font-semibold text-foreground">Summary:</h4>
                        <p className="text-sm text-foreground whitespace-pre-wrap">{state.summary}</p>
                    </div>
                )}
            </div>
        )}
      </CardContent>
    </Card>
  )
}

export function HomePage() {
  
  const handleExport = async () => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({ children: [new TextRun({ text: "FOCI GROUP", bold: true})], alignment: AlignmentType.CENTER, heading: HeadingLevel.TITLE }),
          new Paragraph({ text: "Engineering | ICT | Smart Automation", alignment: AlignmentType.CENTER }),
          new Paragraph({ text: "" }),
          
          new Paragraph({ text: "Integrated Solutions for a Modern World", heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }),
          new Paragraph({ text: "FOCI Group delivers excellence in Engineering, ICT, and Smart Automation, providing innovative and reliable solutions tailored to your needs.", alignment: AlignmentType.CENTER }),
          new Paragraph({ text: "" }),

          new Paragraph({ text: "Our Services", heading: HeadingLevel.HEADING_2 }),
          
          new Paragraph({ children: [new TextRun({ text: "Engineering", bold: true })] }),
          new Paragraph({ text: "Providing top-tier engineering solutions across various sectors, ensuring quality, safety, and efficiency in every project." }),
          new Paragraph({ text: "" }),
          
          new Paragraph({ children: [new TextRun({ text: "ICT", bold: true })] }),
          new Paragraph({ text: "Delivering robust Information and Communications Technology infrastructure, services, and support to keep your business connected." }),
          new Paragraph({ text: "" }),
          
          new Paragraph({ children: [new TextRun({ text: "Smart Automation", bold: true })] }),
          new Paragraph({ text: "Implementing intelligent automation systems to streamline operations, increase productivity, and drive business growth." }),
          new Paragraph({ text: "" }),

          new Paragraph({ text: "Contact Information", heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ children: [new TextRun({ text: "Office: ", bold: true }), new TextRun("152 Dallas Avenue, Waterkloof Glen, Pretoria, 0010, South Africa")] }),
          new Paragraph({ children: [new TextRun({ text: "Phone: ", bold: true }), new TextRun("+27 12 943 6048")] }),
          new Paragraph({ children: [new TextRun({ text: "Email: ", bold: true }), new TextRun("info@foci.group")] }),
        ]
      }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "FociGroup-CompanyProfile.docx");
  };

  return (
    <div className="space-y-16">
        <section className="text-center">
            <h1 className="text-4xl font-headline font-bold tracking-tight lg:text-5xl">
                Integrated Solutions for a Modern World
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                FOCI Group delivers excellence in Engineering, ICT, and Smart Automation, providing innovative and reliable solutions tailored to your needs.
            </p>
             <div className="mt-6 flex justify-center">
                <Button onClick={handleExport}>Export Company Profile to Word</Button>
            </div>
        </section>
        
        <section>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <ServiceCard 
                    icon={<Cog className="h-8 w-8 text-primary" />} 
                    title="Engineering"
                    description="Providing top-tier engineering solutions across various sectors, ensuring quality, safety, and efficiency in every project."
                />
                <ServiceCard 
                    icon={<Wifi className="h-8 w-8 text-primary" />} 
                    title="ICT"
                    description="Delivering robust Information and Communications Technology infrastructure, services, and support to keep your business connected."
                />
                <ServiceCard 
                    icon={<Bot className="h-8 w-8 text-primary" />} 
                    title="Smart Automation"
                    description="Implementing intelligent automation systems to streamline operations, increase productivity, and drive business growth."
                />
            </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
             <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Get In Touch</CardTitle>
                    <CardDescription>
                        Have a question or a project in mind? We'd love to hear from you.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ContactForm />
                </CardContent>
            </Card>
            <div className="lg:col-span-3 space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4 text-muted-foreground">
                        <div className="flex items-start gap-4">
                            <Building className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold text-foreground">Our Office</h4>
                                <p>152 Dallas Avenue, Waterkloof Glen</p>
                                <p>Pretoria, 0010, South Africa</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <Phone className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold text-foreground">Phone</h4>
                                <p>+27 12 943 6048</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <Mail className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold text-foreground">Email</h4>
                                <p>info@foci.group</p>
                            </div>
                        </div>
                    </div>
                </div>
                 <Summarizer />
            </div>
        </section>
    </div>
  );
}

    

    
