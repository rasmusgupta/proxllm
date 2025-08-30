// Shared in-memory storage for demo mode
// This ensures all demo API endpoints use the same data

export interface DemoConversation {
  id: string;
  userId: string;
  title: string;
  modelProvider: string;
  modelName: string;
  createdAt: string;
  updatedAt: string;
  _count?: { messages: number };
}

export interface DemoMessage {
  id: string;
  conversationId: string;
  role: string;
  content: string;
  tokensUsed?: number;
  createdAt: string;
}

export interface DemoApiKey {
  id: string;
  provider: string;
  keyName: string;
  encryptedApiKey: string;
  isValid: boolean;
  createdAt: string;
}

// Shared storage arrays - using objects to allow mutation
export const demoStorage = {
  conversations: [] as DemoConversation[],
  messages: [] as DemoMessage[],
  apiKeys: [] as DemoApiKey[]
};

// Export direct references for compatibility
export const demoConversations = demoStorage.conversations;
export const demoMessages = demoStorage.messages;
export const demoApiKeys = demoStorage.apiKeys;

// Helper function to get API key for a provider
export function getDemoApiKey(provider: string): DemoApiKey | undefined {
  return demoApiKeys.find(key => key.provider === provider && key.isValid);
}