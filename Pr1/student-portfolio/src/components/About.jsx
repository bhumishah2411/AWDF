function About({ college }) {
    return (
        <section id="about" className="card">
            <h2>About ME</h2>
            <p>Hello I am <b>Bhumi Shah</b>, a passionate IT student who enjoys
                building websites and solving coding problems.</p>
            <p>
                <b>College : </b>{college}
            </p>
        </section>
    );
}
export default About;