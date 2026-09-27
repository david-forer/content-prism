import { Button } from '../ui';

interface HeaderProps {
  onSettingsClick: () => void;
  onNewSession: () => void;
}

export function Header({ onSettingsClick, onNewSession }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/60 px-6 py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500 to-accent-500 rounded-lg opacity-20 blur-sm" />
            <svg viewBox="0 0 100 100" className="w-full h-full relative">
              <defs>
                <linearGradient id="prism-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#8b5cf6' }} />
                  <stop offset="50%" style={{ stopColor: '#a78bfa' }} />
                  <stop offset="100%" style={{ stopColor: '#f43f5e' }} />
                </linearGradient>
                <filter id="prism-glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <polygon
                points="50,10 90,80 10,80"
                fill="url(#prism-grad)"
                filter="url(#prism-glow)"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient">Content Prism</h1>
            <p className="text-xs text-slate-500 -mt-0.5">Transform your ideas</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="primary" size="sm" onClick={onNewSession}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Session
          </Button>
          <Button variant="ghost" size="sm" onClick={onSettingsClick} className="p-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </Button>
        </div>
      </div>
    </header>
  );
}
