import { useState } from 'react';
import { Session } from '../../types';
import { Button } from '../ui';
import {
  exportToMarkdown,
  exportToCSV,
  downloadFile,
  copyToClipboard,
  generateFilename,
} from '../../lib/exporter';

interface ExportBarProps {
  session: Session | null;
  onSaveSession: () => void;
  hasUnsavedChanges: boolean;
}

export function ExportBar({ session, onSaveSession, hasUnsavedChanges }: ExportBarProps) {
  const [copiedAll, setCopiedAll] = useState(false);

  if (!session || session.drafts.length === 0) {
    return null;
  }

  const handleCopyAll = async () => {
    const allText = session.drafts.map(d => d.text).join('\n\n---\n\n');
    const success = await copyToClipboard(allText);
    if (success) {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    }
  };

  const handleExportMD = () => {
    const content = exportToMarkdown(session);
    const filename = generateFilename(session, 'md');
    downloadFile(content, filename, 'text/markdown');
  };

  const handleExportCSV = () => {
    const content = exportToCSV(session);
    const filename = generateFilename(session, 'csv');
    downloadFile(content, filename, 'text/csv');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {session.drafts.length} draft{session.drafts.length !== 1 ? 's' : ''}
          </span>
          {hasUnsavedChanges && (
            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
              Unsaved changes
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyAll}
            className={copiedAll ? 'text-green-600' : ''}
          >
            {copiedAll ? 'Copied All!' : 'Copy All'}
          </Button>

          <Button variant="ghost" size="sm" onClick={handleExportMD}>
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export MD
          </Button>

          <Button variant="ghost" size="sm" onClick={handleExportCSV}>
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export CSV
          </Button>

          <Button variant="primary" size="sm" onClick={onSaveSession}>
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
              />
            </svg>
            Save Session
          </Button>
        </div>
      </div>
    </div>
  );
}
