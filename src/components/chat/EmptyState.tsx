'use client';

import { MessageCircle, Sparkles, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useConversationStore } from '@/lib/stores/conversation-store';
import { useSettingsStore } from '@/lib/stores/settings-store';
// import { useSession } from 'next-auth/react';

const EXAMPLE_PROMPTS = [
  "Explain quantum computing in simple terms",
  "Write a Python function to sort a list",
  "What are the latest trends in web development?",
  "Help me plan a weekend trip to Paris"
];

const FEATURES = [
  {
    icon: MessageCircle,
    title: "Natural Conversations",
    description: "Work with AI models using natural language"
  },
  {
    icon: Sparkles,
    title: "Multiple Models",
    description: "Switch between OpenAI, Anthropic, Google, and more"
  },
  {
    icon: Zap,
    title: "Real-time Streaming",
    description: "Get responses as they're generated"
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your conversations are encrypted and private"
  }
];

export function EmptyState() {
  const { createConversation } = useConversationStore();
  const { selectedProvider, defaultModel } = useSettingsStore();

  const handleExamplePrompt = (prompt: string) => {
    createConversation({
      userId: 'demo-user',
      title: prompt.slice(0, 50) + (prompt.length > 50 ? '...' : ''),
      modelProvider: selectedProvider,
      modelName: defaultModel,
    });
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white">
            <MessageCircle className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold">Welcome to ProxLLM</h1>
          <p className="text-lg text-muted-foreground">
            Your gateway to powerful language models. Start a new project to explore AI capabilities.
          </p>
        </div>

        {/* Example Prompts */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Try these examples
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
            {EXAMPLE_PROMPTS.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                className="p-4 h-auto text-left justify-start hover:bg-accent hover:text-accent-foreground w-full min-h-fit"
                onClick={() => handleExamplePrompt(prompt)}
              >
                <div className="flex items-start gap-3 w-full">
                  <MessageCircle className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
                  <span className="text-sm leading-relaxed break-words">{prompt}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {FEATURES.map((feature, index) => (
              <Card key={index} className="p-4 text-left h-full">
                <div className="flex items-start gap-3 w-full">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <feature.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <h3 className="font-medium text-sm break-words">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed break-words">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Current Model Info */}
        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Currently using{' '}
            <span className="font-medium text-foreground">
              {defaultModel}
            </span>{' '}
            from{' '}
            <span className="font-medium text-foreground capitalize">
              {selectedProvider}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}