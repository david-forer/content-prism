import { ReactNode } from 'react';

interface AppLayoutProps {
  sidebar: ReactNode;
  header: ReactNode;
  children: ReactNode;
}

export function AppLayout({ sidebar, header, children }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Subtle background gradient mesh */}
      <div className="fixed inset-0 bg-mesh pointer-events-none" />

      {sidebar}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {header}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
