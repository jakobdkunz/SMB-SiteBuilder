import PreviewSidebarClient from "./PreviewSidebarClient";
import type { ReactNode } from "react";

export default function PreviewLayout({ children, params }: { children: ReactNode; params: Promise<{ siteId: string }> }) {
  // Next 15 passes params as a Promise in layouts
  // We render a static shell here and delegate interactivity to a client component
  const awaited = (params as unknown) as { siteId: string } | Promise<{ siteId: string }>;
  const siteIdPromise = Promise.resolve(awaited as Promise<{ siteId: string }>);
  return (
    <div className="w-full h-[calc(100vh-64px)] grid grid-cols-1 lg:grid-cols-[380px_1fr]">
      <SidebarWrapper siteIdPromise={siteIdPromise} />
      <main className="relative h-full overflow-auto">{children}</main>
    </div>
  );
}

async function SidebarWrapper({ siteIdPromise }: { siteIdPromise: Promise<{ siteId: string }> }) {
  const { siteId } = await siteIdPromise;
  return <PreviewSidebarClient siteId={siteId} />;
}


