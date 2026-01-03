import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Internships from "./pages/Internships";
import MyApplications from "./pages/MyApplications";
import CompanyDashboard from "./pages/CompanyDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

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
    </BrowserRouter>
  );
}

export default App;
