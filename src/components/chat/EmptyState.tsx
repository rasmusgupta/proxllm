'use client';

import { Cpu, Sparkles, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useConversationStore } from '@/lib/stores/conversation-store';
import { useSettingsStore } from '@/lib/stores/settings-store';
// import { useSession } from 'next-auth/react';

const EXAMPLE_PROMPTS = [
  "I want to measure temperature",
  "I want to measure position",
  "I want to measure humidity",
  "I want to measure acceleration"
];

const FEATURES = [
  {
    icon: Cpu,
    title: "PCB Design Assistance",
    description: "Get expert help with circuit design and layout"
  },
  {
    icon: Sparkles,
    title: "File Generation",
    description: "Generate PCB files, schematics, and components"
  },
  {
    icon: Zap,
    title: "Design Review",
    description: "AI-powered analysis of your PCB layouts"
  },
  {
    icon: Shield,
    title: "Component Selection",
    description: "Smart recommendations for parts and footprints"
  }
];

interface EmptyStateProps {
  onSendMessage: (message: string) => void;
}

export function EmptyState({ onSendMessage }: EmptyStateProps) {
  const { createConversation } = useConversationStore();
  const { selectedProvider, defaultModel } = useSettingsStore();

  const handleExamplePrompt = async (prompt: string) => {
    // Send the message directly - ChatArea will create conversation if none exists
    onSendMessage(prompt);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white">
            <Cpu className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold">Welcome to PCB Design Assistant</h1>
          <p className="text-lg text-muted-foreground">
            Your AI-powered companion for IoT PCB design. Start a new project to begin designing.
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
                className="p-4 h-auto text-left justify-start hover:bg-accent hover:text-accent-foreground w-full min-h-[60px]"
                onClick={() => handleExamplePrompt(prompt)}
              >
                <div className="flex items-start gap-3 w-full overflow-hidden">
                  <Cpu className="w-4 h-4 mt-1 shrink-0 text-muted-foreground" />
                  <span className="text-sm leading-5 break-words whitespace-normal text-wrap overflow-hidden">{prompt}</span>
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