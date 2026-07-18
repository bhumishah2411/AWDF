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

function Projects() {
    return (
        <section id="projects" className="card projects-section">
            <h2>Projects</h2>
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
        </section>
    );
}

export default Projects;