import { Session } from '../../types';
import { Button } from '../ui';

interface SidebarProps {
  sessions: Session[];
  currentSessionId?: string;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onDuplicateSession: (id: string) => void;
  onClearAll: () => void;
}

export function Sidebar({
  sessions,
  currentSessionId,
  onSelectSession,
  onDeleteSession,
  onDuplicateSession,
  onClearAll,
}: SidebarProps) {
  return (
    <aside className="w-72 bg-white/50 backdrop-blur-sm border-r border-slate-200/60 flex flex-col h-full">
      <div className="p-4 border-b border-slate-200/60">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-100 to-brand-50 flex items-center justify-center">
            <svg className="w-4 h-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-800">History</h2>
            <p className="text-xs text-slate-500">{sessions.length} session{sessions.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {sessions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-sm text-slate-500">No saved sessions</p>
            <p className="text-xs text-slate-400 mt-1">Your history will appear here</p>
          </div>
        ) : (
          <ul className="space-y-1.5">
            {sessions.map(session => (
              <SessionItem
                key={session.id}
                session={session}
                isActive={session.id === currentSessionId}
                onSelect={() => onSelectSession(session.id)}
                onDelete={() => onDeleteSession(session.id)}
                onDuplicate={() => onDuplicateSession(session.id)}
              />
            ))}
          </ul>
        )}
      </div>

      {sessions.length > 0 && (
        <div className="p-3 border-t border-slate-200/60">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-accent-600 hover:text-accent-700 hover:bg-accent-50"
            onClick={onClearAll}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear All History
          </Button>
        </div>
      )}
    </aside>
  );
}

interface SessionItemProps {
  session: Session;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

function SessionItem({ session, isActive, onSelect, onDelete, onDuplicate }: SessionItemProps) {
  const date = new Date(session.createdAt);
  const formattedDate = date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <li
      className={`
        group relative rounded-lg p-3 cursor-pointer transition-all duration-200
        ${isActive
          ? 'bg-gradient-to-r from-brand-50 to-brand-100/60 text-brand-900 border border-brand-200/50 shadow-sm'
          : 'hover:bg-slate-50 border border-transparent hover:border-slate-200/50'}
      `}
      onClick={onSelect}
    >
      <div className="pr-14">
        <p className={`text-sm font-medium truncate ${isActive ? 'text-brand-900' : 'text-slate-800'}`}>
          {session.title || 'Untitled'}
        </p>
        <p className="text-xs text-slate-500 truncate mt-0.5">{session.idea}</p>
        <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formattedDate} at {formattedTime}
        </p>
      </div>

      <div className="absolute right-2 top-3 opacity-0 group-hover:opacity-100 flex gap-0.5 transition-opacity">
        <button
          onClick={e => {
            e.stopPropagation();
            onDuplicate();
          }}
          className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-md transition-colors"
          title="Duplicate"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </button>
        <button
          onClick={e => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1.5 text-slate-400 hover:text-accent-600 hover:bg-accent-50 rounded-md transition-colors"
          title="Delete"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </li>
  );
}
