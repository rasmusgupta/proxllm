import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/clerk';
import { prisma } from '@/lib/database/prisma';
import { encrypt } from '@/lib/crypto/encryption';
import { createLLMProvider } from '@/lib/llm-providers';
import type { LLMProvider } from '@/types';

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiKeys = await prisma.apiKey.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        provider: true,
        keyName: true,
        isValid: true,
        createdAt: true,
        // Don't return the encrypted key for security
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(apiKeys);
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { provider, keyName, apiKey } = body;

    if (!provider || !keyName || !apiKey) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate that the provider is supported
    const validProviders: LLMProvider[] = ['openai', 'anthropic', 'google', 'cohere', 'huggingface'];
    if (!validProviders.includes(provider)) {
      return NextResponse.json(
        { error: 'Invalid provider' },
        { status: 400 }
      );
    }

    // Test the API key by making a simple request
    let isValid = false;
    try {
      const llmProvider = createLLMProvider(provider, apiKey);
      
      // Use a reliable model for testing based on provider
      let testModel = llmProvider.getAvailableModels()[0];
      if (provider === 'anthropic') {
        testModel = 'claude-3-5-haiku-20241022'; // Use Haiku for faster/cheaper testing
      } else if (provider === 'openai') {
        testModel = 'gpt-3.5-turbo'; // Use cheaper model for testing
      }
      
      // Simple test request to validate the key
      await llmProvider.chat({
        messages: [{ role: 'user', content: 'Test' }],
        model: testModel,
        provider,
        maxTokens: 5,
        temperature: 0,
      });
      
      isValid = true;
    } catch (error) {
      console.error('API key validation failed:', error);
      isValid = false;
    }

    // Encrypt the API key
    const encryptedKey = encrypt(apiKey);

    // Check if a key with the same name already exists
    const existingKey = await prisma.apiKey.findFirst({
      where: {
        userId: user.id,
        provider,
        keyName,
      },
    });

    if (existingKey) {
      // Update existing key
      const updatedKey = await prisma.apiKey.update({
        where: { id: existingKey.id },
        data: {
          encryptedKey,
          isValid,
        },
        select: {
          id: true,
          provider: true,
          keyName: true,
          isValid: true,
          createdAt: true,
        },
      });

      return NextResponse.json(updatedKey);
    } else {
      // Create new key
      const newKey = await prisma.apiKey.create({
        data: {
          userId: user.id,
          provider,
          keyName,
          encryptedKey,
          isValid,
        },
        select: {
          id: true,
          provider: true,
          keyName: true,
          isValid: true,
          createdAt: true,
        },
      });

      return NextResponse.json(newKey, { status: 201 });
    }
  } catch (error) {
    console.error('Error managing API key:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}