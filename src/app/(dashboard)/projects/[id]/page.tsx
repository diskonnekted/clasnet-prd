import { ProjectEditorContainer } from '@/components/editor/project-editor-container';

export default async function ProjectEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <ProjectEditorContainer projectId={id} />
  );
}
