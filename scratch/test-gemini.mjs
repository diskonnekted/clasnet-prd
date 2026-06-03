import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText, streamText } from 'ai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

async function test() {
  console.log('Testing Gemini API with Vercel AI SDK...');
  try {
    const result = await generateText({
      model: google('gemini-flash-latest'),
      prompt: 'Explain how AI works in 5 words',
    });
    console.log('Result:', result.text);
  } catch (e) {
    console.error('Error:', e.message);
  }
}

test();
