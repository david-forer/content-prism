import { Session, Draft } from '../types';
import { getAngleByKey } from '../data/angles';

/**
 * Export a session to Markdown format.
 */
export function exportToMarkdown(session: Session): string {
  const lines: string[] = [
    `# ${session.title || 'Content Drafts'}`,
    '',
    `**Idea:** ${session.idea}`,
    `**Audience:** ${session.audience || 'Not specified'}`,
    `**Domain:** ${session.domain}`,
    `**Goal:** ${session.goal}`,
    `**Length:** ${session.length}`,
    `**Created:** ${new Date(session.createdAt).toLocaleDateString()}`,
    '',
    '---',
    '',
  ];

  session.drafts.forEach((draft, index) => {
    const angle = getAngleByKey(draft.angleKey);
    lines.push(`## ${index + 1}. ${angle?.name || draft.angleKey}`);
    lines.push('');
    lines.push(draft.text);
    lines.push('');
    lines.push(`*${draft.wordCount} words | ~${draft.readTime} min read*`);
    if (draft.isEdited) {
      lines.push('*(edited)*');
    }
    lines.push('');
    lines.push('---');
    lines.push('');
  });

  return lines.join('\n');
}

/**
 * Export a session to CSV format.
 */
export function exportToCSV(session: Session): string {
  const headers = [
    'Session ID',
    'Created',
    'Idea',
    'Angle Key',
    'Angle Name',
    'Category',
    'Goal',
    'Length',
    'Draft',
    'Word Count',
    'Read Time',
    'Edited',
  ];

  const rows: string[][] = [headers];

  session.drafts.forEach(draft => {
    const angle = getAngleByKey(draft.angleKey);
    rows.push([
      session.id,
      new Date(session.createdAt).toISOString(),
      escapeCSV(session.idea),
      draft.angleKey,
      angle?.name || draft.angleKey,
      angle?.category || '',
      session.goal,
      session.length,
      escapeCSV(draft.text),
      draft.wordCount.toString(),
      draft.readTime.toString(),
      draft.isEdited ? 'yes' : 'no',
    ]);
  });

  return rows.map(row => row.join(',')).join('\n');
}

/**
 * Export a single draft to Markdown.
 */
export function exportDraftToMarkdown(draft: Draft, session: Session): string {
  const angle = getAngleByKey(draft.angleKey);
  return [
    `# ${angle?.name || draft.angleKey}`,
    '',
    draft.text,
    '',
    '---',
    '',
    `*Generated from: "${session.idea}"*`,
    `*${draft.wordCount} words | ~${draft.readTime} min read*`,
    draft.isEdited ? '*(edited)*' : '',
  ].filter(Boolean).join('\n');
}

/**
 * Export all sessions to CSV (for backup).
 */
export function exportAllSessionsToCSV(sessions: Session[]): string {
  const headers = [
    'Session ID',
    'Title',
    'Created',
    'Updated',
    'Idea',
    'Audience',
    'Voice',
    'Domain',
    'Goal',
    'Length',
    'Angle Count',
    'Draft Count',
  ];

  const rows: string[][] = [headers];

  sessions.forEach(session => {
    rows.push([
      session.id,
      escapeCSV(session.title || ''),
      new Date(session.createdAt).toISOString(),
      new Date(session.updatedAt).toISOString(),
      escapeCSV(session.idea),
      escapeCSV(session.audience || ''),
      escapeCSV(session.voice || ''),
      session.domain,
      session.goal,
      session.length,
      session.selectedAngles.length.toString(),
      session.drafts.length.toString(),
    ]);
  });

  return rows.map(row => row.join(',')).join('\n');
}

/**
 * Escape a value for CSV format.
 */
function escapeCSV(text: string): string {
  if (!text) return '""';
  // If contains comma, newline, or quote, wrap in quotes and escape internal quotes
  if (text.includes(',') || text.includes('\n') || text.includes('"') || text.includes('\r')) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

/**
 * Download content as a file.
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copy text to clipboard.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Generate a filename for exports.
 */
export function generateFilename(session: Session, extension: string): string {
  const date = new Date(session.createdAt).toISOString().split('T')[0];
  const title = (session.title || 'drafts')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 30);
  return `content-prism-${title}-${date}.${extension}`;
}
