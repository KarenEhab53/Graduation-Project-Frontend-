import { Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/layouts/Navbar/Navbar.jsx'
import Home from './pages/Home/Home.jsx'
import Footer from './components/layouts/footer/Footer.jsx'

function App() {


  return (
    <>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer/>
    </>
  )
}

export default App
