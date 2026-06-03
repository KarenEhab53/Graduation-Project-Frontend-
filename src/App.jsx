import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Navbar from "./components/layouts/Navbar/Navbar.jsx";
import Footer from "./components/layouts/footer/Footer.jsx";
import Home from "./pages/Home/Home.jsx";
import Auth from "./pages/Auth/Auth.jsx";

import Login from "./components/Auth/Login/Login .jsx";
import SignUp from "./components/Auth/Sign up/SignUp.jsx"
import AllDoctors from "./pages/All Doctors/AllDoctors.jsx";
import PatientDashboard from "./pages/Patient Dashboard/PatientDashboard.jsx";
import Profile from "./components/Dashboard/Profile/Profile.jsx";
import Medical from "./components/Dashboard/Medical History/Medical.jsx";
import NID from "./components/Dashboard/NID Search/NID.jsx";
import Appointement from "./components/Dashboard/User Appointment/Appointement.jsx";
import DoctorDashboard from "./pages/Doctor Dashboard/DoctorDashboard.jsx";
import DocAppointement from "./components/Dashboard/Doctor Appointement/DocAppointement.jsx";
import DocProfile from "./components/Dashboard/Doctor Profile/DocProfile.jsx";

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith("/auth");
  return (
    <div className="app">
      {!isAuthPage && <Navbar />}
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/auth" element={<Auth />}>
            <Route index element={<Login />} />
            <Route path="login" element={<Login />} />
            <Route path="sign-up" element={<SignUp />} />
          </Route>
          <Route path="/alldoctors" element={<AllDoctors />} />
          <Route path="/user-dashboard" element={<PatientDashboard />}>
            <Route index element={<Profile />} />
            <Route path="profile" element={<Profile />} />
            <Route path="medical-history" element={<Medical />} />
            <Route path="NID" element={<NID />} />
            <Route path="my-appointement" element={<Appointement />} />
          </Route>
          <Route path="/doctor-dashboard" element={<DoctorDashboard />}>
            <Route index element={<Profile />} />
            <Route path="profile" element={<Profile />} />
            <Route path="doctor-profile" element={<DocProfile />} />
            <Route path="medical-history" element={<Medical />} />
            <Route path="NID" element={<NID />} />
            <Route path="my-appointement" element={<DocAppointement />} />
          </Route>
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}

export default App;
