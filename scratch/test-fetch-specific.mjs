import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkMessages() {
  const { data: convs } = await supabase
    .from('conversations')
    .select('*')
    .eq('project_id', '22ef7dd5-4431-44d9-ad7f-46b9c2bd8ece')
    .order('created_at', { ascending: false })
    .limit(1);
    
  if (convs && convs.length > 0) {
    const { data: msgs, error } = await supabase
      .from('conversation_messages')
      .select('*')
      .eq('conversation_id', convs[0].id)
      .order('created_at', { ascending: false })
      .limit(5);
      
    if (error) console.error('Error fetching messages:', error);
    else {
      console.log(`Messages for conv ${convs[0].id}:`);
      msgs.forEach(msg => {
        console.log(`Role: ${msg.role}`);
        console.log(`Content: ${msg.content}`);
        console.log(`Payload: ${JSON.stringify(msg.payload, null, 2)}`);
        console.log('---');
      });
    }
  }
}

checkMessages();
