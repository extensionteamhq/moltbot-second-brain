'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Priority levels for tasks
 * @typedef {'low' | 'medium' | 'high'} Priority
 */
type Priority = 'low' | 'medium' | 'high';

/**
 * Task item in the Kanban board
 * @typedef {Object} Task
 * @property {string} id - Unique identifier for the task
 * @property {string} title - Task title
 * @property {string} description - Task description
 * @property {Priority} priority - Task priority level
 * @property {string[]} tags - Tags associated with the task
 * @property {string} createdAt - ISO date string when task was created
 * @property {string | undefined} dueDate - Optional due date
 */
interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  tags: string[];
  createdAt: string;
  dueDate?: string;
}

/**
 * Column in the Kanban board
 * @typedef {Object} Column
 * @property {string} id - Unique identifier for the column
 * @property {string} title - Column title
 * @property {string} color - Accent color for the column
 * @property {Task[]} tasks - Tasks in this column
 */
interface Column {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
}

/**
 * Project containing multiple Kanban columns
 * @typedef {Object} Project
 * @property {string} id - Unique identifier for the project
 * @property {string} name - Project name
 * @property {string} description - Project description
 * @property {Column[]} columns - Columns in this project
 * @property {string} createdAt - ISO date string when project was created
 */
interface Project {
  id: string;
  name: string;
  description: string;
  columns: Column[];
  createdAt: string;
}

/**
 * LocalStorage key for persisting Kanban data
 * @constant {string}
 */
const STORAGE_KEY = 'second-brain-kanban';

/**
 * Default columns for a new project
 * @constant {Omit<Column, 'tasks'>[]}
 */
const DEFAULT_COLUMNS: Omit<Column, 'tasks'>[] = [
  { id: 'backlog', title: '📋 Backlog', color: '#6b7280' },
  { id: 'todo', title: '📝 To Do', color: '#3b82f6' },
  { id: 'in-progress', title: '🔄 In Progress', color: '#f59e0b' },
  { id: 'review', title: '👀 Review', color: '#8b5cf6' },
  { id: 'done', title: '✅ Done', color: '#22c55e' },
];

/**
 * Generates a unique ID
 * @returns {string} Unique identifier
 */
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Priority configuration with colors and labels
 * @constant {Record<Priority, { label: string; color: string; bg: string }>}
 */
const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bg: string }> = {
  low: { label: 'Low', color: '#22c55e', bg: 'bg-green-500/20' },
  medium: { label: 'Medium', color: '#f59e0b', bg: 'bg-amber-500/20' },
  high: { label: 'High', color: '#ef4444', bg: 'bg-red-500/20' },
};

/**
 * KanbanBoard Component
 * 
 * A full-featured Kanban board for project and task management.
 * Features drag-and-drop, priority levels, tags, and localStorage persistence.
 * 
 * @component
 * @example
 * return (
 *   <KanbanBoard />
 * )
 */
export default function KanbanBoard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [draggedTask, setDraggedTask] = useState<{ task: Task; columnId: string } | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<{ task: Task; columnId: string } | null>(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('medium');
  const [newTaskTags, setNewTaskTags] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  /**
   * Load projects from localStorage on mount
   */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setProjects(data.projects || []);
        if (data.activeProjectId) {
          const active = data.projects?.find((p: Project) => p.id === data.activeProjectId);
          if (active) setActiveProject(active);
        }
      } catch (e) {
        console.error('Failed to load Kanban data:', e);
      }
    }
  }, []);

  /**
   * Save projects to localStorage whenever they change
   */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      projects,
      activeProjectId: activeProject?.id,
    }));
  }, [projects, activeProject]);

  /**
   * Creates a new project with default columns
   * @param {string} name - Project name
   * @param {string} description - Project description
   */
  const createProject = useCallback((name: string, description: string) => {
    const newProject: Project = {
      id: generateId(),
      name,
      description,
      columns: DEFAULT_COLUMNS.map(col => ({ ...col, tasks: [] })),
      createdAt: new Date().toISOString(),
    };
    setProjects(prev => [...prev, newProject]);
    setActiveProject(newProject);
    setIsAddingProject(false);
    setNewProjectName('');
    setNewProjectDesc('');
  }, []);

  /**
   * Deletes a project
   * @param {string} projectId - ID of project to delete
   */
  const deleteProject = useCallback((projectId: string) => {
    if (!confirm('Are you sure you want to delete this project? All tasks will be lost.')) return;
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (activeProject?.id === projectId) {
      setActiveProject(null);
    }
  }, [activeProject]);

  /**
   * Adds a new task to a column
   * @param {string} columnId - ID of the column to add task to
   */
  const addTask = useCallback((columnId: string) => {
    if (!activeProject || !newTaskTitle.trim()) return;

    const newTask: Task = {
      id: generateId(),
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim(),
      priority: newTaskPriority,
      tags: newTaskTags.split(',').map(t => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
      dueDate: newTaskDueDate || undefined,
    };

    const updatedProject = {
      ...activeProject,
      columns: activeProject.columns.map(col =>
        col.id === columnId
          ? { ...col, tasks: [...col.tasks, newTask] }
          : col
      ),
    };

    setProjects(prev => prev.map(p => p.id === activeProject.id ? updatedProject : p));
    setActiveProject(updatedProject);
    setIsAddingTask(null);
    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskPriority('medium');
    setNewTaskTags('');
    setNewTaskDueDate('');
  }, [activeProject, newTaskTitle, newTaskDesc, newTaskPriority, newTaskTags, newTaskDueDate]);

  /**
   * Updates an existing task
   */
  const updateTask = useCallback(() => {
    if (!activeProject || !editingTask || !newTaskTitle.trim()) return;

    const updatedTask: Task = {
      ...editingTask.task,
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim(),
      priority: newTaskPriority,
      tags: newTaskTags.split(',').map(t => t.trim()).filter(Boolean),
      dueDate: newTaskDueDate || undefined,
    };

    const updatedProject = {
      ...activeProject,
      columns: activeProject.columns.map(col =>
        col.id === editingTask.columnId
          ? { ...col, tasks: col.tasks.map(t => t.id === updatedTask.id ? updatedTask : t) }
          : col
      ),
    };

    setProjects(prev => prev.map(p => p.id === activeProject.id ? updatedProject : p));
    setActiveProject(updatedProject);
    setEditingTask(null);
    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskPriority('medium');
    setNewTaskTags('');
    setNewTaskDueDate('');
  }, [activeProject, editingTask, newTaskTitle, newTaskDesc, newTaskPriority, newTaskTags, newTaskDueDate]);

  /**
   * Deletes a task from a column
   * @param {string} columnId - ID of the column containing the task
   * @param {string} taskId - ID of the task to delete
   */
  const deleteTask = useCallback((columnId: string, taskId: string) => {
    if (!activeProject) return;

    const updatedProject = {
      ...activeProject,
      columns: activeProject.columns.map(col =>
        col.id === columnId
          ? { ...col, tasks: col.tasks.filter(t => t.id !== taskId) }
          : col
      ),
    };

    setProjects(prev => prev.map(p => p.id === activeProject.id ? updatedProject : p));
    setActiveProject(updatedProject);
  }, [activeProject]);

  /**
   * Handles drag start event for a task
   * @param {Task} task - The task being dragged
   * @param {string} columnId - The source column ID
   */
  const handleDragStart = (task: Task, columnId: string) => {
    setDraggedTask({ task, columnId });
  };

  /**
   * Handles drop event on a column
   * @param {string} targetColumnId - The column where the task is dropped
   */
  const handleDrop = (targetColumnId: string) => {
    if (!draggedTask || !activeProject) return;
    if (draggedTask.columnId === targetColumnId) {
      setDraggedTask(null);
      return;
    }

    const updatedProject = {
      ...activeProject,
      columns: activeProject.columns.map(col => {
        if (col.id === draggedTask.columnId) {
          return { ...col, tasks: col.tasks.filter(t => t.id !== draggedTask.task.id) };
        }
        if (col.id === targetColumnId) {
          return { ...col, tasks: [...col.tasks, draggedTask.task] };
        }
        return col;
      }),
    };

    setProjects(prev => prev.map(p => p.id === activeProject.id ? updatedProject : p));
    setActiveProject(updatedProject);
    setDraggedTask(null);
  };

  /**
   * Opens edit modal for a task
   */
  const openEditTask = (task: Task, columnId: string) => {
    setEditingTask({ task, columnId });
    setNewTaskTitle(task.title);
    setNewTaskDesc(task.description);
    setNewTaskPriority(task.priority);
    setNewTaskTags(task.tags.join(', '));
    setNewTaskDueDate(task.dueDate || '');
  };

  // Render project list if no active project
  if (!activeProject) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">📋 Projects</h2>
          <button
            onClick={() => setIsAddingProject(true)}
            className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] transition"
          >
            + New Project
          </button>
        </div>

        {/* New Project Form */}
        {isAddingProject && (
          <div className="mb-6 p-4 bg-[var(--card)] border border-[var(--border)] rounded-lg">
            <h3 className="font-semibold mb-3">Create New Project</h3>
            <input
              type="text"
              placeholder="Project Name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="w-full px-3 py-2 mb-3 bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
              autoFocus
            />
            <textarea
              placeholder="Description (optional)"
              value={newProjectDesc}
              onChange={(e) => setNewProjectDesc(e.target.value)}
              className="w-full px-3 py-2 mb-3 bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] resize-none"
              rows={2}
            />
            <div className="flex gap-2">
              <button
                onClick={() => createProject(newProjectName, newProjectDesc)}
                disabled={!newProjectName.trim()}
                className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] transition disabled:opacity-50"
              >
                Create
              </button>
              <button
                onClick={() => { setIsAddingProject(false); setNewProjectName(''); setNewProjectDesc(''); }}
                className="px-4 py-2 bg-[var(--card)] border border-[var(--border)] rounded-lg hover:bg-[var(--border)] transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Project Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-12 text-[var(--muted)]">
            <div className="text-6xl mb-4">📋</div>
            <p>No projects yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(project => {
              const totalTasks = project.columns.reduce((sum, col) => sum + col.tasks.length, 0);
              const doneTasks = project.columns.find(c => c.id === 'done')?.tasks.length || 0;
              return (
                <div
                  key={project.id}
                  className="p-4 bg-[var(--card)] border border-[var(--border)] rounded-lg hover:border-[var(--accent)] transition cursor-pointer"
                  onClick={() => setActiveProject(project)}
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-lg">{project.name}</h3>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteProject(project.id); }}
                      className="p-1 text-[var(--muted)] hover:text-red-500 transition"
                      title="Delete Project"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  {project.description && (
                    <p className="text-sm text-[var(--muted)] mt-1 line-clamp-2">{project.description}</p>
                  )}
                  <div className="mt-3 flex items-center gap-3 text-sm text-[var(--muted)]">
                    <span>{totalTasks} tasks</span>
                    {totalTasks > 0 && (
                      <span className="text-green-500">{Math.round((doneTasks / totalTasks) * 100)}% complete</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Render Kanban board for active project
  return (
    <div className="h-full flex flex-col">
      {/* Project Header */}
      <div className="p-4 border-b border-[var(--border)] flex items-center gap-4">
        <button
          onClick={() => setActiveProject(null)}
          className="p-2 hover:bg-[var(--card)] rounded-lg transition"
          title="Back to Projects"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h2 className="text-xl font-bold">{activeProject.name}</h2>
          {activeProject.description && (
            <p className="text-sm text-[var(--muted)]">{activeProject.description}</p>
          )}
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="flex-1 overflow-x-auto p-4">
        <div className="flex gap-4 h-full min-w-max">
          {activeProject.columns.map(column => (
            <div
              key={column.id}
              className="w-72 flex flex-col bg-[var(--sidebar)] rounded-lg border border-[var(--border)]"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(column.id)}
            >
              {/* Column Header */}
              <div
                className="p-3 border-b border-[var(--border)] flex items-center justify-between"
                style={{ borderTopColor: column.color, borderTopWidth: '3px' }}
              >
                <h3 className="font-semibold flex items-center gap-2">
                  {column.title}
                  <span className="text-xs bg-[var(--card)] px-2 py-0.5 rounded-full text-[var(--muted)]">
                    {column.tasks.length}
                  </span>
                </h3>
                <button
                  onClick={() => setIsAddingTask(column.id)}
                  className="p-1 hover:bg-[var(--card)] rounded transition text-[var(--muted)] hover:text-[var(--foreground)]"
                  title="Add Task"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>

              {/* Tasks */}
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {/* Add Task Form */}
                {isAddingTask === column.id && (
                  <div className="p-3 bg-[var(--card)] rounded-lg border border-[var(--accent)]">
                    <input
                      type="text"
                      placeholder="Task title"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      className="w-full px-2 py-1 mb-2 bg-[var(--background)] border border-[var(--border)] rounded text-sm focus:outline-none focus:border-[var(--accent)]"
                      autoFocus
                    />
                    <textarea
                      placeholder="Description (optional)"
                      value={newTaskDesc}
                      onChange={(e) => setNewTaskDesc(e.target.value)}
                      className="w-full px-2 py-1 mb-2 bg-[var(--background)] border border-[var(--border)] rounded text-sm focus:outline-none focus:border-[var(--accent)] resize-none"
                      rows={2}
                    />
                    <div className="flex gap-2 mb-2">
                      <select
                        value={newTaskPriority}
                        onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
                        className="flex-1 px-2 py-1 bg-[var(--background)] border border-[var(--border)] rounded text-sm focus:outline-none focus:border-[var(--accent)]"
                      >
                        <option value="low">🟢 Low</option>
                        <option value="medium">🟡 Medium</option>
                        <option value="high">🔴 High</option>
                      </select>
                      <input
                        type="date"
                        value={newTaskDueDate}
                        onChange={(e) => setNewTaskDueDate(e.target.value)}
                        className="flex-1 px-2 py-1 bg-[var(--background)] border border-[var(--border)] rounded text-sm focus:outline-none focus:border-[var(--accent)]"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Tags (comma separated)"
                      value={newTaskTags}
                      onChange={(e) => setNewTaskTags(e.target.value)}
                      className="w-full px-2 py-1 mb-2 bg-[var(--background)] border border-[var(--border)] rounded text-sm focus:outline-none focus:border-[var(--accent)]"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => addTask(column.id)}
                        disabled={!newTaskTitle.trim()}
                        className="flex-1 px-3 py-1 bg-[var(--accent)] text-white rounded text-sm hover:bg-[var(--accent-hover)] transition disabled:opacity-50"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => { setIsAddingTask(null); setNewTaskTitle(''); setNewTaskDesc(''); }}
                        className="px-3 py-1 bg-[var(--background)] border border-[var(--border)] rounded text-sm hover:bg-[var(--border)] transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Task Cards */}
                {column.tasks.map(task => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task, column.id)}
                    className={`
                      p-3 bg-[var(--card)] rounded-lg border border-[var(--border)] cursor-grab active:cursor-grabbing
                      hover:border-[var(--accent)] transition group
                      ${draggedTask?.task.id === task.id ? 'opacity-50' : ''}
                    `}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-sm">{task.title}</h4>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() => openEditTask(task, column.id)}
                          className="p-1 hover:bg-[var(--background)] rounded text-[var(--muted)] hover:text-[var(--foreground)]"
                          title="Edit"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteTask(column.id, task.id)}
                          className="p-1 hover:bg-[var(--background)] rounded text-[var(--muted)] hover:text-red-500"
                          title="Delete"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    {task.description && (
                      <p className="text-xs text-[var(--muted)] mt-1 line-clamp-2">{task.description}</p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-1">
                      <span className={`px-1.5 py-0.5 text-xs rounded ${PRIORITY_CONFIG[task.priority].bg}`} style={{ color: PRIORITY_CONFIG[task.priority].color }}>
                        {PRIORITY_CONFIG[task.priority].label}
                      </span>
                      {task.tags.map(tag => (
                        <span key={tag} className="px-1.5 py-0.5 text-xs bg-[var(--background)] rounded text-[var(--muted)]">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {task.dueDate && (
                      <div className="mt-2 text-xs text-[var(--muted)] flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] w-full max-w-md p-4">
            <h3 className="font-semibold mb-4">Edit Task</h3>
            <input
              type="text"
              placeholder="Task title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="w-full px-3 py-2 mb-3 bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
              autoFocus
            />
            <textarea
              placeholder="Description (optional)"
              value={newTaskDesc}
              onChange={(e) => setNewTaskDesc(e.target.value)}
              className="w-full px-3 py-2 mb-3 bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] resize-none"
              rows={3}
            />
            <div className="flex gap-3 mb-3">
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
                className="flex-1 px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
              >
                <option value="low">🟢 Low Priority</option>
                <option value="medium">🟡 Medium Priority</option>
                <option value="high">🔴 High Priority</option>
              </select>
              <input
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                className="flex-1 px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={newTaskTags}
              onChange={(e) => setNewTaskTags(e.target.value)}
              className="w-full px-3 py-2 mb-4 bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
            />
            <div className="flex gap-2">
              <button
                onClick={updateTask}
                disabled={!newTaskTitle.trim()}
                className="flex-1 px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] transition disabled:opacity-50"
              >
                Save Changes
              </button>
              <button
                onClick={() => { setEditingTask(null); setNewTaskTitle(''); setNewTaskDesc(''); }}
                className="px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg hover:bg-[var(--border)] transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
