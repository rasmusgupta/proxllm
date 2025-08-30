import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Conversation, Message } from '@/types';

interface ConversationState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  currentMessages: Message[];
  isLoading: boolean;
  error: string | null;
}

interface ConversationActions {
  setConversations: (conversations: Conversation[]) => void;
  setCurrentConversation: (conversation: Conversation | null) => void;
  setCurrentMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (messageId: string, content: string) => void;
  updateConversation: (conversationId: string, updates: Partial<Conversation>) => void;
  createConversation: (conversation: Omit<Conversation, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deleteConversation: (conversationId: string) => void;
  loadConversations: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useConversationStore = create<ConversationState & ConversationActions>()(
  devtools(
    (set, get) => ({
      conversations: [],
      currentConversation: null,
      currentMessages: [],
      isLoading: false,
      error: null,

      setConversations: (conversations) => set({ conversations }),
      
      setCurrentConversation: (conversation) => set({ 
        currentConversation: conversation,
        currentMessages: conversation?.messages || [] 
      }),
      
      setCurrentMessages: (messages) => set({ currentMessages: messages }),
      
      addMessage: (message) => set((state) => ({
        currentMessages: [...state.currentMessages, message]
      })),
      
      updateMessage: (messageId, content) => set((state) => ({
        currentMessages: state.currentMessages.map((msg) =>
          msg.id === messageId ? { ...msg, content } : msg
        )
      })),
      
      updateConversation: (conversationId, updates) => set((state) => ({
        conversations: state.conversations.map((conv) =>
          conv.id === conversationId ? { ...conv, ...updates, updatedAt: new Date() } : conv
        ),
        currentConversation: state.currentConversation?.id === conversationId 
          ? { ...state.currentConversation, ...updates, updatedAt: new Date() }
          : state.currentConversation
      })),

      createConversation: async (conversationData) => {
        try {
          const response = await fetch('/api/conversations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(conversationData),
          });

          if (response.ok) {
            const newConversation = await response.json();
            set((state) => ({
              conversations: [newConversation, ...state.conversations],
              currentConversation: newConversation,
              currentMessages: [],
            }));
          }
        } catch (error) {
          console.error('Error creating conversation:', error);
          // Fall back to local creation
          const newConversation: Conversation = {
            ...conversationData,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          
          set((state) => ({
            conversations: [newConversation, ...state.conversations],
            currentConversation: newConversation,
            currentMessages: [],
          }));
        }
      },

      loadConversations: async () => {
        try {
          set({ isLoading: true });
          const response = await fetch('/api/conversations');
          
          if (response.ok) {
            const conversations = await response.json();
            set({ conversations });
          }
        } catch (error) {
          console.error('Error loading conversations:', error);
          set({ error: 'Failed to load conversations' });
        } finally {
          set({ isLoading: false });
        }
      },
      
      deleteConversation: (conversationId) => set((state) => ({
        conversations: state.conversations.filter((c) => c.id !== conversationId),
        currentConversation: state.currentConversation?.id === conversationId 
          ? null 
          : state.currentConversation,
        currentMessages: state.currentConversation?.id === conversationId 
          ? [] 
          : state.currentMessages,
      })),
      
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'conversation-store',
    }
  )
);