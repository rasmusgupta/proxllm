import { NextResponse } from 'next/server';
import { AVAILABLE_PROVIDERS } from '@/lib/llm-providers';

export async function GET() {
  try {
    return NextResponse.json({
      providers: AVAILABLE_PROVIDERS,
      models: AVAILABLE_PROVIDERS.flatMap(provider => 
        provider.models.map(model => ({
          id: model,
          name: model,
          provider: provider.id,
          providerName: provider.name,
        }))
      ),
    });
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}