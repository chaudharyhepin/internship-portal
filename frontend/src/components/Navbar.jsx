import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null;

  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-gray-900 text-white">
      <h1 className="text-lg font-bold">Internship Portal</h1>

      <div className="flex items-center gap-4">
        {user.role === "student" && (
          <>
            <Link to="/student" className="hover:underline">
              Home
            </Link>
            <Link to="/internships" className="hover:underline">
              Internships
            </Link>
            <Link to="/my-applications" className="hover:underline">
              My Applications
            </Link>
          </>
        )}

        {user.role === "company" && (
          <Link to="/company" className="hover:underline">
            Company Dashboard
          </Link>
        )}

        <button
          onClick={logout}
          className="bg-red-500 px-3 py-1 rounded cursor-pointer hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
