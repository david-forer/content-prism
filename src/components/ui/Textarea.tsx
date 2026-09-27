import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-slate-700 mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`
            block w-full rounded-lg border-slate-200 shadow-sm
            bg-white text-slate-900 placeholder-slate-400
            focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20
            text-sm py-3 px-4 border resize-none
            transition-all duration-200
            hover:border-slate-300
            leading-relaxed
            ${error ? 'border-accent-500 focus:border-accent-500 focus:ring-accent-500/20' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-accent-600">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
