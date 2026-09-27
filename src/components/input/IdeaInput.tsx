import { InputMode } from '../../types';
import { Textarea, Toggle } from '../ui';

interface IdeaInputProps {
  value: string;
  onChange: (value: string) => void;
  inputMode: InputMode;
  onModeChange: (mode: InputMode) => void;
  disabled?: boolean;
}

export function IdeaInput({
  value,
  onChange,
  inputMode,
  onModeChange,
  disabled,
}: IdeaInputProps) {
  const isContentMode = inputMode === 'content';

  const label = isContentMode ? 'Your Content' : 'Your Idea';
  const placeholder = isContentMode
    ? 'Paste your article, blog post, or existing content here. The AI will rewrite it using different angles while preserving the core message.'
    : 'Enter the core idea you want to turn into content. For example: How to write better documentation.';
  const helpText = isContentMode
    ? 'Paste a full article or post. The AI will extract key points and rewrite using your selected angles.'
    : 'Be specific. The more context you provide, the better the drafts.';
  const rows = isContentMode ? 8 : 3;

  return (
    <div className="bg-white rounded-xl shadow-soft border border-slate-200/60 p-5 transition-all duration-300 hover:shadow-soft-lg">
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-semibold text-slate-800">{label}</label>
        <div className="flex items-center gap-2.5 bg-slate-50 rounded-lg px-3 py-1.5">
          <span className={`text-xs font-medium transition-colors ${!isContentMode ? 'text-brand-600' : 'text-slate-500'}`}>
            Idea
          </span>
          <Toggle
            checked={isContentMode}
            onChange={checked => onModeChange(checked ? 'content' : 'idea')}
            disabled={disabled}
          />
          <span className={`text-xs font-medium transition-colors ${isContentMode ? 'text-brand-600' : 'text-slate-500'}`}>
            Content
          </span>
        </div>
      </div>
      <Textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className="text-base"
      />
      <p className="mt-2.5 text-xs text-slate-500 flex items-center gap-1.5">
        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {helpText}
      </p>
    </div>
  );
}
