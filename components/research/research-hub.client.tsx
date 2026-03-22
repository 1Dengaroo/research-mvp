'use client';

import Link from 'next/link';
import { Mail } from 'lucide-react';
import { SessionsList } from './sessions-list.client';
import { ICPList } from './icp-list.client';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import type { ResearchSessionSummary, SavedICP } from '@/lib/types';
import { MAX_WIDTH } from '@/lib/layout';

export function ResearchHub({
  sessions,
  icps
}: {
  sessions: ResearchSessionSummary[];
  icps: SavedICP[];
}) {
  return (
    <div className={`mx-auto ${MAX_WIDTH} px-6 pt-10 pb-24`}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-lg font-semibold">Research</h1>
          <p className="text-muted-foreground text-xs">Manage sessions and saved profiles</p>
        </div>
        <Link
          href="/emails"
          className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-xs transition-colors"
        >
          <Mail className="size-3" />
          Sent Emails
        </Link>
      </div>

      <Tabs defaultValue="sessions">
        <TabsList className="mb-6">
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="icps">Saved Profiles</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions">
          <SessionsList sessions={sessions} />
        </TabsContent>
        <TabsContent value="icps">
          <ICPList icps={icps} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
