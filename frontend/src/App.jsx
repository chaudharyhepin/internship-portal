import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Internships from "./pages/Internships";
import MyApplications from "./pages/MyApplications";
import InternshipApplicants from "./pages/InternshipApplicants";
import CompanyDashboard from "./pages/CompanyDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import InternshipDetails from "./pages/InternshipDetails";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/internships"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Internships />
            </ProtectedRoute>
          }
        />

        <Route
          path="/internship/:id"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <InternshipDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/company/internships/:id/applicants"
          element={<InternshipApplicants />}
        />

        <Route
          path="/my-applications"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <MyApplications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/company"
          element={
            <ProtectedRoute allowedRoles={["company"]}>
              <CompanyDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
    </BrowserRouter>
  );
}

export default App;
