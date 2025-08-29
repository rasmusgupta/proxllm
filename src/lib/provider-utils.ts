// Utility to check which providers are available based on environment variables
// This runs client-side so we can't access process.env directly

export interface ProviderInfo {
  id: string;
  name: string;
  models: Array<{ id: string; name: string }>;
  available?: boolean;
}

export const PROVIDERS: ProviderInfo[] = [
  {
    id: 'anthropic',
    name: 'Anthropic',
    models: [
      { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku' },
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet' },
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus' },
    ]
  },
  {
    id: 'openai',
    name: 'OpenAI',
    models: [
      { id: 'gpt-4', name: 'GPT-4' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
    ]
  },
  {
    id: 'google',
    name: 'Google',
    models: [
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
    ]
  }
];

// Check provider availability via API endpoint
export async function checkProviderAvailability(): Promise<Record<string, boolean>> {
  try {
    const response = await fetch('/api/providers/check');
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Failed to check provider availability:', error);
  }
  
  // Default to assuming all providers are available if check fails
  return {
    anthropic: true,
    openai: true,
    google: true
  };
}