import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { LLMProvider, UserPreferences } from '@/types';

interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  defaultModel: string;
  maxTokens: number;
  temperature: number;
  streamingEnabled: boolean;
  selectedProvider: LLMProvider;
  sidebarCollapsed: boolean;
}

interface SettingsActions {
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setDefaultModel: (model: string) => void;
  setMaxTokens: (tokens: number) => void;
  setTemperature: (temp: number) => void;
  setStreamingEnabled: (enabled: boolean) => void;
  setSelectedProvider: (provider: LLMProvider) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  loadUserPreferences: (preferences: UserPreferences) => void;
}

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  devtools(
    persist(
      (set) => ({
        theme: 'system',
        defaultModel: 'gpt-3.5-turbo',
        maxTokens: 2048,
        temperature: 0.7,
        streamingEnabled: true,
        selectedProvider: 'openai',
        sidebarCollapsed: false,

        setTheme: (theme) => set({ theme }),
        setDefaultModel: (defaultModel) => set({ defaultModel }),
        setMaxTokens: (maxTokens) => set({ maxTokens }),
        setTemperature: (temperature) => set({ temperature }),
        setStreamingEnabled: (streamingEnabled) => set({ streamingEnabled }),
        setSelectedProvider: (selectedProvider) => set({ selectedProvider }),
        setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
        
        loadUserPreferences: (preferences) => set({
          theme: preferences.theme as 'light' | 'dark' | 'system',
          defaultModel: preferences.defaultModel,
          maxTokens: preferences.maxTokens,
          temperature: preferences.temperature,
          streamingEnabled: preferences.streamingEnabled,
        }),
      }),
      {
        name: 'settings-store',
      }
    ),
    {
      name: 'settings-store',
    }
  )
);