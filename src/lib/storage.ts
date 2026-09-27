import { Session, Settings, DEFAULT_SETTINGS } from '../types';

const STORAGE_KEYS = {
  SESSIONS: 'content-prism-sessions',
  SETTINGS: 'content-prism-settings',
  CURRENT_SESSION: 'content-prism-current',
} as const;

/**
 * Generic localStorage wrapper with JSON serialization.
 */
function getItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

function removeItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to remove from localStorage:', error);
  }
}

/**
 * Session storage operations.
 */
export const sessionStorage = {
  /**
   * Get all saved sessions, sorted by updatedAt desc.
   */
  getSessions(): Session[] {
    const sessions = getItem<Session[]>(STORAGE_KEYS.SESSIONS, []);
    return sessions.sort((a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  },

  /**
   * Get a single session by ID.
   */
  getSession(id: string): Session | null {
    const sessions = this.getSessions();
    return sessions.find(s => s.id === id) || null;
  },

  /**
   * Save a session (create or update).
   */
  saveSession(session: Session): void {
    const sessions = this.getSessions();
    const index = sessions.findIndex(s => s.id === session.id);

    const updatedSession = {
      ...session,
      updatedAt: new Date().toISOString(),
    };

    if (index >= 0) {
      sessions[index] = updatedSession;
    } else {
      sessions.unshift(updatedSession);
    }

    setItem(STORAGE_KEYS.SESSIONS, sessions);
  },

  /**
   * Delete a session by ID.
   */
  deleteSession(id: string): void {
    const sessions = this.getSessions().filter(s => s.id !== id);
    setItem(STORAGE_KEYS.SESSIONS, sessions);
  },

  /**
   * Duplicate a session with a new ID.
   */
  duplicateSession(id: string): Session | null {
    const session = this.getSession(id);
    if (!session) return null;

    const now = new Date().toISOString();
    const duplicated: Session = {
      ...session,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      title: session.title ? `${session.title} (copy)` : undefined,
    };

    this.saveSession(duplicated);
    return duplicated;
  },

  /**
   * Clear all sessions.
   */
  clearSessions(): void {
    setItem(STORAGE_KEYS.SESSIONS, []);
    removeItem(STORAGE_KEYS.CURRENT_SESSION);
  },

  /**
   * Get the current working session (unsaved changes).
   */
  getCurrentSession(): Session | null {
    return getItem<Session | null>(STORAGE_KEYS.CURRENT_SESSION, null);
  },

  /**
   * Set the current working session.
   */
  setCurrentSession(session: Session | null): void {
    if (session) {
      setItem(STORAGE_KEYS.CURRENT_SESSION, session);
    } else {
      removeItem(STORAGE_KEYS.CURRENT_SESSION);
    }
  },
};

/**
 * Settings storage operations.
 */
export const settingsStorage = {
  /**
   * Get settings with defaults.
   */
  getSettings(): Settings {
    return getItem<Settings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  },

  /**
   * Save settings.
   */
  saveSettings(settings: Settings): void {
    setItem(STORAGE_KEYS.SETTINGS, settings);
  },

  /**
   * Reset settings to defaults.
   */
  resetSettings(): void {
    setItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  },

  /**
   * Update specific settings.
   */
  updateSettings(updates: Partial<Settings>): Settings {
    const current = this.getSettings();
    const updated = { ...current, ...updates };
    this.saveSettings(updated);
    return updated;
  },
};
