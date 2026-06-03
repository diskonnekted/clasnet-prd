import { NextRequest, NextResponse } from 'next/server';
import { OrchestrateInputSchema } from '@/lib/schemas/orchestrate.schema';
import { OrchestrateService } from '@/lib/api-services/orchestrate-service';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const parsed = OrchestrateInputSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    
    const service = new OrchestrateService();
    const response = await service.orchestrate(parsed.data);
    
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Orchestrate API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    );
  }
}
