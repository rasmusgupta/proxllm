import { NextRequest, NextResponse } from 'next/server';
import { demoApiKeys } from '@/lib/demo-storage';
import type { DemoApiKey } from '@/lib/demo-storage';

export async function GET() {
  try {
    return NextResponse.json(demoApiKeys);
  } catch (error) {
    console.error('Error fetching demo API keys:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider, keyName, apiKey } = body;

    if (!provider || !keyName || !apiKey) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Simple validation - just check if key looks reasonable
    let isValid = false;
    try {
      isValid = apiKey.length > 10 && (
        (provider === 'openai' && apiKey.startsWith('sk-')) ||
        (provider === 'anthropic' && apiKey.startsWith('sk-ant-')) ||
        (provider === 'google' && apiKey.length > 20) ||
        (provider === 'cohere' && apiKey.length > 20) ||
        (provider === 'huggingface' && apiKey.startsWith('hf_'))
      );
    } catch (error) {
      console.log('API key validation failed:', error);
      isValid = false;
    }

    // Check if a key with the same name already exists
    const existingIndex = demoApiKeys.findIndex(
      key => key.provider === provider && key.keyName === keyName
    );

    const newKey: DemoApiKey = {
      id: existingIndex >= 0 ? demoApiKeys[existingIndex].id : `demo-${Date.now()}`,
      provider,
      keyName,
      isValid,
      createdAt: existingIndex >= 0 ? demoApiKeys[existingIndex].createdAt : new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      // Update existing key
      demoApiKeys[existingIndex] = newKey;
    } else {
      // Add new key
      demoApiKeys.push(newKey);
    }

    return NextResponse.json(newKey, { status: existingIndex >= 0 ? 200 : 201 });
  } catch (error) {
    console.error('Error managing demo API key:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}