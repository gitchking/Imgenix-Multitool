
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ListChecks } from 'lucide-react';

const faqs = [
  {
    question: 'What is Imgenix?',
    answer:
      'Imgenix is a free collection of high-quality online tools designed to help you with common digital tasks, like converting files, editing images, and more.',
  },
  {
    question: 'Are my files safe?',
    answer:
      "Yes. We take your privacy and security seriously. Most tools operate entirely on your own computer (client-side), meaning your files are never uploaded to our servers. For tools that require server processing, files are typically deleted after a short period. For more details, please see our Privacy Policy.",
  },
  {
    question: 'Is Imgenix free to use?',
    answer:
      'Yes, all tools on Imgenix are completely free to use. We aim to provide powerful utilities accessible to everyone.',
  },
  {
    question: 'Do I need to create an account?',
    answer:
      'No, you can use most of our tools without creating an account. An account may be required for features that need to save your data, such as the Online Notepad history.',
  },
  {
    question: 'What browsers are supported?',
    answer:
      'Imgenix is designed to work on all modern web browsers, including Google Chrome, Mozilla Firefox, Safari, and Microsoft Edge. For the best experience, we recommend using the latest version of your browser.',
  },
];

export default function FaqPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="space-y-4 text-center">
        <div className="flex items-center justify-center gap-3">
          <ListChecks className="h-10 w-10 text-brand-blue" />
          <h1 className="font-body text-4xl font-bold text-brand-blue">
            FREQUENTLY ASKED QUESTIONS
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Find answers to the most common questions.
        </p>
      </div>

      <div className="mt-12 space-y-8">
        {faqs.map((faq, index) => (
          <Card
            key={index}
            className="border-2"
            style={{ borderColor: 'hsl(var(--brand-blue))' }}
          >
            <CardHeader>
              <CardTitle className="font-body text-xl text-brand-blue">
                <span className="mr-2">{index + 1}.</span> {faq.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base text-muted-foreground">{faq.answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
