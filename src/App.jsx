import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";

import Navbar from "./components/layouts/Navbar/Navbar.jsx";
import Footer from "./components/layouts/footer/Footer.jsx";

import Home from "./pages/Home/Home.jsx";
import Auth from "./pages/Auth/Auth.jsx";

import Login from "./components/Auth/Login/Login .jsx";
import SignUp from "./components/Auth/Sign up/SignUp.jsx";
import ForgetPassword from "./components/Auth/ForgetPassword/ForgetPassword.jsx";
import AdminLogin from "./pages/AdminLogin/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard.jsx";
import Dashboard from "./components/AdminDashboard/Dashboard/Dashboard.jsx";
import Doctors from "./components/AdminDashboard/Doctors/Doctors.jsx";
import Users from "./components/AdminDashboard/Users/Users.jsx";

import AllDoctors from "./pages/All Doctors/AllDoctors.jsx";

import PatientDashboard from "./pages/Patient Dashboard/PatientDashboard.jsx";
import Profile from "./components/Dashboard/Profile/Profile.jsx";
import Medical from "./components/Dashboard/Medical History/Medical.jsx";
import NID from "./components/Dashboard/NID Search/NID.jsx";
import Appointement from "./components/Dashboard/User Appointment/Appointement.jsx";

import DoctorDashboard from "./pages/Doctor Dashboard/DoctorDashboard.jsx";
import DocAppointement from "./components/Dashboard/Doctor Appointement/DocAppointement.jsx";
import DocProfile from "./components/Dashboard/Doctor Profile/DocProfile.jsx";

import UserSearch from "./pages/UserSearch/UserSearch.jsx";
import ProtectedRoute from "./components/Protect Route/ProtectedRoute.jsx";
import NotFound from "./pages/Not Found/NotFound.jsx";
import DoctorProfile from "./pages/Doctor Profile/DoctorProfile.jsx";
import Chat from "./pages/Chat/Chat.jsx";

const KNOWN_PATHS = [
  "/",
  "/alldoctors",
  "/doctor-profile",
  "/search-patient",
  "/user-dashboard",
  "/doctor-dashboard",
  "/chat",
];

function App() {
  const location = useLocation();

  const isAuthPage = location.pathname.startsWith("/auth");

  const isKnownPath = KNOWN_PATHS.some(
    (path) =>
      location.pathname === path || location.pathname.startsWith(path + "/"),
  );

  const hideLayout = isAuthPage || !isKnownPath;

  return (
    <div className="app">
      {!hideLayout && <Navbar />}

      <main className="content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />

          <Route path="/alldoctors" element={<AllDoctors />} />

          <Route path="/doctor-profile/:id" element={<DoctorProfile />} />

          {/* Authentication */}
          <Route path="/auth" element={<Auth />}>
            <Route index element={<Login />} />

            <Route path="login" element={<Login />} />

            <Route path="sign-up" element={<SignUp />} />

            <Route path="forget-password" element={<ForgetPassword />} />
          </Route>

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />}>
              <Route index element={<Dashboard />} />
              <Route path="doctors" element={<Doctors />} />
              <Route path="users" element={<Users />} />
            </Route>
          </Route>

          {/* User and Doctor */}
          <Route element={<ProtectedRoute allowedRoles={["user", "doctor"]} />}>
            <Route path="/search-patient" element={<UserSearch />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/chat/:doctorId" element={<Chat />} />
          </Route>

          {/* User Dashboard */}
          <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
            <Route path="/user-dashboard" element={<PatientDashboard />}>
              <Route index element={<Profile />} />

              <Route path="profile" element={<Profile />} />

              <Route path="medical-history" element={<Medical />} />

              <Route path="NID" element={<NID />} />

              <Route path="my-appointement" element={<Appointement />} />
            </Route>
          </Route>

          {/* Doctor Dashboard */}
          <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
            <Route path="/doctor-dashboard" element={<DoctorDashboard />}>
              <Route index element={<Profile />} />

              <Route path="profile" element={<Profile />} />

              <Route path="doctor-profile" element={<DocProfile />} />

              <Route path="medical-history" element={<Medical />} />

              <Route path="NID" element={<NID />} />

              <Route path="doctor-appointement" element={<DocAppointement />} />

              <Route path="my-appointement" element={<Appointement />} />
            </Route>
          </Route>

          {/* Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
}

export default App;
