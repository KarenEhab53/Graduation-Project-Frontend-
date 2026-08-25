import { Route, Routes, useLocation } from "react-router-dom";

import "./App.css";

// ================= LAYOUT =================

import Navbar from "./components/layouts/Navbar/Navbar.jsx";
import Footer from "./components/layouts/footer/Footer.jsx";

// ================= HOME =================

import Home from "./pages/Home/Home.jsx";

// ================= AUTH =================

import Auth from "./pages/Auth/Auth.jsx";

import Login from "./components/Auth/Login/Login .jsx";
import SignUp from "./components/Auth/Sign up/SignUp.jsx";
import ForgetPassword from "./components/Auth/ForgetPassword/ForgetPassword.jsx";

import AdminLogin from "./pages/AdminLogin/AdminLogin.jsx";

// ================= ADMIN =================

import AdminDashboard from "./pages/AdminDashboard/AdminDashboard.jsx";

import Dashboard from "./components/AdminDashboard/Dashboard/Dashboard.jsx";
import Doctors from "./components/AdminDashboard/Doctors/Doctors.jsx";
import Users from "./components/AdminDashboard/Users/Users.jsx";

// ================= DOCTORS =================

import AllDoctors from "./pages/All Doctors/AllDoctors.jsx";
import DoctorProfile from "./pages/Doctor Profile/DoctorProfile.jsx";

// ================= USER DASHBOARD =================

import PatientDashboard from "./pages/Patient Dashboard/PatientDashboard.jsx";

import Profile from "./components/Dashboard/Profile/Profile.jsx";
import Medical from "./components/Dashboard/Medical History/Medical.jsx";
import NID from "./components/Dashboard/NID Search/NID.jsx";
import Appointement from "./components/Dashboard/User Appointment/Appointement.jsx";

// ================= DOCTOR DASHBOARD =================

import DoctorDashboard from "./pages/Doctor Dashboard/DoctorDashboard.jsx";

import DocAppointement from "./components/Dashboard/Doctor Appointement/DocAppointement.jsx";
import DocProfile from "./components/Dashboard/Doctor Profile/DocProfile.jsx";

// ================= OTHER =================

import UserSearch from "./pages/UserSearch/UserSearch.jsx";

import ProtectedRoute from "./components/Protect Route/ProtectedRoute.jsx";

import NotFound from "./pages/Not Found/NotFound.jsx";

// ================= CHAT =================

import Chat from "./pages/Chat/Chat.jsx";

// ================= KNOWN PATHS (PUBLIC ONLY) =================
// ملحوظة مهمة: مسارات الداشبورد (admin / user / doctor) اتشالت
// من هنا عمدًا، لأنها بتاخد الـ Layout (Header/Sidebar) الخاص بيها
// جوه الـ Dashboard component نفسه، ومش المفروض يتحط فوقها
// الـ Navbar/Footer العامين تاني.

const KNOWN_PATHS = [
  "/",
  "/alldoctors",
  "/doctor-profile",
  "/search-patient",
  "/chat",
];

function App() {
  const location = useLocation();

  // ================= AUTH PAGE =================

  const isAuthPage = location.pathname.startsWith("/auth");

  // ================= DASHBOARD ROUTES =================
  // أي مسار بيبدأ بـ dashboard خاص بيه Layout مستقل
  // (فيه Header/Sidebar جواه) فمينفعش نحط فوقه Navbar/Footer عامين.

  const isDashboardRoute =
    location.pathname.startsWith("/admin-dashboard") ||
    location.pathname.startsWith("/user-dashboard") ||
    location.pathname.startsWith("/doctor-dashboard");

  // ================= CHECK PATH =================

  const isKnownPath = KNOWN_PATHS.some(
    (path) =>
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`),
  );

  // ================= LAYOUT =================

  const hideLayout = isAuthPage || isDashboardRoute || !isKnownPath;

  return (
    <div className="app">
      {/* ================= NAVBAR ================= */}

      {!hideLayout && <Navbar />}

      <main className="content">
        <Routes>
          {/* =====================================================
              PUBLIC
          ===================================================== */}

          <Route path="/" element={<Home />} />

          <Route path="/alldoctors" element={<AllDoctors />} />

          <Route path="/doctor-profile/:id" element={<DoctorProfile />} />

          {/* =====================================================
              AUTH
          ===================================================== */}

          <Route path="/auth" element={<Auth />}>
            <Route index element={<Login />} />

            <Route path="login" element={<Login />} />

            <Route path="sign-up" element={<SignUp />} />

            <Route path="forget-password" element={<ForgetPassword />} />
          </Route>

          {/* =====================================================
              ADMIN LOGIN
          ===================================================== */}

          <Route path="/admin/login" element={<AdminLogin />} />

          {/* =====================================================
              ADMIN DASHBOARD
          ===================================================== */}

          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />}>
              {/* Dashboard */}

              <Route index element={<Dashboard />} />

              {/* Doctors */}

              <Route path="doctors" element={<Doctors />} />

              {/* Users */}

              <Route path="users" element={<Users />} />

              {/* ================= ADMIN CHAT ================= */}

              <Route path="chat" element={<Chat />} />
            </Route>
          </Route>

          {/* =====================================================
              USER + DOCTOR CHAT
          ===================================================== */}

          <Route
            element={
              <ProtectedRoute allowedRoles={["user", "doctor"]} />
            }
          >
            <Route path="/search-patient" element={<UserSearch />} />

            <Route path="/chat" element={<Chat />} />

            <Route path="/chat/:doctorId" element={<Chat />} />
          </Route>

          {/* =====================================================
              USER DASHBOARD
          ===================================================== */}

          <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
            <Route path="/user-dashboard" element={<PatientDashboard />}>
              <Route index element={<Profile />} />

              <Route path="profile" element={<Profile />} />

              <Route path="medical-history" element={<Medical />} />

              <Route path="NID" element={<NID />} />

              <Route path="my-appointement" element={<Appointement />} />
            </Route>
          </Route>

          {/* =====================================================
              DOCTOR DASHBOARD
          ===================================================== */}

          <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
            <Route path="/doctor-dashboard" element={<DoctorDashboard />}>
              <Route index element={<Profile />} />

              <Route path="profile" element={<Profile />} />

              <Route path="doctor-profile" element={<DocProfile />} />

              <Route path="medical-history" element={<Medical />} />

              <Route path="NID" element={<NID />} />

              <Route
                path="doctor-appointement"
                element={<DocAppointement />}
              />

              <Route path="my-appointement" element={<Appointement />} />
            </Route>
          </Route>

          {/* =====================================================
              NOT FOUND
          ===================================================== */}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* ================= FOOTER ================= */}

      {!hideLayout && <Footer />}
    </div>
  );
}

export default App;