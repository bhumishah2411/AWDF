import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Header from "./components/Header"
import About from "./components/About"
import Skills from "./components/Skills"
import Footer from "./components/Footer"

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="container">
      <Header name="Bhumi Shah"
        themeColor="#0f6d9f" />
      <About college="CSPIT, Charotar University" />
      <Skills />
      <Footer email="bhumishah2406@gmail.com" />
    </div>
  )
}

export default App
