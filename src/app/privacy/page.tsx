
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="space-y-4 text-center">
        <div className="flex items-center justify-center gap-3">
          <ShieldCheck className="h-10 w-10 text-brand-blue" />
          <h1 className="font-body text-4xl font-bold text-brand-blue">
            PRIVACY POLICY
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Your privacy is important to us. This policy explains how we handle
          your information.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-3xl">
        <Card className="border-2" style={{ borderColor: 'hsl(var(--brand-blue))' }}>
          <CardContent className="p-6">
            <article className="prose prose-zinc mx-auto dark:prose-invert">
              <h2 className="mt-8 font-body text-2xl font-bold text-brand-blue">
                1. Information We Collect
              </h2>
              <p>
                We collect information you provide directly to us. For example,
                we collect information when you create an account, use the
                services to process files, or communicate with us. The types of
                information we may collect include your email address, and any
                other information you choose to provide.
              </p>
              <p>
                When you use our services, we automatically collect information
                about your usage, including the tools you use, the files you
                upload, and the actions you take. We use Firebase for
                authentication, database, and storage services, which may
                collect usage data on our behalf.
              </p>

              <h2 className="mt-8 font-body text-2xl font-bold text-brand-blue">
                2. How We Use Information
              </h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Provide, maintain, and improve our services;</li>
                <li>
                  Process transactions and send you related information,
                  including confirmations and invoices;
                </li>
                <li>
                  Send you technical notices, updates, security alerts, and
                  support and administrative messages;
                </li>
                <li>
                  Respond to your comments, questions, and requests and provide
                  customer service;
                </li>
                <li>
                  Monitor and analyze trends, usage, and activities in
                  connection with our services;
                </li>
              </ul>

              <h2 className="mt-8 font-body text-2xl font-bold text-brand-blue">
                3. Information Sharing
              </h2>
              <p>
                We do not share your personal information with third parties
                except as described in this Privacy Policy. We may share
                information with vendors, consultants, and other service
                providers who need access to such information to carry out work
                on our behalf.
              </p>

              <h2 className="mt-8 font-body text-2xl font-bold text-brand-blue">
                4. Data Storage
              </h2>
              <p>
                We use Firebase, a Google-provided service, for data storage,
                including files you upload. Information is stored in secure
                data centers. By using our service, you consent to the
                processing and storage of your information in the United States
                and other countries where Google maintains facilities.
              </p>
              
               <h2 className="mt-8 font-body text-2xl font-bold text-brand-blue">
                5. Children's Privacy
              </h2>
               <p>
                Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that a child under 18 has provided us with personal information, we will take steps to delete such information. If you become aware that your child has provided us with personal information without your consent, please contact us.
              </p>

              <h2 className="mt-8 font-body text-2xl font-bold text-brand-blue">
                6. Your Choices
              </h2>
              <p>
                You may update, correct, or delete information about you at any
                time by logging into your online account or emailing us. If you
                wish to delete your account, please contact us, but note that
                we may retain certain information as required by law or for
                legitimate business purposes.
              </p>
            </article>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
