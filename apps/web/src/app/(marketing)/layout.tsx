import type { ReactNode } from 'react';

import { SiteFooter } from './_components/site-footer';
import { SiteHeader } from './_components/site-header';

type MarketingLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
