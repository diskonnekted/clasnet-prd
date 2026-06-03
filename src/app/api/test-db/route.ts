import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      return NextResponse.json({ success: false, context: 'auth', error: authError });
    }
    
    if (!user) {
      return NextResponse.json({ success: false, context: 'auth', error: 'No user found' });
    }

    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('owner_id', user.id)
      .is('deleted_at', null)
      .order('updated_at', { ascending: false });

    return NextResponse.json({
      success: true,
      projects,
      error,
      user: { id: user.id }
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, context: 'exception', message: e.message, stack: e.stack });
  }
}
