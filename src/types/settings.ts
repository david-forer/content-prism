export type AIProvider = 'none' | 'openai' | 'anthropic';

export interface Settings {
  spiceEnabled: boolean;
  hashtagsEnabled: boolean;
  apiKey: string;
  aiProvider: AIProvider;
  defaultAngles: string[];
}

export const DEFAULT_SETTINGS: Settings = {
  spiceEnabled: false,
  hashtagsEnabled: false,
  apiKey: '',
  aiProvider: 'none',
  defaultAngles: [
    'story',
    'mistake',
    'quick-tip',
    'myth',
    'tutorial',
    'before-after',
    'lessons',
  ],
};

export const AI_PROVIDER_LABELS: Record<AIProvider, string> = {
  none: 'No AI (Templates Only)',
  openai: 'OpenAI',
  anthropic: 'Anthropic',
};

/**
 * Get API key from environment variables.
 * Vite exposes env vars prefixed with VITE_ to the client.
 */
export function getEnvApiKey(provider: AIProvider): string {
  if (provider === 'openai') {
    return import.meta.env.VITE_OPENAI_API_KEY || '';
  }
  if (provider === 'anthropic') {
    return import.meta.env.VITE_ANTHROPIC_API_KEY || '';
  }
  return '';
}

/**
 * Check if an API key is available (from env or settings).
 */
export function hasApiKey(settings: Settings): boolean {
  const envKey = getEnvApiKey(settings.aiProvider);
  return !!(envKey || settings.apiKey);
}

/**
 * Get the effective API key (env takes precedence).
 */
export function getEffectiveApiKey(settings: Settings): string {
  const envKey = getEnvApiKey(settings.aiProvider);
  return envKey || settings.apiKey;
}
