import { BaseLLMProvider } from './base';
import type { LLMProvider, ChatRequest, ChatResponse } from '@/types';

export class AnthropicProvider extends BaseLLMProvider {
  getProviderName(): LLMProvider {
    return 'anthropic';
  }

  getDefaultBaseURL(): string {
    return 'https://api.anthropic.com/v1';
  }

  getAvailableModels(): string[] {
    return [
      'claude-sonnet-4-20250514',
      'claude-3-5-sonnet-20241022',
      'claude-3-5-haiku-20241022',
      'claude-3-opus-20240229',
      'claude-3-sonnet-20240229',
      'claude-3-haiku-20240307',
    ];
  }

  protected getAuthHeaders(): Record<string, string> {
    return {
      'x-api-key': this.apiKey,
      'anthropic-version': '2023-06-01',
    };
  }

  private formatMessagesForAnthropic(messages: Array<{role: string; content: string}>) {
    // Anthropic requires alternating user/assistant messages and doesn't support system role in messages
    const systemMessages = messages.filter(m => m.role === 'system');
    const chatMessages = messages.filter(m => m.role !== 'system');
    
    const systemContent = systemMessages.map(m => m.content).join('\n');
    
    return {
      system: systemContent || undefined,
      messages: chatMessages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))
    };
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    this.validateRequest(request);

    const { system, messages } = this.formatMessagesForAnthropic(request.messages);

    const response = await this.makeRequest(`${this.baseURL}/messages`, {
      method: 'POST',
      body: JSON.stringify({
        model: request.model,
        max_tokens: request.maxTokens || 2048,
        temperature: request.temperature || 0.7,
        system,
        messages,
        stream: false,
      }),
    });

    const data = await response.json();
    
    if (!data.content || !data.content[0]) {
      throw new Error('Invalid response from Anthropic API');
    }

    const content = data.content[0].text || '';

    return {
      id: data.id,
      content,
      tokensUsed: data.usage?.output_tokens + data.usage?.input_tokens || this.countTokens(content),
      model: request.model,
      provider: 'anthropic',
      finishReason: data.stop_reason,
    };
  }

  async* chatStream(request: ChatRequest): AsyncGenerator<string, void, unknown> {
    this.validateRequest(request);

    const { system, messages } = this.formatMessagesForAnthropic(request.messages);

    const response = await this.makeRequest(`${this.baseURL}/messages`, {
      method: 'POST',
      body: JSON.stringify({
        model: request.model,
        max_tokens: request.maxTokens || 2048,
        temperature: request.temperature || 0.7,
        system,
        messages,
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
          if (!line.startsWith('data: ')) continue;

          try {
            const data = JSON.parse(line.slice(6));
            
            if (data.type === 'content_block_delta' && data.delta?.text) {
              yield data.delta.text;
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