import { createOpenAI } from '@ai-sdk/openai';
import { generateText, streamText } from 'ai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

async function test() {
  console.log('Testing generateText...');
  try {
    const result1 = await generateText({
      model: openai('qwen-max'),
      prompt: 'Hello, say hi!',
    });
    console.log('generateText result:', result1.text);
  } catch (e) {
    console.error('generateText error:', e.message);
  }

  console.log('Testing streamText...');
  try {
    const result2 = await streamText({
      model: openai('qwen-max'),
      prompt: 'Say hi again!',
    });
    
    let full = '';
    for await (const chunk of result2.textStream) {
      full += chunk;
    }
    console.log('streamText result:', full);
  } catch (e) {
    console.error('streamText error:', e.message);
  }
}

test();
