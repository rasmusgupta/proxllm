import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/database/prisma';
import { encrypt } from '@/lib/crypto/encryption';
import { createLLMProvider } from '@/lib/llm-providers';
import type { LLMProvider } from '@/types';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiKeys = await prisma.apiKey.findMany({
      where: {
        userId: session.user.id,
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
    const session = await auth();
    
    if (!session?.user?.id) {
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
      
      // Simple test request to validate the key
      await llmProvider.chat({
        messages: [{ role: 'user', content: 'Hi' }],
        model: llmProvider.getAvailableModels()[0],
        provider,
        maxTokens: 10,
      });
      
      isValid = true;
    } catch (error) {
      console.log('API key validation failed:', error);
      isValid = false;
    }

    // Encrypt the API key
    const encryptedKey = encrypt(apiKey);

    // Check if a key with the same name already exists
    const existingKey = await prisma.apiKey.findFirst({
      where: {
        userId: session.user.id,
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
          userId: session.user.id,
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