import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // First find the prd document for the project
    const { data: prd, error: prdError } = await supabase
      .from('prd_documents')
      .select('id')
      .eq('project_id', id)
      .single();
    
    if (prdError || !prd) {
      return NextResponse.json({ error: 'PRD Document not found' }, { status: 404 });
    }
    
    const { data: sections, error } = await supabase
      .from('prd_sections')
      .select('*')
      .eq('prd_id', prd.id)
      .order('section_number', { ascending: true });
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(sections);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
