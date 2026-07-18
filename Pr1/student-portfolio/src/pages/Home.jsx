// src/pages/Home.jsx
import Header from "../components/Header"
import About from "../components/About"
import Skills from "../components/Skills"

function Home() {
    return (
        <>
            <Header name="Bhumi Shah" themeColor="#0f6d9f" />
            <About college="CSPIT, Charotar University" />
            <Skills />
        </>
    )
}
export default Home