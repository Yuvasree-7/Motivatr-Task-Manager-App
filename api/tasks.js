const API_URL = 'http://localhost:5000/api/tasks';

// Fetch all tasks for a specific user
export async function fetchTasks(userEmail) {
  const url = userEmail ? `${API_URL}?userEmail=${encodeURIComponent(userEmail)}` : API_URL;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  const data = await res.json();
  return data.map(({ _id, ...rest }) => ({
    ...rest,
    id: _id,
  }));
}

// Create a new task (must include userEmail)
export async function createTask(task) {
  if (!task.userEmail) throw new Error('userEmail is required to create a task');
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error('Failed to create task');
  return res.json();
}

// Update a task
export async function updateTask(id, updates) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update task');
  return res.json();
}

// Delete a task
export async function deleteTask(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete task');
  return res.json();
} 