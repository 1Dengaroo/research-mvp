import { LandingHeader } from '@/components/landing/landing-header.client';
import { LandingFooter } from '@/components/shared/landing-footer';
import { DemoModal } from '@/components/landing/demo-modal.client';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="marketing bg-(--landing-bg)">
      <LandingHeader />
      {children}
      <LandingFooter />
      <DemoModal />
    </div>
  );
}
