import React, { useEffect, useState } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../../services/timesheetService';

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    const res = await getTasks();
    setTasks(res.data.data);
    setLoading(false);
  };

  const handleCreate = async () => {
    await createTask({ name });
    setName('');
    fetchTasks();
  };

  const handleDelete = async (id: number) => {
    await deleteTask(id);
    fetchTasks();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Tasks</h2>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Task name" />
      <button onClick={handleCreate}>Add Task</button>
      <ul>
        {tasks.map(t => (
          <li key={t.id}>
            {t.name}
            <button onClick={() => handleDelete(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList; 