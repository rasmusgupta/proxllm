import { BaseLLMProvider } from './base';
import type { LLMProvider, ChatRequest, ChatResponse } from '@/types';

export class OpenAIProvider extends BaseLLMProvider {
  getProviderName(): LLMProvider {
    return 'openai';
  }

  getDefaultBaseURL(): string {
    return 'https://api.openai.com/v1';
  }

  getAvailableModels(): string[] {
    return [
      'gpt-4o',
      'gpt-4o-mini',
      'gpt-4-turbo',
      'gpt-4',
      'gpt-3.5-turbo',
      'gpt-3.5-turbo-16k',
    ];
  }

  protected getAuthHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
    };
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    this.validateRequest(request);

    const response = await this.makeRequest(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      body: JSON.stringify({
        model: request.model,
        messages: this.formatMessages(request.messages),
        temperature: request.temperature || 0.7,
        max_tokens: request.maxTokens || 2048,
        stream: false,
      }),
    });

    const data = await response.json();
    
    if (!data.choices || !data.choices[0]) {
      throw new Error('Invalid response from OpenAI API');
    }

    const choice = data.choices[0];
    const content = choice.message?.content || '';

    return {
      id: data.id,
      content,
      tokensUsed: data.usage?.total_tokens || this.countTokens(content),
      model: request.model,
      provider: 'openai',
      finishReason: choice.finish_reason,
    };
  }

  async* chatStream(request: ChatRequest): AsyncGenerator<string, void, unknown> {
    this.validateRequest(request);

    const response = await this.makeRequest(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      body: JSON.stringify({
        model: request.model,
        messages: this.formatMessages(request.messages),
        temperature: request.temperature || 0.7,
        max_tokens: request.maxTokens || 2048,
        stream: true,
      }),
    });

    if (!response.body) {
      throw new Error('No response body received');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.trim() === '') continue;
          if (line.trim() === 'data: [DONE]') return;
          if (!line.startsWith('data: ')) continue;

          try {
            const data = JSON.parse(line.slice(6));
            const content = data.choices?.[0]?.delta?.content;
            
            if (content) {
              yield content;
            }
          } catch (error) {
            // Skip malformed JSON
            continue;
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}