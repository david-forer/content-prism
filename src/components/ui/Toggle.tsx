interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, label, disabled }: ToggleProps) {
  return (
    <label className={`flex items-center ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          disabled={disabled}
        />
        <div
          className={`
            block w-11 h-6 rounded-full transition-all duration-300
            ${checked
              ? 'bg-gradient-to-r from-brand-600 to-brand-500 shadow-sm'
              : 'bg-slate-200'}
            ${disabled ? 'opacity-50' : 'hover:opacity-90'}
            peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500/30 peer-focus-visible:ring-offset-2
          `}
        />
        <div
          className={`
            absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full shadow-sm
            transition-all duration-300 ease-out
            ${checked ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
      </div>
      {label && (
        <span className={`ml-3 text-sm font-medium ${disabled ? 'text-slate-400' : 'text-slate-700'}`}>
          {label}
        </span>
      )}
    </label>
  );
}
