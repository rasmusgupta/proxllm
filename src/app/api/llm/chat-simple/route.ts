import { NextRequest, NextResponse } from 'next/server';
import { createLLMProvider } from '@/lib/llm-providers';
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

    // Use environment variable API keys for demo
    let apiKey: string | undefined;
    
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
          { error: `Provider ${provider} not supported in demo mode` },
          { status: 400 }
        );
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: `No API key configured for ${provider}. Please set the environment variable.` },
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
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}