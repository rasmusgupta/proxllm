'use client';

import { useState, useEffect } from 'react';
import { Plus, Key, Trash2, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AVAILABLE_PROVIDERS } from '@/lib/llm-providers';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface ApiKeyData {
  id: string;
  provider: string;
  keyName: string;
  isValid: boolean;
  createdAt: string;
}

export function ApiKeyManager() {
  const [apiKeys, setApiKeys] = useState<ApiKeyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newKey, setNewKey] = useState({
    provider: '',
    keyName: '',
    apiKey: '',
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const fetchApiKeys = async () => {
    try {
      const response = await fetch('/api/settings/api-keys/demo');
      if (response.ok) {
        const data = await response.json();
        setApiKeys(data);
      }
    } catch (error) {
      console.error('Error fetching API keys:', error);
      toast.error('Failed to load API keys');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const handleAddKey = async () => {
    if (!newKey.provider || !newKey.keyName || !newKey.apiKey) {
      toast.error('All fields are required');
      return;
    }

    setIsAdding(true);
    try {
      const response = await fetch('/api/settings/api-keys/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newKey),
      });

      if (response.ok) {
        const data = await response.json();
        setApiKeys(prev => [data, ...prev.filter(k => !(k.provider === data.provider && k.keyName === data.keyName))]);
        setShowAddDialog(false);
        setNewKey({ provider: '', keyName: '', apiKey: '' });
        toast.success('API key added successfully');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to add API key');
      }
    } catch (error) {
      console.error('Error adding API key:', error);
      toast.error('Failed to add API key');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteKey = async (id: string) => {
    try {
      const response = await fetch(`/api/settings/api-keys/demo/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setApiKeys(prev => prev.filter(k => k.id !== id));
        toast.success('API key deleted successfully');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete API key');
      }
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast.error('Failed to delete API key');
    }
  };

  const getProviderInfo = (providerId: string) => {
    return AVAILABLE_PROVIDERS.find(p => p.id === providerId);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="h-20" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">API Keys</h2>
          <p className="text-muted-foreground">
            Manage your API keys for different LLM providers
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add API Key
        </Button>
      </div>

      {apiKeys.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Key className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No API Keys</h3>
            <p className="text-muted-foreground text-center mb-4">
              Add your first API key to start chatting with AI models
            </p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add API Key
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {apiKeys.map((key) => {
            const providerInfo = getProviderInfo(key.provider);
            return (
              <Card key={key.id}>
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Key className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{key.keyName}</h3>
                        {key.isValid ? (
                          <Badge variant="secondary" className="text-green-600 bg-green-50">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Valid
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Invalid
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{providerInfo?.name || key.provider}</span>
                        <span>•</span>
                        <span>
                          Added {formatDistanceToNow(new Date(key.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteKey(key.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add API Key Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add API Key</DialogTitle>
            <DialogDescription>
              Add a new API key for an LLM provider. Your key will be encrypted and stored securely.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="provider">Provider</Label>
              <Select value={newKey.provider} onValueChange={(value) => setNewKey(prev => ({ ...prev, provider: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a provider" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_PROVIDERS.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      <div>
                        <div className="font-medium">{provider.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {provider.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="keyName">Key Name</Label>
              <Input
                id="keyName"
                placeholder="e.g., Main Key, Development, etc."
                value={newKey.keyName}
                onChange={(e) => setNewKey(prev => ({ ...prev, keyName: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="apiKey">API Key</Label>
              <div className="relative">
                <Input
                  id="apiKey"
                  type={showApiKey ? "text" : "password"}
                  placeholder="Enter your API key"
                  value={newKey.apiKey}
                  onChange={(e) => setNewKey(prev => ({ ...prev, apiKey: e.target.value }))}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddDialog(false)}
              disabled={isAdding}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddKey}
              disabled={isAdding || !newKey.provider || !newKey.keyName || !newKey.apiKey}
            >
              {isAdding ? 'Adding...' : 'Add Key'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}