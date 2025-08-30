import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/database/prisma';
import { createLLMProvider } from '@/lib/llm-providers';
import { decrypt } from '@/lib/crypto/encryption';
import type { ChatRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: ChatRequest = await request.json();
    const { messages, model, provider, stream } = body;

    if (!messages || !model || !provider) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user's API key for the provider
    const apiKeyRecord = await prisma.apiKey.findFirst({
      where: {
        userId: session.user.id,
        provider: provider,
        isValid: true,
      },
    });

    if (!apiKeyRecord) {
      return NextResponse.json(
        { error: `No valid API key found for ${provider}` },
        { status: 400 }
      );
    }

    // Decrypt the API key
    const apiKey = decrypt(apiKeyRecord.encryptedKey);
    
    // Create provider instance
    const llmProvider = createLLMProvider(provider, apiKey);

    // Handle streaming response
    if (stream) {
      const encoder = new TextEncoder();
      
      const readableStream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of llmProvider.chatStream(body)) {
              const data = `data: ${JSON.stringify({ content: chunk })}\n\n`;
              controller.enqueue(encoder.encode(data));
            }
            
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
          } catch (error) {
            const errorData = `data: ${JSON.stringify({ error: error instanceof Error ? error.message : 'Stream error' })}\n\n`;
            controller.enqueue(encoder.encode(errorData));
            controller.close();
          }
        },
      });

      return new Response(readableStream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // Handle regular response
    const response = await llmProvider.chat(body);
    return NextResponse.json(response);

  } catch (error) {
    console.error('Error in LLM chat:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}