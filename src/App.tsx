import { useState, useEffect, useCallback } from 'react';
import {
  Session,
  Settings,
  SessionInput,
  Draft,
  HookStyle,
  InputMode,
  createEmptySessionInput,
  hasApiKey,
} from './types';
import { DEFAULT_ANGLE_KEYS } from './data/angles';
import {
  createSession,
  regenerateDraft,
} from './lib/generator';
import { generateDraftsWithAI, regenerateDraftWithAI } from './lib/ai-service';
import { sessionStorage, settingsStorage } from './lib/storage';
import {
  AppLayout,
  Header,
  Sidebar,
} from './components/layout';
import { IdeaInput, ContextForm, AnglePicker } from './components/input';
import { DraftGrid, ExportBar } from './components/draft';
import { SettingsModal } from './components/settings';
import { Button } from './components/ui';

export default function App() {
  // Settings state
  const [settings, setSettings] = useState<Settings>(() => settingsStorage.getSettings());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Session state
  const [sessions, setSessions] = useState<Session[]>(() => sessionStorage.getSessions());
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Input state
  const [input, setInput] = useState<SessionInput>(() => ({
    ...createEmptySessionInput(),
    selectedAngles: settings.defaultAngles.length > 0 ? settings.defaultAngles : DEFAULT_ANGLE_KEYS,
  }));

  // UI state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingAngles, setGeneratingAngles] = useState<Record<string, 'generating' | 'done' | 'error'>>({});

  // Load sessions on mount
  useEffect(() => {
    const savedCurrent = sessionStorage.getCurrentSession();
    if (savedCurrent) {
      setCurrentSession(savedCurrent);
      setInput({
        idea: savedCurrent.idea,
        audience: savedCurrent.audience,
        voice: savedCurrent.voice,
        domain: savedCurrent.domain,
        goal: savedCurrent.goal,
        length: savedCurrent.length,
        inputMode: savedCurrent.inputMode || 'idea',
        selectedAngles: savedCurrent.selectedAngles,
      });
    }
  }, []);

  // Save current session to localStorage when it changes
  useEffect(() => {
    sessionStorage.setCurrentSession(currentSession);
  }, [currentSession]);

  // Handle input changes
  const handleInputChange = useCallback((updates: Partial<SessionInput>) => {
    setInput(prev => ({ ...prev, ...updates }));
  }, []);

  // Generate drafts
  const handleGenerate = useCallback(async () => {
    if (!input.idea.trim()) {
      return;
    }

    if (input.selectedAngles.length === 0) {
      return;
    }

    setIsGenerating(true);
    setGeneratingAngles({});

    const useAI = hasApiKey(settings);

    if (useAI) {
      // Use AI generation as primary method
      try {
        const drafts = await generateDraftsWithAI({
          input,
          settings,
          onProgress: (angleKey, status) => {
            setGeneratingAngles(prev => ({ ...prev, [angleKey]: status }));
          },
        });

        const now = new Date().toISOString();
        const session: Session = {
          id: crypto.randomUUID(),
          createdAt: now,
          updatedAt: now,
          ...input,
          drafts,
          title: input.idea.split(/\s+/).slice(0, 5).join(' ') + (input.idea.split(/\s+/).length > 5 ? '...' : ''),
        };

        setCurrentSession(session);
        setHasUnsavedChanges(true);
      } catch (error) {
        console.error('AI generation failed:', error);
        // Fallback to template generation
        const session = createSession(input, settings.spiceEnabled);
        setCurrentSession(session);
        setHasUnsavedChanges(true);
      }
    } else {
      // Fallback to template-based generation
      await new Promise(resolve => setTimeout(resolve, 100));
      const session = createSession(input, settings.spiceEnabled);
      setCurrentSession(session);
      setHasUnsavedChanges(true);
    }

    setIsGenerating(false);
    setGeneratingAngles({});
  }, [input, settings]);

  // Save session
  const handleSaveSession = useCallback(() => {
    if (currentSession) {
      sessionStorage.saveSession(currentSession);
      setSessions(sessionStorage.getSessions());
      setHasUnsavedChanges(false);
    }
  }, [currentSession]);

  // Load session from history
  const handleSelectSession = useCallback((id: string) => {
    const session = sessionStorage.getSession(id);
    if (session) {
      setCurrentSession(session);
      setInput({
        idea: session.idea,
        audience: session.audience,
        voice: session.voice,
        domain: session.domain,
        goal: session.goal,
        length: session.length,
        inputMode: session.inputMode || 'idea',
        selectedAngles: session.selectedAngles,
      });
      setHasUnsavedChanges(false);
    }
  }, []);

  // Delete session
  const handleDeleteSession = useCallback((id: string) => {
    if (confirm('Are you sure you want to delete this session?')) {
      sessionStorage.deleteSession(id);
      setSessions(sessionStorage.getSessions());
      if (currentSession?.id === id) {
        setCurrentSession(null);
        setInput({
          ...createEmptySessionInput(),
          selectedAngles: settings.defaultAngles,
        });
        setHasUnsavedChanges(false);
      }
    }
  }, [currentSession, settings.defaultAngles]);

  // Duplicate session
  const handleDuplicateSession = useCallback((id: string) => {
    const duplicated = sessionStorage.duplicateSession(id);
    if (duplicated) {
      setSessions(sessionStorage.getSessions());
      setCurrentSession(duplicated);
      setInput({
        idea: duplicated.idea,
        audience: duplicated.audience,
        voice: duplicated.voice,
        domain: duplicated.domain,
        goal: duplicated.goal,
        length: duplicated.length,
        inputMode: duplicated.inputMode || 'idea',
        selectedAngles: duplicated.selectedAngles,
      });
      setHasUnsavedChanges(true);
    }
  }, []);

  // Clear all history
  const handleClearAll = useCallback(() => {
    if (confirm('Are you sure you want to delete all sessions? This cannot be undone.')) {
      sessionStorage.clearSessions();
      setSessions([]);
      setCurrentSession(null);
      setInput({
        ...createEmptySessionInput(),
        selectedAngles: settings.defaultAngles,
      });
      setHasUnsavedChanges(false);
    }
  }, [settings.defaultAngles]);

  // New session
  const handleNewSession = useCallback(() => {
    if (hasUnsavedChanges) {
      if (!confirm('You have unsaved changes. Start a new session anyway?')) {
        return;
      }
    }
    setCurrentSession(null);
    setInput({
      ...createEmptySessionInput(),
      selectedAngles: settings.defaultAngles.length > 0 ? settings.defaultAngles : DEFAULT_ANGLE_KEYS,
    });
    setHasUnsavedChanges(false);
  }, [hasUnsavedChanges, settings.defaultAngles]);

  // Update draft
  const handleUpdateDraft = useCallback((updatedDraft: Draft) => {
    if (!currentSession) return;

    const updatedDrafts = currentSession.drafts.map(d =>
      d.id === updatedDraft.id ? updatedDraft : d
    );

    setCurrentSession({
      ...currentSession,
      drafts: updatedDrafts,
      updatedAt: new Date().toISOString(),
    });
    setHasUnsavedChanges(true);
  }, [currentSession]);

  // Regenerate draft
  const handleRegenerateDraft = useCallback(async (draftId: string, hookStyle?: HookStyle) => {
    if (!currentSession) return;

    const draft = currentSession.drafts.find(d => d.id === draftId);
    if (!draft) return;

    const useAI = hasApiKey(settings);

    let newDraft: Draft | null = null;

    if (useAI) {
      // Use AI regeneration
      try {
        setGeneratingAngles(prev => ({ ...prev, [draft.angleKey]: 'generating' }));
        const sessionInput: SessionInput = {
          idea: currentSession.idea,
          audience: currentSession.audience,
          voice: currentSession.voice,
          domain: currentSession.domain,
          goal: currentSession.goal,
          length: currentSession.length,
          inputMode: currentSession.inputMode || 'idea',
          selectedAngles: currentSession.selectedAngles,
        };
        newDraft = await regenerateDraftWithAI(sessionInput, draft.angleKey, settings);
        setGeneratingAngles(prev => ({ ...prev, [draft.angleKey]: 'done' }));
      } catch (error) {
        console.error('AI regeneration failed:', error);
        setGeneratingAngles(prev => ({ ...prev, [draft.angleKey]: 'error' }));
        // Fallback to template
        newDraft = regenerateDraft(currentSession, draftId, settings.spiceEnabled, hookStyle);
      }
    } else {
      newDraft = regenerateDraft(currentSession, draftId, settings.spiceEnabled, hookStyle);
    }

    if (newDraft) {
      const updatedDrafts = currentSession.drafts.map(d =>
        d.id === draftId ? { ...newDraft!, id: draftId } : d
      );

      setCurrentSession({
        ...currentSession,
        drafts: updatedDrafts,
        updatedAt: new Date().toISOString(),
      });
      setHasUnsavedChanges(true);
    }

    // Clear generating status after a short delay
    setTimeout(() => {
      setGeneratingAngles(prev => {
        const newState = { ...prev };
        delete newState[draft.angleKey];
        return newState;
      });
    }, 500);
  }, [currentSession, settings]);

  // Copy draft (no-op for tracking)
  const handleCopyDraft = useCallback((_draftId: string) => {
    // Could track analytics here
  }, []);

  // Save settings
  const handleSaveSettings = useCallback((newSettings: Settings) => {
    settingsStorage.saveSettings(newSettings);
    setSettings(newSettings);
  }, []);

  const canGenerate = input.idea.trim().length > 0 && input.selectedAngles.length > 0;

  return (
    <AppLayout
      sidebar={
        <Sidebar
          sessions={sessions}
          currentSessionId={currentSession?.id}
          onSelectSession={handleSelectSession}
          onDeleteSession={handleDeleteSession}
          onDuplicateSession={handleDuplicateSession}
          onClearAll={handleClearAll}
        />
      }
      header={
        <Header
          onSettingsClick={() => setIsSettingsOpen(true)}
          onNewSession={handleNewSession}
        />
      }
    >
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Input Section */}
        <IdeaInput
          value={input.idea}
          onChange={value => handleInputChange({ idea: value })}
          inputMode={input.inputMode}
          onModeChange={(mode: InputMode) => handleInputChange({ inputMode: mode })}
          disabled={isGenerating}
        />

        <ContextForm
          input={input}
          onChange={handleInputChange}
          disabled={isGenerating}
        />

        <AnglePicker
          selectedAngles={input.selectedAngles}
          onChange={angles => handleInputChange({ selectedAngles: angles })}
          disabled={isGenerating}
        />

        {/* Generate Button */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleGenerate}
            disabled={!canGenerate || isGenerating}
            loading={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate Drafts'}
          </Button>
        </div>

        {/* Drafts Section */}
        {currentSession && currentSession.drafts.length > 0 && (
          <>
            <ExportBar
              session={currentSession}
              onSaveSession={handleSaveSession}
              hasUnsavedChanges={hasUnsavedChanges}
            />

            <DraftGrid
              drafts={currentSession.drafts}
              sessionLength={currentSession.length}
              onUpdateDraft={handleUpdateDraft}
              onRegenerateDraft={handleRegenerateDraft}
              onCopyDraft={handleCopyDraft}
              generatingAngles={generatingAngles}
            />
          </>
        )}
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={handleSaveSettings}
      />
    </AppLayout>
  );
}
