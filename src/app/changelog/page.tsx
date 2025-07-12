
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Rocket, Sparkles, Wrench } from 'lucide-react';

const changelogData = [
  {
    version: '1.1.0',
    date: 'July 26, 2024',
    icon: Rocket,
    title: 'New Features & Polish',
    changes: [
      {
        type: 'New',
        description:
          'Added the Online Notepad tool for quick text saving and local storage persistence.',
        variant: 'default',
      },
      {
        type: 'Improved',
        description:
          'Redesigned the site header and footer for a cleaner, more consistent look across all pages.',
        variant: 'secondary',
      },
      {
        type: 'Improved',
        description:
          'Replaced the theme toggle with a modern switch component for a better user experience.',
        variant: 'secondary',
      },
    ],
  },
  {
    version: '1.0.0',
    date: 'July 25, 2024',
    icon: Sparkles,
    title: 'Initial Release',
    changes: [
      {
        type: 'New',
        description: 'Initial release of Imgenix with 10 core tools.',
        variant: 'default',
      },
      {
        type: 'New',
        description: 'Launched with image and PDF manipulation utilities.',
        variant: 'default',
      },
      {
        type: 'Fixed',
        description:
          'Set up basic pages: Home, FAQ, Privacy Policy, and Terms of Service.',
        variant: 'destructive',
      },
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="space-y-4 text-center">
        <div className="flex items-center justify-center gap-3">
          <Wrench className="h-10 w-10 text-brand-blue" />
          <h1 className="font-body text-4xl font-bold text-brand-blue">
            CHANGELOG
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          See what's new and what's changed in Imgenix. We are constantly
          working to improve our tools and add new features.
        </p>
      </div>

      <div className="mt-12 space-y-8">
        {changelogData.map((release, index) => (
          <Card key={index} className="border-2" style={{ borderColor: 'hsl(var(--brand-blue))' }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <release.icon className="h-5 w-5 text-brand-blue" />
                  </div>
                  <CardTitle className="font-body text-2xl text-brand-blue">
                    {release.title}
                  </CardTitle>
                </div>
                <div className="text-right">
                  <p className="font-semibold">Version {release.version}</p>
                  <p className="text-sm text-muted-foreground">
                    {release.date}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {release.changes.map((change, changeIndex) => (
                  <li
                    key={changeIndex}
                    className="flex items-center gap-4 rounded-lg border bg-card p-3"
                  >
                    <Badge
                      variant={
                        change.variant as 'default' | 'secondary' | 'destructive'
                      }
                      className="w-20 justify-center"
                    >
                      {change.type}
                    </Badge>
                    <span className="text-muted-foreground">
                      {change.description}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
