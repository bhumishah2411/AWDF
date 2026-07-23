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
        <p>Loading repositories...</p>
        <style>{`
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
    </div>
);

const ErrorMessage = ({ message, onRetry }) => (
    <div className="error-message" style={{ textAlign: 'center', padding: '20px', color: '#ff4444' }}>
        <p>Error: {message}</p>
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
    </div>
);

function Projects() {
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchRepos = () => {
        setLoading(true);
        setError(null);
        fetch('https://api.github.com/users/BHUMISHAH2411/repos')
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch data');
                return res.json();
            })
            .then((data) => setRepos(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchRepos();
    }, []);

    const filteredRepos = repos.filter(repo =>
        repo.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        <a
                            href={project.github}
                            className="project-github"
                            target="_blank"
                            rel="noreferrer"
                        >
                            GitHub
                        </a>
                    </div>
                ))}
            </div>

            <h2 style={{ marginTop: '60px', marginBottom: '20px' }}>My GitHub Repositories</h2>

            <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                <input
                    type="text"
                    placeholder="Search repositories by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        padding: '10px 15px',
                        width: '100%',
                        maxWidth: '400px',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        fontSize: '16px'
                    }}
                />
            </div>

            {loading && <Spinner />}
            {error && <ErrorMessage message={error} onRetry={fetchRepos} />}

            {!loading && !error && (
                <div className="projects-grid">
                    {filteredRepos.map((repo) => (
                        <div className="project-card" key={repo.id}>
                            <div className="project-header">
                                <h3>{repo.name}</h3>
                                { }
                            </div>
                            <p className="project-subtitle">
                                {repo.description || "No description provided."}
                            </p>
                            <a
                                href={repo.html_url}
                                className="project-github"
                                target="_blank"
                                rel="noreferrer"
                                style={{ marginTop: '15px', display: 'inline-block' }}
                            >
                                View on GitHub
                            </a>
                        </div>
                    ))}
                    {!loading && !error && filteredRepos.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                            <p>No repositories found matching "{searchTerm}".</p>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}

export default Projects;