import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const CreateProjectSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  domain: z.enum([
    'mobile_app', 'web_saas', 'ai_ml_product', 'iot_device',
    'internal_tool', 'marketplace', 'fintech', 'healthcare', 'other'
  ]),
  has_ai_features: z.boolean().default(false),
});

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('owner_id', user.id)
      .is('deleted_at', null)
      .order('updated_at', { ascending: false });
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const parsed = CreateProjectSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    
    // Create project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        owner_id: user.id,
        name: parsed.data.name,
        description: parsed.data.description,
        domain: parsed.data.domain,
        has_ai_features: parsed.data.has_ai_features,
      })
      .select()
      .single();
    
    if (projectError) {
      return NextResponse.json({ error: projectError.message }, { status: 500 });
    }
    
    // Create empty PRD document
    const { error: prdError } = await supabase
      .from('prd_documents')
      .insert({
        project_id: project.id,
        title: parsed.data.name,
        outline: [],
      });
    
    if (prdError) {
      return NextResponse.json({ error: prdError.message }, { status: 500 });
    }
    
    return NextResponse.json(project, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
