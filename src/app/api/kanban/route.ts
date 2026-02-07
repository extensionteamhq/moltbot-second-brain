import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'kanban.json');

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.dirname(DATA_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Default project structure for Molly's workflow
const DEFAULT_DATA = {
  projects: [
    {
      id: 'molly-tasks',
      name: "Molly's Recommendations",
      description: 'Tasks recommended by Molly for autonomous execution',
      columns: [
        { id: 'for-consideration', title: '🤔 For Consideration', color: '#6b7280', tasks: [] },
        { id: 'research-plan', title: '🔬 Research & Plan', color: '#3b82f6', tasks: [] },
        { id: 'implementing', title: '⚡ Implementing', color: '#f59e0b', tasks: [] },
        { id: 'done', title: '✅ Done', color: '#22c55e', tasks: [] },
      ],
      createdAt: new Date().toISOString(),
    },
  ],
  activeProjectId: 'molly-tasks',
};

async function loadData() {
  await ensureDataDir();
  try {
    const content = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    // File doesn't exist, return default
    return DEFAULT_DATA;
  }
}

async function saveData(data: any) {
  await ensureDataDir();
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET - Load kanban data
export async function GET() {
  const data = await loadData();
  return NextResponse.json(data);
}

// POST - Add a task
export async function POST(request: Request) {
  const body = await request.json();
  const { projectId = 'molly-tasks', columnId = 'for-consideration', task } = body;

  const data = await loadData();
  const project = data.projects.find((p: any) => p.id === projectId);
  
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  const column = project.columns.find((c: any) => c.id === columnId);
  if (!column) {
    return NextResponse.json({ error: 'Column not found' }, { status: 404 });
  }

  const newTask = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: task.title,
    description: task.description || '',
    priority: task.priority || 'medium',
    tags: task.tags || [],
    createdAt: new Date().toISOString(),
    dueDate: task.dueDate,
  };

  column.tasks.push(newTask);
  await saveData(data);

  return NextResponse.json({ success: true, task: newTask });
}

// PATCH - Move a task between columns
export async function PATCH(request: Request) {
  const body = await request.json();
  const { projectId = 'molly-tasks', taskId, fromColumn, toColumn } = body;

  const data = await loadData();
  const project = data.projects.find((p: any) => p.id === projectId);
  
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  const sourceCol = project.columns.find((c: any) => c.id === fromColumn);
  const targetCol = project.columns.find((c: any) => c.id === toColumn);

  if (!sourceCol || !targetCol) {
    return NextResponse.json({ error: 'Column not found' }, { status: 404 });
  }

  const taskIndex = sourceCol.tasks.findIndex((t: any) => t.id === taskId);
  if (taskIndex === -1) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  const [task] = sourceCol.tasks.splice(taskIndex, 1);
  targetCol.tasks.push(task);
  await saveData(data);

  return NextResponse.json({ success: true, task });
}
