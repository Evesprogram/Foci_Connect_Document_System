# FOCI Connect - Document Management System

This is a Next.js application built within Firebase Studio. It serves as an internal document management system for FOCI Group, allowing employees to generate, fill out, and share various company documents.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (with App Router)
- **UI:** [React](https://react.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
- **Generative AI:** [Firebase Genkit](https://firebase.google.com/docs/genkit) (for features like document summarization)
- **Deployment:** [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)

## Features

The application provides a centralized place to manage common company forms. Key features include:
- A user-friendly interface for filling out forms.
- Ability to share direct links to specific forms for collaborative data entry.
- Export functionality to generate professional `.docx` files for all documents.
- PDF export available for the Tax Invoice form.
- An AI-powered document summarizer on the home page.

### Available Documents
- Tax Invoice
- Purchase Order
- Acceptance Letter
- Notice Letter
- Leave Application
- Log Sheet
- Month-End Report
- Site Incident Report
- Memorandum

## Getting Started

### Prerequisites
- Node.js (v18 or later recommended)
- npm or yarn

### Running the Development Server

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the Next.js development server:**
   ```bash
   npm run dev
   ```

The application will be available at [http://localhost:9002](http://localhost:9002).

## Deployment

This project is configured for easy deployment using Firebase App Hosting. To publish the application and make it available on a public URL, use the "Publish" button within the Firebase Studio interface. This requires linking a Google Cloud Billing account, which will upgrade the project to the Blaze (pay-as-you-go) plan.
