import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; section: string }> }
) {
  try {
    const { id, section } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Find PRD document for project
    const { data: prd, error: prdError } = await supabase
      .from('prd_documents')
      .select('id')
      .eq('project_id', id)
      .single();
    
    if (prdError || !prd) {
      return NextResponse.json({ error: 'PRD Document not found' }, { status: 404 });
    }
    
    const { data: sectionData, error } = await supabase
      .from('prd_sections')
      .select('*')
      .eq('prd_id', prd.id)
      .eq('section_number', section)
      .single();
    
    if (error || !sectionData) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 });
    }
    
    return NextResponse.json(sectionData);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; section: string }> }
) {
  try {
    const { id, section } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Find PRD document for project
    const { data: prd, error: prdError } = await supabase
      .from('prd_documents')
      .select('id')
      .eq('project_id', id)
      .single();
    
    if (prdError || !prd) {
      return NextResponse.json({ error: 'PRD Document not found' }, { status: 404 });
    }
    
    const body = await request.json();
    const { content_markdown, title, status } = body;
    
    const updateData: any = {};
    if (content_markdown !== undefined) updateData.content_markdown = content_markdown;
    if (title !== undefined) updateData.title = title;
    if (status !== undefined) updateData.status = status;
    updateData.last_edited_at = new Date().toISOString();
    
    // Upsert section in case it doesn't exist yet
    const { data: sectionData, error } = await supabase
      .from('prd_sections')
      .upsert({
        prd_id: prd.id,
        section_number: section,
        title: title || `Section ${section}`,
        ...updateData
      }, {
        onConflict: 'prd_id,section_number'
      })
      .select()
      .single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(sectionData);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
