import React, { useState } from 'react';
import { AIAssistant } from '../types/parser';
import { Bot, Settings, Shield, Volume2, VolumeX } from 'lucide-react';

interface AIAssistantManagerProps {
  assistants: AIAssistant[];
  onAssistantAdd: (assistant: Omit<AIAssistant, 'id'>) => void;
  onAssistantUpdate: (id: string, assistant: Partial<AIAssistant>) => void;
  onAssistantToggle: (id: string) => void;
  voiceConfig: any;
  onVoiceConfigUpdate: (config: any) => void;
}

export const AIAssistantManager: React.FC<AIAssistantManagerProps> = ({
  assistants,
  onAssistantAdd,
  onAssistantUpdate,
  onAssistantToggle,
  voiceConfig,
  onVoiceConfigUpdate
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAssistant, setEditingAssistant] = useState<string | null>(null);
  const [newAssistant, setNewAssistant] = useState({
    name: '',
    provider: 'free' as const,
    apiKey: '',
    model: '',
    isActive: true,
    permissions: {
      canModifyCode: false,
      canAccessDatabase: false,
      canManageProxies: false,
      canManageSites: false,
      canViewLogs: true
    },
    restrictions: {
      maxRequestsPerHour: 100,
      allowedDomains: [],
      forbiddenActions: []
    }
  });

  const providerModels = {
    openai: ['gpt-4', 'gpt-3.5-turbo', 'gpt-4-turbo'],
    anthropic: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
    google: ['gemini-pro', 'gemini-pro-vision'],
    local: ['llama2', 'codellama', 'mistral'],
    free: ['huggingface-inference', 'replicate-free', 'cohere-trial']
  };

  const femaleVoices = [
    'Алиса (Русский)',
    'Мария (Русский)',
    'Елена (Русский)',
    'Анна (Русский)',
    'Ольга (Русский)',
    'Татьяна (Русский)'
  ];

  const handleAddAssistant = () => {
    onAssistantAdd(newAssistant);
    setNewAssistant({
      name: '',
      provider: 'free',
      apiKey: '',
      model: '',
      isActive: true,
      permissions: {
        canModifyCode: false,
        canAccessDatabase: false,
        canManageProxies: false,
        canManageSites: false,
        canViewLogs: true
      },
      restrictions: {
        maxRequestsPerHour: 100,
        allowedDomains: [],
        forbiddenActions: []
      }
    });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Voice Configuration */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          {voiceConfig.enabled ? (
            <Volume2 className="w-6 h-6 text-green-500" />
          ) : (
            <VolumeX className="w-6 h-6 text-gray-400" />
          )}
          <h2 className="text-2xl font-bold text-gray-800">Голосовое управление</h2>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={voiceConfig.enabled}
                onChange={(e) => onVoiceConfigUpdate({ ...voiceConfig, enabled: e.target.checked })}
                className="w-5 h-5"
              />
              <span className="font-medium">Включить голосовое управление</span>
            </label>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Женский голос:</label>
                <select
                  value={voiceConfig.voice}
                  onChange={(e) => onVoiceConfigUpdate({ ...voiceConfig, voice: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  disabled={!voiceConfig.enabled}
                >
                  {femaleVoices.map((voice) => (
                    <option key={voice} value={voice}>{voice}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Язык:</label>
                <select
                  value={voiceConfig.language}
                  onChange={(e) => onVoiceConfigUpdate({ ...voiceConfig, language: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  disabled={!voiceConfig.enabled}
                >
                  <option value="ru-RU">Русский</option>
                  <option value="en-US">English</option>
                  <option value="uk-UA">Українська</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Скорость речи: {voiceConfig.speed}</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={voiceConfig.speed}
                onChange={(e) => onVoiceConfigUpdate({ ...voiceConfig, speed: parseFloat(e.target.value) })}
                className="w-full"
                disabled={!voiceConfig.enabled}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Высота тона: {voiceConfig.pitch}</label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={voiceConfig.pitch}
                onChange={(e) => onVoiceConfigUpdate({ ...voiceConfig, pitch: parseFloat(e.target.value) })}
                className="w-full"
                disabled={!voiceConfig.enabled}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Громкость: {voiceConfig.volume}</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={voiceConfig.volume}
                onChange={(e) => onVoiceConfigUpdate({ ...voiceConfig, volume: parseFloat(e.target.value) })}
                className="w-full"
                disabled={!voiceConfig.enabled}
              />
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistants */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-800">ИИ Помощники</h2>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Добавить помощника
          </button>
        </div>

        {showAddForm && (
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-4">Добавить ИИ помощника</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <input
                type="text"
                placeholder="Название помощника"
                value={newAssistant.name}
                onChange={(e) => setNewAssistant({ ...newAssistant, name: e.target.value })}
                className="border rounded-lg px-3 py-2"
              />
              <select
                value={newAssistant.provider}
                onChange={(e) => setNewAssistant({ 
                  ...newAssistant, 
                  provider: e.target.value as any,
                  model: providerModels[e.target.value as keyof typeof providerModels][0]
                })}
                className="border rounded-lg px-3 py-2"
              >
                <option value="free">Бесплатные API</option>
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
                <option value="google">Google</option>
                <option value="local">Локальные модели</option>
              </select>
              <select
                value={newAssistant.model}
                onChange={(e) => setNewAssistant({ ...newAssistant, model: e.target.value })}
                className="border rounded-lg px-3 py-2"
              >
                {providerModels[newAssistant.provider].map((model) => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
              {newAssistant.provider !== 'free' && newAssistant.provider !== 'local' && (
                <input
                  type="password"
                  placeholder="API ключ"
                  value={newAssistant.apiKey}
                  onChange={(e) => setNewAssistant({ ...newAssistant, apiKey: e.target.value })}
                  className="border rounded-lg px-3 py-2"
                />
              )}
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-3">Разрешения:</h4>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(newAssistant.permissions).map(([key, value]) => (
                  <label key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setNewAssistant({
                        ...newAssistant,
                        permissions: {
                          ...newAssistant.permissions,
                          [key]: e.target.checked
                        }
                      })}
                    />
                    <span className="text-sm">
                      {key === 'canModifyCode' && 'Изменять код'}
                      {key === 'canAccessDatabase' && 'Доступ к БД'}
                      {key === 'canManageProxies' && 'Управлять прокси'}
                      {key === 'canManageSites' && 'Управлять сайтами'}
                      {key === 'canViewLogs' && 'Просматривать логи'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-3">Ограничения:</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Запросов в час:</label>
                  <input
                    type="number"
                    value={newAssistant.restrictions.maxRequestsPerHour}
                    onChange={(e) => setNewAssistant({
                      ...newAssistant,
                      restrictions: {
                        ...newAssistant.restrictions,
                        maxRequestsPerHour: parseInt(e.target.value)
                      }
                    })}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddAssistant}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Добавить
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Отмена
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {assistants.map((assistant) => (
            <div key={assistant.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={assistant.isActive}
                    onChange={() => onAssistantToggle(assistant.id)}
                    className="w-5 h-5"
                  />
                  <div>
                    <div className="font-semibold">{assistant.name}</div>
                    <div className="text-sm text-gray-600">
                      {assistant.provider} • {assistant.model}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <button
                    onClick={() => setEditingAssistant(editingAssistant === assistant.id ? null : assistant.id)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {editingAssistant === assistant.id && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Разрешения:</h4>
                      <div className="space-y-2">
                        {Object.entries(assistant.permissions).map(([key, value]) => (
                          <label key={key} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => onAssistantUpdate(assistant.id, {
                                permissions: {
                                  ...assistant.permissions,
                                  [key]: e.target.checked
                                }
                              })}
                            />
                            <span className="text-sm">
                              {key === 'canModifyCode' && 'Изменять код'}
                              {key === 'canAccessDatabase' && 'Доступ к БД'}
                              {key === 'canManageProxies' && 'Управлять прокси'}
                              {key === 'canManageSites' && 'Управлять сайтами'}
                              {key === 'canViewLogs' && 'Просматривать логи'}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Ограничения:</h4>
                      <div>
                        <label className="block text-sm font-medium mb-2">Запросов в час:</label>
                        <input
                          type="number"
                          value={assistant.restrictions.maxRequestsPerHour}
                          onChange={(e) => onAssistantUpdate(assistant.id, {
                            restrictions: {
                              ...assistant.restrictions,
                              maxRequestsPerHour: parseInt(e.target.value)
                            }
                          })}
                          className="w-full border rounded-lg px-3 py-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};