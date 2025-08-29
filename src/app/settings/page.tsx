'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ApiKeyManager } from '@/components/settings/ApiKeyManager';
import { ModelSelector } from '@/components/sidebar/ModelSelector';

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your ProxLLM preferences and API keys
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">LLM Settings</h2>
            <p className="text-muted-foreground mb-4">
              Select your preferred language model provider and model
            </p>
            <ModelSelector isCollapsed={false} />
          </div>
          
          <ApiKeyManager />
        </div>
      </div>
    </div>
  );
}