import KanbanBoard from '@/components/KanbanBoard';

/**
 * Projects page metadata
 */
export const metadata = {
  title: 'Projects - Second Brain',
  description: 'Manage your projects with Kanban boards',
};

/**
 * Projects Page Component
 * 
 * Displays the Kanban board project manager for tracking projects and tasks.
 * Features drag-and-drop task management, priorities, tags, and due dates.
 * 
 * @page
 * @route /projects
 * @example
 * // Access at: http://localhost:3000/projects
 */
export default function ProjectsPage() {
  return (
    <div className="h-[calc(100vh-3.5rem)]">
      <KanbanBoard />
    </div>
  );
}
