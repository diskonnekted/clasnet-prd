import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function clean() {
  const { data: messages } = await supabase
    .from('conversation_messages')
    .select('id, payload')
    .eq('role', 'assistant')
    .order('created_at', { ascending: false })
    .limit(10);
    
  if (messages) {
    for (const msg of messages) {
      if (
        msg.payload && 
        (
          (msg.payload.outline && msg.payload.outline.length === 0) || 
          (msg.payload.content_markdown === "")
        )
      ) {
        console.log(`Deleting empty message: ${msg.id}`);
        await supabase.from('conversation_messages').delete().eq('id', msg.id);
      }
    }
  }
}

clean();
