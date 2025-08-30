import type { LLMProvider, ChatRequest, ChatResponse } from '@/types';

export abstract class BaseLLMProvider {
  protected apiKey: string;
  protected baseURL: string;
  
  constructor(apiKey: string, baseURL?: string) {
    this.apiKey = apiKey;
    this.baseURL = baseURL || this.getDefaultBaseURL();
  }

  abstract getProviderName(): LLMProvider;
  abstract getDefaultBaseURL(): string;
  abstract getAvailableModels(): string[];
  abstract chat(request: ChatRequest): Promise<ChatResponse>;
  abstract chatStream(request: ChatRequest): AsyncGenerator<string, void, unknown>;

  protected validateRequest(request: ChatRequest): void {
    if (!request.messages || request.messages.length === 0) {
      throw new Error('Messages are required');
    }
    
    if (!request.model) {
      throw new Error('Model is required');
    }

    if (!this.apiKey) {
      throw new Error('API key is required');
    }
  }

  protected async makeRequest(
    url: string, 
    options: RequestInit
  ): Promise<Response> {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API request failed: ${response.status} - ${error}`);
    }

    return response;
  }

  protected abstract getAuthHeaders(): Record<string, string>;
  
  protected countTokens(text: string): number {
    // Simple token estimation (4 chars per token on average)
    return Math.ceil(text.length / 4);
  }

  protected formatMessages(messages: Array<{role: string; content: string}>): Array<{role: string; content: string}> {
    return messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
  }
}