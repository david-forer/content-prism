import { useState, useRef, useEffect } from 'react';
import { Draft, HookStyle, HOOK_STYLE_LABELS, LengthType } from '../../types';
import { getAngleByKey } from '../../data/angles';
import { Button, CategoryBadge, Select } from '../ui';
import { HealthIndicator, HealthDot } from './HealthIndicator';
import { copyToClipboard } from '../../lib/exporter';
import { countWords, calculateReadTime, checkHealth } from '../../lib/health-checker';

interface DraftCardProps {
  draft: Draft;
  sessionLength: LengthType;
  onUpdate: (draft: Draft) => void;
  onRegenerate: (hookStyle?: HookStyle) => void;
  onCopy: () => void;
  isRegenerating?: boolean;
}

export function DraftCard({
  draft,
  sessionLength,
  onUpdate,
  onRegenerate,
  onCopy,
  isRegenerating = false,
}: DraftCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(draft.text);
  const [copied, setCopied] = useState(false);
  const [showHookPicker, setShowHookPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const angle = getAngleByKey(draft.angleKey);

  useEffect(() => {
    setEditedText(draft.text);
  }, [draft.text]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [isEditing]);

  const handleSave = () => {
    const newWordCount = countWords(editedText);
    const newReadTime = calculateReadTime(editedText);
    const newHealthNotes = checkHealth({ text: editedText, targetLength: sessionLength });

    onUpdate({
      ...draft,
      text: editedText,
      wordCount: newWordCount,
      readTime: newReadTime,
      healthNotes: newHealthNotes,
      isEdited: editedText !== draft.originalText,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedText(draft.text);
    setIsEditing(false);
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(draft.text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onCopy();
    }
  };

  const handleReset = () => {
    const newHealthNotes = checkHealth({ text: draft.originalText, targetLength: sessionLength });
    onUpdate({
      ...draft,
      text: draft.originalText,
      wordCount: countWords(draft.originalText),
      readTime: calculateReadTime(draft.originalText),
      healthNotes: newHealthNotes,
      isEdited: false,
    });
    setEditedText(draft.originalText);
  };

  const hookStyleOptions = Object.entries(HOOK_STYLE_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <div className="bg-white rounded-xl shadow-soft border border-slate-200/60 overflow-hidden transition-all duration-300 hover:shadow-soft-lg hover:border-brand-200/40 group">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <HealthDot notes={draft.healthNotes} />
            <h3 className="font-semibold text-slate-800">{angle?.name || draft.angleKey}</h3>
            {angle && <CategoryBadge category={angle.category} />}
            {draft.isEdited && (
              <span className="text-xs text-slate-500 italic bg-slate-100 px-2 py-0.5 rounded-full">(edited)</span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              ref={textareaRef}
              value={editedText}
              onChange={e => {
                setEditedText(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              className="w-full text-sm text-slate-700 leading-relaxed resize-none border border-slate-200 rounded-lg p-4 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all"
              rows={10}
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </div>
        ) : (
          <div
            className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap cursor-pointer hover:bg-slate-50/80 rounded-lg p-3 -m-3 transition-all duration-200 border border-transparent hover:border-slate-200/50"
            onClick={() => setIsEditing(true)}
          >
            {draft.text}
          </div>
        )}
      </div>

      {/* Health indicator */}
      <div className="px-5 pb-4">
        <HealthIndicator
          notes={draft.healthNotes}
          wordCount={draft.wordCount}
          readTime={draft.readTime}
        />
      </div>

      {/* Actions */}
      <div className="px-5 py-4 border-t border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className={copied ? 'text-emerald-600' : ''}
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copy
                </>
              )}
            </Button>

            {!isEditing && (
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit
              </Button>
            )}

            {draft.isEdited && (
              <Button variant="ghost" size="sm" onClick={handleReset}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                Reset
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {showHookPicker ? (
              <div className="flex items-center gap-2">
                <Select
                  options={hookStyleOptions}
                  value={draft.hookStyle}
                  onChange={e => {
                    onRegenerate(e.target.value as HookStyle);
                    setShowHookPicker(false);
                  }}
                  className="text-xs py-1"
                />
                <Button variant="ghost" size="sm" onClick={() => setShowHookPicker(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => setShowHookPicker(true)} disabled={isRegenerating}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  Hook
                </Button>
                <Button variant="primary" size="sm" onClick={() => onRegenerate()} disabled={isRegenerating}>
                  {isRegenerating ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      Regenerate
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
