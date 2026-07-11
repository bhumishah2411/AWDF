function Skills() {
    const skills = [
        "C++",
        "React",
        "JavaScript",
        "Node.js",
        "MongoDB"
    ];

    return (
        <section className="card">
            <h2>Skills</h2>

            <div className="skills">
                {skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                ))}
            </div>
        </section>
    );
}

export default Skills;