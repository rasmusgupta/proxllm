export interface User {
  id: string;
  clerkId: string | null;
  email: string;
  name: string | null;
  image?: string | null;
  role: 'ADMIN' | 'USER';
  status: 'ACTIVE' | 'SUSPENDED' | 'BANNED';
  plan: 'FREE' | 'PRO' | 'ENTERPRISE';
  tokensUsed: number;
  monthlyLimit?: number | null;
  lastActiveAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  emailVerified?: Date | null;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  modelProvider: string;
  modelName: string;
  createdAt: Date;
  updatedAt: Date;
  messages?: Message[];
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  tokensUsed?: number;
  createdAt: Date;
}

export interface ApiKey {
  id: string;
  userId: string;
  provider: LLMProvider;
  keyName: string;
  encryptedKey: string;
  createdAt: Date;
  isValid: boolean;
}

export interface UserPreferences {
  id: string;
  userId: string;
  theme: 'light' | 'dark' | 'system';
  defaultModel: string;
  maxTokens: number;
  temperature: number;
  streamingEnabled: boolean;
}

export type LLMProvider = 'openai' | 'anthropic' | 'google' | 'cohere' | 'huggingface';

export interface LLMModel {
  id: string;
  name: string;
  provider: LLMProvider;
  maxTokens: number;
  supportsStreaming: boolean;
  costPerToken?: number;
}

export interface ChatRequest {
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  model: string;
  provider: LLMProvider;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface ChatResponse {
  id: string;
  content: string;
  tokensUsed: number;
  model: string;
  provider: LLMProvider;
  finishReason?: 'stop' | 'length' | 'content_filter';
}