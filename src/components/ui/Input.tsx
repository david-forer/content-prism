import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            block w-full rounded-lg border-slate-200 shadow-sm
            bg-white text-slate-900 placeholder-slate-400
            focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20
            text-sm py-2.5 px-3.5 border
            transition-all duration-200
            hover:border-slate-300
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

Input.displayName = 'Input';
