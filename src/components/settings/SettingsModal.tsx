import { useState, useEffect } from 'react';
import { Settings, AI_PROVIDER_LABELS, AIProvider, getEnvApiKey } from '../../types';
import { Modal, Button, Input, Select, Toggle } from '../ui';
import { settingsStorage } from '../../lib/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSave: (settings: Settings) => void;
}

export function SettingsModal({ isOpen, onClose, settings, onSave }: SettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<Settings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings, isOpen]);

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const handleReset = () => {
    const defaultSettings = settingsStorage.getSettings();
    setLocalSettings(defaultSettings);
  };

  const providerOptions = Object.entries(AI_PROVIDER_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings" size="md">
      <div className="space-y-6">
        {/* Generation Settings */}
        <section>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Generation</h4>

          <div className="space-y-4">
            <Toggle
              checked={localSettings.spiceEnabled}
              onChange={checked =>
                setLocalSettings(prev => ({ ...prev, spiceEnabled: checked }))
              }
              label="Spice Mode"
            />
            <p className="text-xs text-gray-500 ml-14 -mt-2">
              When enabled, adds variation to generated drafts. When disabled, same input always produces same output.
            </p>

            <Toggle
              checked={localSettings.hashtagsEnabled}
              onChange={checked =>
                setLocalSettings(prev => ({ ...prev, hashtagsEnabled: checked }))
              }
              label="Include Hashtags"
            />
            <p className="text-xs text-gray-500 ml-14 -mt-2">
              Add relevant hashtags to the end of drafts.
            </p>
          </div>
        </section>

        {/* AI Settings */}
        <section>
          <h4 className="text-sm font-medium text-gray-900 mb-3">AI Enhancement (Optional)</h4>
          <p className="text-xs text-gray-500 mb-4">
            AI enhancement is optional. The app works fully without an API key using templates.
          </p>

          <div className="space-y-4">
            <Select
              label="AI Provider"
              value={localSettings.aiProvider}
              onChange={e =>
                setLocalSettings(prev => ({
                  ...prev,
                  aiProvider: e.target.value as AIProvider,
                }))
              }
              options={providerOptions}
            />

            {localSettings.aiProvider !== 'none' && (
              <>
                {getEnvApiKey(localSettings.aiProvider) ? (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-800">
                      Using API key from .env file
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      {localSettings.aiProvider === 'openai' ? 'VITE_OPENAI_API_KEY' : 'VITE_ANTHROPIC_API_KEY'} is set
                    </p>
                  </div>
                ) : (
                  <Input
                    label="API Key"
                    type="password"
                    value={localSettings.apiKey}
                    onChange={e =>
                      setLocalSettings(prev => ({ ...prev, apiKey: e.target.value }))
                    }
                    placeholder={`Enter your ${localSettings.aiProvider === 'openai' ? 'OpenAI' : 'Anthropic'} API key`}
                  />
                )}
              </>
            )}

            {localSettings.aiProvider !== 'none' && !localSettings.apiKey && !getEnvApiKey(localSettings.aiProvider) && (
              <p className="text-xs text-amber-600">
                Without an API key, AI enhancement will be disabled. Set it in .env or enter it above.
              </p>
            )}
          </div>
        </section>

        {/* Data Management */}
        <section>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Data</h4>
          <p className="text-xs text-gray-500 mb-4">
            All data is stored locally in your browser. Nothing is sent to any server (except optional AI calls).
          </p>
        </section>
      </div>

      <div className="mt-6 flex justify-between">
        <Button variant="ghost" onClick={handleReset}>
          Reset to Defaults
        </Button>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </div>
    </Modal>
  );
}
