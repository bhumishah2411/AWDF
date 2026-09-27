import { useState, useEffect } from 'react';

const projectList = [
    {
        title: "InternIQ",
        subtitle: "Internship Management Platform",
        tag: "MERN STACK",
        points: [
            "Implemented secure authentication with login/signup APIs using Node.js, Express.js, and MongoDB.",
            "Built a responsive internship dashboard using React.js for browsing listings and tracking applications.",
            "Designed RESTful API structure following SDLC practices with debugging and integration testing, creating a scalable foundation for future features like resume analysis and internship recommendations."
        ],
        tech: ["React", "Node.js", "Express.js", "MongoDB", "REST APIs"],
        github: "#"
    },
    {
        title: "Netflix Clone",
        subtitle: "Full-Stack Streaming Platform",
        tag: "FULL STACK",
        points: [
            "Built a full-stack Netflix-inspired streaming platform with dynamic movie listings and searchable content pages.",
            "Implemented category-based content retrieval using MySQL queries supporting multiple categories with curated datasets.",
            "Designed interactive UI with responsive layout and video playback functionality."
        ],
        tech: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
        github: "#"
    },
    {
        title: "AI-Powered Recruitment System",
        subtitle: "Enterprise Applicant Tracking System (ATS)",
        tag: "MERN STACK",
        points: [
            "Built a full-stack recruitment platform managing the complete hiring lifecycle, from manpower request creation to candidate onboarding, with role-based dashboards for HODs, HR recruiters, and admins.",
            "Developed a candidate tracking pipeline moving applicants through stages: New, Screening, Shortlisted, Interview Scheduled, Offered, Joined, and Rejected.",
            "Implemented digital manpower request forms with an admin approval workflow, replacing paper-based recruitment processes."
        ],
        tech: ["React", "Node.js", "Express.js", "MongoDB", "JWT"],
        github: "#"
    }
];

const Spinner = () => (
    <div className="spinner-container" style={{ textAlign: 'center', padding: '20px' }}>
        <div className="spinner" style={{
            border: '4px solid rgba(0,0,0,0.1)',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            borderLeftColor: '#09f',
            animation: 'spin 1s linear infinite',
            display: 'inline-block'
        }}></div>
        <p>Loading...</p>
        <style>{`
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
    </div>
);

const ErrorMessage = ({ message, onRetry }) => (
    <div className="error-message" style={{ textAlign: 'center', padding: '20px', color: '#ff4444' }}>
        <p>Error: {message}</p>
        {onRetry && (
            <button
                onClick={onRetry}
                style={{
                    padding: '8px 16px',
                    cursor: 'pointer',
                    backgroundColor: '#ff4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    marginTop: '10px'
                }}
            >
                Retry
            </button>
        )}
    </div>
);

function Projects() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [operationLoading, setOperationLoading] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({ title: '', description: '', priority: 'medium' });
    const [editingId, setEditingId] = useState(null);

    const API_URL = 'http://localhost:5000/tasks';

    // Fetch all tasks (Read)
    const fetchTasks = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error('Failed to fetch tasks');
            const data = await res.json();
            setTasks(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Create or Update task
    const handleSubmit = async (e) => {
        e.preventDefault();
        setOperationLoading(true);
        setError(null);

        try {
            if (editingId) {
                // Update
                const res = await fetch(`${API_URL}/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                if (!res.ok) throw new Error('Failed to update task');
                const updatedTask = await res.json();
                setTasks(tasks.map(t => t._id === editingId ? updatedTask : t));
                setEditingId(null);
            } else {
                // Create
                const res = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                if (!res.ok) throw new Error('Failed to create task');
                const newTask = await res.json();
                setTasks([...tasks, newTask]);
            }
            setFormData({ title: '', description: '', priority: 'medium' });
        } catch (err) {
            setError(err.message);
        } finally {
            setOperationLoading(false);
        }
    };

    // Delete task
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        
        setOperationLoading(true);
        setError(null);
        
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            if (!res.ok) throw new Error('Failed to delete task');
            setTasks(tasks.filter(t => t._id !== id));
        } catch (err) {
            setError(err.message);
        } finally {
            setOperationLoading(false);
        }
    };

    // Start editing a task
    const handleEdit = (task) => {
        setFormData({
            title: task.title,
            description: task.description || '',
            priority: task.priority || 'medium'
        });
        setEditingId(task._id);
        
        // Scroll to form
        document.getElementById('task-form-section').scrollIntoView({ behavior: 'smooth' });
    };

    // Toggle task completion
    const handleToggleComplete = async (task) => {
        setOperationLoading(true);
        setError(null);
        
        try {
            const res = await fetch(`${API_URL}/${task._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: !task.completed })
            });
            if (!res.ok) throw new Error('Failed to update task status');
            const updatedTask = await res.json();
            setTasks(tasks.map(t => t._id === task._id ? updatedTask : t));
        } catch (err) {
            setError(err.message);
        } finally {
            setOperationLoading(false);
        }
    };

    return (
        <section id="projects" className="card projects-section">
            <h2>Featured Projects</h2>
            <div className="projects-grid">
                {projectList.map((project) => (
                    <div className="project-card" key={project.title}>
                        <div className="project-header">
                            <h3>{project.title}</h3>
                            <span className="project-tag">{project.tag}</span>
                        </div>
                        <p className="project-subtitle">{project.subtitle}</p>
                        <ul className="project-points">
                            {project.points.map((point, i) => (
                                <li key={i}>{point}</li>
                            ))}
                        </ul>
                        <div className="project-tech">
                            {project.tech.map((t) => (
                                <span key={t}>{t}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <h2 style={{ marginTop: '60px', marginBottom: '20px' }}>My Tasks Manager</h2>
            <p style={{ textAlign: 'center', marginBottom: '30px' }}>
                Connected to Node+MongoDB Backend
            </p>

            <div id="task-form-section" className="project-card" style={{ maxWidth: '600px', margin: '0 auto 40px auto' }}>
                <h3 style={{ marginBottom: '15px', color: '#f8fafc' }}>{editingId ? 'Edit Task' : 'Add New Task'}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input
                        type="text"
                        name="title"
                        placeholder="Task Title (Required)"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="contact-textarea"
                        style={{ minHeight: 'auto', padding: '12px' }}
                    />
                    <textarea
                        name="description"
                        placeholder="Task Description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="contact-textarea"
                        style={{ minHeight: '80px' }}
                    />
                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        className="contact-textarea"
                        style={{ minHeight: 'auto', padding: '12px', cursor: 'pointer' }}
                    >
                        <option value="low" style={{ background: '#0f172a', color: '#e2e8f0' }}>Low Priority</option>
                        <option value="medium" style={{ background: '#0f172a', color: '#e2e8f0' }}>Medium Priority</option>
                        <option value="high" style={{ background: '#0f172a', color: '#e2e8f0' }}>High Priority</option>
                    </select>
                    
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit" disabled={operationLoading} className="contact-btn" style={{ flex: 1, margin: 0 }}>
                            {operationLoading ? 'Saving...' : editingId ? 'Update Task' : 'Add Task'}
                        </button>
                        {editingId && (
                            <button type="button" onClick={() => { setEditingId(null); setFormData({ title: '', description: '', priority: 'medium' }); }} className="contact-btn" style={{ margin: 0, borderColor: 'rgba(239, 68, 68, 0.4)', color: '#fca5a5', background: 'rgba(239, 68, 68, 0.1)' }}>
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {loading && <Spinner />}
            {error && <ErrorMessage message={error} onRetry={fetchTasks} />}

            {!loading && !error && (
                <div className="projects-grid">
                    {tasks.map((task) => (
                        <div className="project-card" key={task._id} style={{ opacity: task.completed ? 0.7 : 1 }}>
                            <div className="project-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                                    {task.title}
                                </h3>
                                <span style={{
                                    padding: '3px 8px', 
                                    borderRadius: '12px', 
                                    fontSize: '0.8rem',
                                    backgroundColor: task.priority === 'high' ? '#ffcccc' : task.priority === 'medium' ? '#fff2cc' : '#d9ead3',
                                    color: task.priority === 'high' ? '#cc0000' : task.priority === 'medium' ? '#b45f06' : '#38761d'
                                }}>
                                    {task.priority || 'medium'}
                                </span>
                            </div>
                            
                            <p className="project-subtitle" style={{ textDecoration: task.completed ? 'line-through' : 'none', marginTop: '10px' }}>
                                {task.description || "No description provided."}
                            </p>
                            
                            <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginRight: 'auto', color: '#e2e8f0' }}>
                                    <input 
                                        type="checkbox" 
                                        checked={task.completed} 
                                        onChange={() => handleToggleComplete(task)}
                                        disabled={operationLoading}
                                        style={{ marginRight: '8px', width: '18px', height: '18px', cursor: 'pointer' }}
                                    />
                                    {task.completed ? 'Completed' : 'Mark Complete'}
                                </label>
                                
                                <button 
                                    onClick={() => handleEdit(task)}
                                    disabled={operationLoading}
                                    className="contact-btn"
                                    style={{ padding: '6px 12px', margin: 0, fontSize: '0.8rem' }}
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={() => handleDelete(task._id)}
                                    disabled={operationLoading}
                                    className="contact-btn"
                                    style={{ padding: '6px 12px', margin: 0, fontSize: '0.8rem', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#fca5a5', background: 'rgba(239, 68, 68, 0.1)' }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                    {!loading && !error && tasks.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                            <p>No tasks found. Create one above!</p>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}

export default Projects;