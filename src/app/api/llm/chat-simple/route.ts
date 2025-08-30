import { NextRequest, NextResponse } from 'next/server';
import { createLLMProvider } from '@/lib/llm-providers';
import { getDemoApiKey } from '@/lib/demo-storage';
import { decrypt } from '@/lib/crypto/encryption';
import type { ChatRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { messages, model, provider, temperature, maxTokens, stream } = body;

    if (!messages || !model || !provider) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Try to get API key from demo storage first, fallback to environment variables
    let apiKey: string | undefined;
    
    // First try to get from demo storage
    const demoKey = getDemoApiKey(provider);
    if (demoKey && demoKey.encryptedApiKey) {
      try {
        apiKey = decrypt(demoKey.encryptedApiKey);
      } catch (error) {
        console.error('Error decrypting API key:', error);
        // Continue to environment variable fallback
      }
    }
    
    // Fallback to environment variables if no demo key found
    if (!apiKey) {
      switch (provider) {
        case 'openai':
          apiKey = process.env.OPENAI_API_KEY;
          break;
        case 'anthropic':
          apiKey = process.env.ANTHROPIC_API_KEY;
          break;
        case 'google':
          apiKey = process.env.GOOGLE_API_KEY;
          break;
        default:
          return NextResponse.json(
            { error: `Provider ${provider} not supported` },
            { status: 400 }
          );
      }
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: `No API key configured for ${provider}. Please add one in Settings.` },
        { status: 400 }
      );
    }
    
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
    
    // Handle specific API key related errors
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      
      // Check for common API key errors
      if (errorMessage.includes('api key') || 
          errorMessage.includes('unauthorized') || 
          errorMessage.includes('invalid key') ||
          errorMessage.includes('authentication')) {
        return NextResponse.json(
          { error: `API key error: ${error.message}. Please check your API key in Settings.` },
          { status: 401 }
        );
      }
      
      // Check for rate limiting
      if (errorMessage.includes('rate limit') || errorMessage.includes('quota')) {
        return NextResponse.json(
          { error: `Rate limit exceeded: ${error.message}` },
          { status: 429 }
        );
      }
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}