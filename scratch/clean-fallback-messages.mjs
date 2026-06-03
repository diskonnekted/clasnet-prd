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
    .select('id, content')
    .in('content', [
      'Berikut adalah draf outline/tabel konten PRD yang saya rancang untuk Anda.',
      'Halo! Saya mendeteksi pesan tes Anda. Untuk melanjutkan proses penyusunan PRD \'Salma Bakery\', berikut adalah Bab 2: Overview yang telah saya siapkan berdasarkan konteks sebelumnya.',
      'Generasi bagian 2 selesai.'
    ]);
    
  if (messages) {
    for (const msg of messages) {
      console.log(`Deleting message: ${msg.content}`);
      await supabase.from('conversation_messages').delete().eq('id', msg.id);
    }
  }
}

clean();
