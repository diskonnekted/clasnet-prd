import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { data: messages } = await supabase
    .from('conversation_messages')
    .select('role, content, action_type, payload')
    .eq('role', 'assistant')
    .order('created_at', { ascending: false })
    .limit(1);
    
  console.log(JSON.stringify(messages, null, 2));
}

check();
