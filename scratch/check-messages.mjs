import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkMessages() {
  const { data: messages } = await supabase
    .from('conversation_messages')
    .select('*')
    .eq('project_id', '795aebcb-2fe5-49f1-b0e8-6beec6b4a4d0')
    .order('created_at', { ascending: false })
    .limit(5);
    
  if (messages) {
    for (const msg of messages) {
      console.log(`--- Message ${msg.id} | Role: ${msg.role} | Action: ${msg.action_type} ---`);
      if (msg.payload) console.log(msg.payload);
    }
  }
}

checkMessages();
