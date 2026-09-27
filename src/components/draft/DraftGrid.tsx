import { Draft, HookStyle, LengthType } from '../../types';
import { DraftCard } from './DraftCard';

interface DraftGridProps {
  drafts: Draft[];
  sessionLength: LengthType;
  onUpdateDraft: (draft: Draft) => void;
  onRegenerateDraft: (draftId: string, hookStyle?: HookStyle) => void;
  onCopyDraft: (draftId: string) => void;
  generatingAngles?: Record<string, 'generating' | 'done' | 'error'>;
}

export function DraftGrid({
  drafts,
  sessionLength,
  onUpdateDraft,
  onRegenerateDraft,
  onCopyDraft,
  generatingAngles = {},
}: DraftGridProps) {
  if (drafts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No drafts generated yet.</p>
        <p className="text-sm text-gray-400 mt-1">
          Enter your idea and click Generate to create content drafts.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {drafts.map(draft => (
        <DraftCard
          key={draft.id}
          draft={draft}
          sessionLength={sessionLength}
          onUpdate={onUpdateDraft}
          onRegenerate={hookStyle => onRegenerateDraft(draft.id, hookStyle)}
          onCopy={() => onCopyDraft(draft.id)}
          isRegenerating={generatingAngles[draft.angleKey] === 'generating'}
        />
      ))}
    </div>
  );
}
