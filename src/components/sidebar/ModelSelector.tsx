'use client';

import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useSettingsStore } from '@/lib/stores/settings-store';
import { PROVIDERS, checkProviderAvailability } from '@/lib/provider-utils';

interface ModelSelectorProps {
  isCollapsed?: boolean;
}

export function ModelSelector({ isCollapsed = false }: ModelSelectorProps) {
  const { selectedProvider, defaultModel, setSelectedProvider, setDefaultModel } = useSettingsStore();
  const [isOpen, setIsOpen] = useState(false);
  const [providerAvailability, setProviderAvailability] = useState<Record<string, boolean>>({});

  const currentProvider = PROVIDERS.find(p => p.id === selectedProvider);
  const currentModel = currentProvider?.models.find(m => m.id === defaultModel);

  useEffect(() => {
    checkProviderAvailability().then(setProviderAvailability);
  }, []);

  const handleProviderChange = (providerId: string) => {
    const provider = PROVIDERS.find(p => p.id === providerId);
    if (provider) {
      setSelectedProvider(providerId as any);
      // Set first model as default when switching providers
      if (provider.models.length > 0) {
        setDefaultModel(provider.models[0].id);
      }
    }
  };

  if (isCollapsed) {
    return (
      <div className="p-2">
        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
          <span className="text-xs font-mono text-primary">
            {currentProvider?.name.charAt(0) || 'A'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 border-b space-y-2">
      <div className="text-xs font-medium text-muted-foreground">Model Settings</div>
      
      <Select value={selectedProvider} onValueChange={handleProviderChange}>
        <SelectTrigger className="w-full h-8">
          <SelectValue placeholder="Select provider" />
        </SelectTrigger>
        <SelectContent>
          {PROVIDERS.map((provider) => (
            <SelectItem 
              key={provider.id} 
              value={provider.id}
              disabled={providerAvailability[provider.id] === false}
            >
              <div className="flex items-center justify-between w-full">
                <span>{provider.name}</span>
                {providerAvailability[provider.id] === false && (
                  <div className="flex items-center gap-1 text-orange-500">
                    <AlertCircle className="w-3 h-3" />
                    <span className="text-xs">No API Key</span>
                  </div>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {currentProvider && (
        <Select value={defaultModel} onValueChange={setDefaultModel}>
          <SelectTrigger className="w-full h-8">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            {currentProvider.models.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Warning for currently selected provider without API key */}
      {providerAvailability[selectedProvider] === false && (
        <div className="mt-2 p-2 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-md">
          <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
            <AlertCircle className="w-4 h-4" />
            <span className="text-xs">
              No API key configured for {currentProvider?.name}. Add one in Settings to use this provider.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}