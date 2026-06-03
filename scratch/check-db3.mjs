import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { data: prds } = await supabase
    .from('prd_documents')
    .select('id')
    .eq('project_id', '795aebcb-2fe5-49f1-b0e8-6beec6b4a4d0')
    .single();
    
  if (!prds) return console.log('PRD not found');
  
  const { data: sections } = await supabase
    .from('prd_sections')
    .select('*')
    .eq('prd_id', prds.id)
    .eq('section_number', '1')
    .single();
    
  if (sections) {
    console.log(sections.content_markdown);
  }
}

check();
