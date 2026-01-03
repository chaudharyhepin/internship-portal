import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function StudentDashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-2">Hi, {user?.name}! 👋</h1>

      <p className="text-gray-600 text-lg">
        Let’s help you land your dream career
      </p>
    </div>
  );
}

export default StudentDashboard;
