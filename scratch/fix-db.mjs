import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { marked } from 'marked';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fix() {
  const { data: prds } = await supabase
    .from('prd_documents')
    .select('id')
    .eq('project_id', '795aebcb-2fe5-49f1-b0e8-6beec6b4a4d0')
    .single();
    
  if (!prds) return console.log('PRD not found');
  
  const { data: sections } = await supabase
    .from('prd_sections')
    .select('*')
    .eq('prd_id', prds.id);
    
  if (sections) {
    for (const sec of sections) {
      let content = sec.content_markdown;
      if (content && content.includes('## ') && content.startsWith('<')) {
        console.log(`Fixing section ${sec.section_number}...`);
        
        // Strip HTML tags naively to recover the raw text
        let rawMarkdown = content.replace(/<[^>]*>?/gm, '');
        
        // Parse back to correct HTML
        let fixedHTML = marked.parse(rawMarkdown, { async: false });
        
        await supabase
          .from('prd_sections')
          .update({ content_markdown: fixedHTML })
          .eq('id', sec.id);
          
        console.log(`Section ${sec.section_number} fixed!`);
      }
    }
  }
}

fix();
