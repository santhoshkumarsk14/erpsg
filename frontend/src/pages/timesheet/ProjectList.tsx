import React, { useEffect, useState } from 'react';
import { getProjects, createProject, updateProject, deleteProject } from '../../services/timesheetService';

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const res = await getProjects();
    setProjects(res.data.data);
    setLoading(false);
  };

  const handleCreate = async () => {
    await createProject({ name });
    setName('');
    fetchProjects();
  };

  const handleDelete = async (id: number) => {
    await deleteProject(id);
    fetchProjects();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Projects</h2>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Project name" />
      <button onClick={handleCreate}>Add Project</button>
      <ul>
        {projects.map(p => (
          <li key={p.id}>
            {p.name}
            <button onClick={() => handleDelete(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList; 