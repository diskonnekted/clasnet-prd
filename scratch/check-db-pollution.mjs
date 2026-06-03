import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { data, error } = await supabase
    .from('prd_sections')
    .select('*')
    .eq('project_id', '795aebcb-2fe5-49f1-b0e8-6beec6b4a4d0');
    
  if (error) console.error(error);
  else {
    data.forEach(d => {
      console.log(`Section ${d.section_number}:`);
      console.log(d.content_markdown);
      console.log('---');
    });
  }
}

check();
