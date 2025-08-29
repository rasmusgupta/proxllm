import { OpenAIProvider } from './openai';
import { AnthropicProvider } from './anthropic';
import type { LLMProvider } from '@/types';
import type { BaseLLMProvider } from './base';

export function createLLMProvider(
  provider: LLMProvider, 
  apiKey: string
): BaseLLMProvider {
  switch (provider) {
    case 'openai':
      return new OpenAIProvider(apiKey);
    case 'anthropic':
      return new AnthropicProvider(apiKey);
    case 'google':
      throw new Error('Google provider not yet implemented');
    case 'cohere':
      throw new Error('Cohere provider not yet implemented');
    case 'huggingface':
      throw new Error('Hugging Face provider not yet implemented');
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

export const AVAILABLE_PROVIDERS: Array<{
  id: LLMProvider;
  name: string;
  description: string;
  models: string[];
}> = [
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT models from OpenAI including GPT-4 and GPT-3.5',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo'],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    description: 'Claude models from Anthropic including Claude-3',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022', 'claude-3-opus-20240229'],
  },
  {
    id: 'google',
    name: 'Google AI',
    description: 'Gemini models from Google AI',
    models: ['gemini-1.5-pro', 'gemini-1.5-flash'],
  },
  {
    id: 'cohere',
    name: 'Cohere',
    description: 'Command models from Cohere',
    models: ['command-r-plus', 'command-r'],
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    description: 'Open source models via Hugging Face',
    models: ['meta-llama/Llama-2-70b-chat-hf', 'mistralai/Mistral-7B-Instruct-v0.1'],
  },
];

export * from './base';
export * from './openai';
export * from './anthropic';