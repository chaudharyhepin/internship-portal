import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [emailError, setEmailError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(value)) {
        setEmailError("Please enter a valid email address");
      } else {
        setEmailError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (emailError) {
      alert("Please fix the email error before submitting");
      return;
    }

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

      {/* <input
        name="email"
        className="w-full border p-2 mb-3 rounded"
        placeholder="Email"
        onChange={handleChange}
      /> */}

      <input
        name="email"
        type="email"
        className="w-full border p-2 mb-1 rounded"
        placeholder="Email"
        onChange={handleChange}
        required
      />

      {emailError && <p className="text-red-500 text-sm mb-2">{emailError}</p>}

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
