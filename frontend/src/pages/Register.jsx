import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", form);
      alert("Registered successfully. Please login.");
      navigate("/login");
    } catch (err) {
      console.log("Registration error:", err.response);

      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert("Registration failed");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-16 p-6 border rounded shadow"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

      <input
        name="name"
        className="w-full border p-2 mb-3 rounded"
        placeholder="Name"
        onChange={handleChange}
      />

      <input
        name="email"
        className="w-full border p-2 mb-3 rounded"
        placeholder="Email"
        onChange={handleChange}
      />

      <input
        name="password"
        type="password"
        className="w-full border p-2 mb-3 rounded"
        placeholder="Password"
        onChange={handleChange}
      />

      <select
        name="role"
        className="w-full border p-2 mb-4 rounded"
        onChange={handleChange}
      >
        <option value="student">Student</option>
        <option value="company">Company</option>
      </select>

      <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
        Register
      </button>
    </form>
  );
}

export default Register;
