import { Link } from "react-router-dom";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Home() {
  const { user } = useContext(AuthContext);

  if (user) {
    return user.role === "student" ? (
      <Navigate to="/student" />
    ) : (
      <Navigate to="/company" />
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Internship Portal</h1>

      <p className="text-gray-600 mb-8">
        Find internships or hire talented students
      </p>

      <div className="flex gap-4">
        <Link
          to="/login"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Sign In
        </Link>

        <Link
          to="/register"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
}

export default Home;
