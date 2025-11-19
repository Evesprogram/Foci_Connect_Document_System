
'use server';

import { summarizeDocumentContent } from '@/ai/flows/summarize-document-content';
import { z } from 'zod';

// Summarizer Action
export type SummarizerState = {
  summary: string;
  progress: string;
  error?: string | null;
};

export async function handleSummarize(
  prevState: SummarizerState,
  formData: FormData,
): Promise<SummarizerState> {
  const content = formData.get('content') as string;
  if (!content || content.trim().length < 50) {
    return { summary: '', progress: '', error: 'Please provide at least 50 characters of content to summarize.' };
  }
  try {
    const result = await summarizeDocumentContent({ documentContent: content });
    return { ...result, error: null };
  } catch (e) {
    console.error(e);
    return { summary: '', progress: '', error: 'An unexpected error occurred while summarizing.' };
  }
}


// Contact Form Action
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

export type ContactFormState = {
  success: boolean;
  message: string;
}

export async function handleContactSubmit(
  values: z.infer<typeof contactFormSchema>
): Promise<ContactFormState> {
  const validatedFields = contactFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid form data. Please check your entries.",
    }
  }

  // Here you would typically send an email.
  // For this example, we'll just log it to the console.
  console.log("New Contact Form Submission:");
  console.log("Name:", validatedFields.data.name);
  console.log("Email:", validatedFields.data.email);
  console.log("Message:", validatedFields.data.message);
  console.log("This would be sent to info@foci.group");

  return {
    success: true,
    message: "Thank you for your inquiry! We will get back to you shortly.",
  }
}
