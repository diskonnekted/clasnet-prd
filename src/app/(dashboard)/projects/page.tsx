import { createClient } from '@/lib/supabase/server';
import { ProjectsDashboard } from '@/components/projects-dashboard';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch real projects owned by the user
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .eq('owner_id', user.id)
    .is('deleted_at', null)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Failed to load projects:', JSON.stringify(error, null, 2), error);
  }

  return (
    <ProjectsDashboard initialProjects={projects || []} />
  );
}
