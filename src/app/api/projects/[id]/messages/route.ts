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
    
    // Find project conversation
    let { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('id')
      .eq('project_id', id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
      
    if (convError) {
      return NextResponse.json({ error: convError.message }, { status: 500 });
    }
    
    // If conversation doesn't exist, create it
    if (!conversation) {
      const { data: newConv, error: createError } = await supabase
        .from('conversations')
        .insert({
          project_id: id,
          title: 'Asisten AI PRD',
          status: 'active'
        })
        .select('id')
        .single();
        
      if (createError) {
        console.error('[MESSAGES ROUTE] Create conversation error:', createError);
        return NextResponse.json({ error: createError.message }, { status: 500 });
      }
      conversation = newConv;
    }
    
    // Fetch all messages for the conversation
    const { data: messages, error } = await supabase
      .from('conversation_messages')
      .select('*')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: true });
      
    if (error) {
      console.error('[MESSAGES ROUTE] Fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(messages || []);
  } catch (err: any) {
    console.error('[MESSAGES ROUTE] Catch error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
