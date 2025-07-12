
import { Card, CardContent } from '@/components/ui/card';
import { BookText } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="space-y-4 text-center">
        <div className="flex items-center justify-center gap-3">
          <BookText className="h-10 w-10 text-brand-blue" />
          <h1 className="font-body text-4xl font-bold text-brand-blue">
            TERMS OF SERVICE
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          These terms govern your use of Imgenix and its related services.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-3xl">
        <Card className="border-2" style={{ borderColor: 'hsl(var(--brand-blue))' }}>
          <CardContent className="p-6">
            <article className="prose prose-zinc mx-auto dark:prose-invert">
              <p className="lead">
                By using our services, you agree to these terms. Please read
                them carefully.
              </p>

              <h2 className="mt-8 font-body text-2xl font-bold text-brand-blue">
                1. Use of Our Services
              </h2>
              <p>
                You must follow any policies made available to you within the
                Services. Don’t misuse our Services. For example, don’t
                interfere with our Services or try to access them using a
                method other than the interface and the instructions that we
                provide.
              </p>
              <p>
                Using our Services does not give you ownership of any
                intellectual property rights in our Services or the content you
                access. You may not use content from our Services unless you
                obtain permission from its owner or are otherwise permitted by
                law.
              </p>

              <h2 className="mt-8 font-body text-2xl font-bold text-brand-blue">
                2. Age Requirement
              </h2>
              <p>
                You must be at least 18 years old to use our Services. Certain sections of our services may contain content that is not appropriate for all ages. By accessing content marked as "NSFW" (Not Safe For Work) or that is otherwise age-restricted, you affirm that you are at least 18 years of age and that the material you are accessing is not illegal in your jurisdiction.
              </p>

              <h2 className="mt-8 font-body text-2xl font-bold text-brand-blue">
                3. Your Content in our Services
              </h2>
              <p>
                Our Services allow you to upload, submit, store, send and
                receive content. You retain ownership of any intellectual
                property rights that you hold in that content. In short, what
                belongs to you stays yours.
              </p>
              <p>
                When you upload, submit, store, send or receive content to or
                through our Services, you give us (and those we work with) a
                worldwide license to use, host, store, reproduce, modify,
                create derivative works, communicate, publish, publicly
                perform, publicly display and distribute such content. The
                rights you grant in this license are for the limited purpose of
                operating, promoting, and improving our Services, and to

                develop new ones.
              </p>

              <h2 className="mt-8 font-body text-2xl font-bold text-brand-blue">
                4. Modifying and Terminating our Services
              </h2>
              <p>
                We are constantly changing and improving our Services. We may
                add or remove functionalities or features, and we may suspend
                or stop a Service altogether.
              </p>
              <p>
                You can stop using our Services at any time, although we’ll be
                sorry to see you go. We may also stop providing Services to
                you, or add or create new limits to our Services at any time.
              </p>

              <h2 className="mt-8 font-body text-2xl font-bold text-brand-blue">
                5. Disclaimers and Limitation of Liability
              </h2>
              <p>
                The Services are provided "as is". We do not make any specific
                promises about the Services. For example, we don’t make any
                commitments about the content within the Services, the
                specific functions of the Services, or their reliability,
                availability, or ability to meet your needs.
              </p>
            </article>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
