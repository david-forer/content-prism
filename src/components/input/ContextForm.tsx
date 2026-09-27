import { SessionInput, DOMAIN_LABELS, GOAL_LABELS, LENGTH_LABELS, DomainType, GoalType, LengthType } from '../../types';
import { Input, Select } from '../ui';

interface ContextFormProps {
  input: SessionInput;
  onChange: (updates: Partial<SessionInput>) => void;
  disabled?: boolean;
}

export function ContextForm({ input, onChange, disabled }: ContextFormProps) {
  const domainOptions = Object.entries(DOMAIN_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  const goalOptions = Object.entries(GOAL_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  const lengthOptions = Object.entries(LENGTH_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <div className="bg-white rounded-xl shadow-soft border border-slate-200/60 p-5 transition-all duration-300 hover:shadow-soft-lg">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-100 to-brand-50 flex items-center justify-center">
          <svg className="w-4 h-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-slate-800">Context Settings</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Input
          label="Audience"
          value={input.audience}
          onChange={e => onChange({ audience: e.target.value })}
          placeholder="e.g., developers, marketers"
          disabled={disabled}
        />

        <Input
          label="Voice"
          value={input.voice}
          onChange={e => onChange({ voice: e.target.value })}
          placeholder="e.g., professional, casual"
          disabled={disabled}
        />

        <Select
          label="Domain"
          value={input.domain}
          onChange={e => onChange({ domain: e.target.value as DomainType })}
          options={domainOptions}
          disabled={disabled}
        />

        <Select
          label="Goal"
          value={input.goal}
          onChange={e => onChange({ goal: e.target.value as GoalType })}
          options={goalOptions}
          disabled={disabled}
        />

        <Select
          label="Length"
          value={input.length}
          onChange={e => onChange({ length: e.target.value as LengthType })}
          options={lengthOptions}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
