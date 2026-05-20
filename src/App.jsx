import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Navbar from "./components/layouts/Navbar/Navbar.jsx";
import Footer from "./components/layouts/footer/Footer.jsx";
import Home from "./pages/Home/Home.jsx";
import Auth from "./pages/Auth/Auth.jsx";

import Login from "./components/Auth/Login/Login .jsx";
import SignUp from "./components/Auth/Sign up/SignUp.jsx"

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith("/auth");

  return (
    <>
      {!isAuthPage && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/auth" element={<Auth />}>
          <Route index element={<Login />} />
          <Route path="login" element={<Login />} />
          <Route path="sign-up" element={<SignUp/>} />
        </Route>
      </Routes>

      {!isAuthPage && <Footer />}
    </>
  );
}

export default App;
