import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Log API key status (masked for security)
const apiKey = process.env.OPENAI_API_KEY || '';
console.log(
  'OpenAI API Key status:',
  apiKey ? `Key present (${apiKey.slice(0, 4)}...)` : 'Missing'
);

// Initialize OpenAI client
let openai: OpenAI;
try {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} catch (error) {
  console.error('Failed to initialize OpenAI client:', error);
  // We'll handle this in the route handler
}

export async function GET(request: Request) {
  // Check if OpenAI client is properly initialized
  if (!openai) {
    console.error('OpenAI client not initialized');
    return NextResponse.json(
      { error: 'OpenAI API not configured correctly' },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const prompt = searchParams.get('prompt');

  if (!prompt) {
    return NextResponse.json(
      { error: 'Prompt parameter is required' },
      { status: 400 }
    );
  }

  try {
    console.log('Generating image with prompt:', prompt);

    // Generate image with DALL-E 3
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
      response_format: 'url',
    });
    if (!response.data) {
      throw new Error('No data in OpenAI response');
    }
    console.log('OpenAI response received');
    const imageUrl = response.data[0].url;
    if (!imageUrl) {
      throw new Error('No image URL in OpenAI response');
    }

    // For initial testing, just return the OpenAI image URL directly
    // This helps identify if the issue is with OpenAI
    return NextResponse.json({
      url: imageUrl,
      hash: 'direct-openai-url', // Placeholder
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in image generation:', errorMessage);
    return NextResponse.json(
      { error: `Failed to generate image: ${errorMessage}` },
      { status: 500 }
    );
  }
}
