import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const ARWEAVE_URL = 'https://arweave.net';
// Using direct upload endpoint
const MINTBASE_ARWEAVE_URL = 'https://upload.mintbase.xyz/arweave';

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

    console.log('OpenAI response received');

    const imageUrl = response.data[0].url;
    if (!imageUrl) {
      throw new Error('No image URL in OpenAI response');
    }

    // For initial testing, just return the OpenAI image URL directly
    // This helps identify if the issue is with OpenAI or with Arweave
    return NextResponse.json({
      url: imageUrl,
      hash: 'direct-openai-url', // Placeholder
    });

    /* Commenting out Arweave upload for now to simplify debugging
    console.log('Fetching image from:', imageUrl);
    
    // Get the generated image from OpenAI URL
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }
    
    const imageBlob = await imageResponse.blob();
    
    console.log('Image fetched, uploading to Arweave');
    
    // Create FormData and append the image
    const formData = new FormData();
    formData.append('file', imageBlob, 'image.png');

    // Upload to Arweave
    console.log('Uploading to Arweave URL:', MINTBASE_ARWEAVE_URL);
    const arweaveResponse = await fetch(MINTBASE_ARWEAVE_URL, {
      method: 'POST',
      body: formData,
      headers: {
        'mb-api-key': 'omni-site',
      },
    });

    if (!arweaveResponse.ok) {
      const errorText = await arweaveResponse.text();
      console.error('Arweave upload error:', errorText);
      throw new Error(`Failed to upload to Arweave: ${errorText}`);
    }

    console.log('Image uploaded to Arweave');
    
    // Parse response
    const arweaveData = await arweaveResponse.json();
    console.log('Arweave response:', JSON.stringify(arweaveData));
    const arweaveHash = arweaveData.id;

    if (!arweaveData || typeof arweaveHash !== 'string') {
      console.error('Invalid Arweave response:', arweaveData);
      throw new Error('Invalid response from Arweave service');
    }

    const url = `${ARWEAVE_URL}/${arweaveHash}`;
    console.log('Image URL:', url);

    // Return the URL of the uploaded image
    return NextResponse.json({
      url,
      hash: arweaveHash,
    });
    */
  } catch (error: any) {
    console.error('Error in image generation:', error.message);
    if (error.response) {
      console.error('API response:', error.response.data);
    }
    return NextResponse.json(
      { error: `Failed to generate image: ${error.message}` },
      { status: 500 }
    );
  }
}
