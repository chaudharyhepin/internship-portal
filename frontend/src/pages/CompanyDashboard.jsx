import { useEffect, useState } from "react";
import API from "../services/api";

function CompanyDashboard() {
  const [activeTab, setActiveTab] = useState("post");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [mode, setMode] = useState("");
  const [skills, setSkills] = useState("");
  const [applications, setApplications] = useState([]);
  const [internships, setInternships] = useState([]);

  // Fetch applicants only when Applicants tab is active
  useEffect(() => {
    const fetchApplications = async () => {
      const res = await API.get("/applications/company");
      setApplications(res.data);
    };

    const fetchInternships = async () => {
      const res = await API.get("/internships/company");
      setInternships(res.data);
    };

    if (activeTab === "applicants") {
      fetchApplications();
    }

    fetchInternships();
  }, [activeTab]);

  // Post internship
  const handlePostInternship = async (e) => {
    e.preventDefault();

    if (!title || !description || !duration || !mode || !skills) {
      alert("Please fill all fields");
      return;
    }

    try {
      await API.post("/internships", {
        title,
        description,
        duration,
        mode,
        skills: skills.split(",").map((s) => s.trim()),
      });

      alert("Internship posted successfully");
      setTitle("");
      setDescription("");
      setDuration("");
      setMode("");
      setSkills("");
    } catch {
      alert("Failed to post internship");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await API.put(`/applications/status/${id}`, { status });

      setApplications((prev) =>
        prev.map((app) => (app._id === id ? res.data : app))
      );
    } catch {
      alert("Failed to update status");
    }
  };

  const closeInternship = async (id) => {
    try {
      const res = await API.put(`/internships/close/${id}`);

      setInternships((prev) => prev.map((i) => (i._id === id ? res.data : i)));
    } catch {
      alert("Failed to close internship");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Company Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab("post")}
          className={`px-4 py-2 rounded cursor-pointer transition-all duration-300 ease-in-out
      ${
        activeTab === "post"
          ? "bg-blue-600 text-white scale-105 shadow"
          : "bg-gray-200 hover:bg-gray-300"
      }`}
        >
          Post Internship
        </button>

        <button
          onClick={() => setActiveTab("applicants")}
          className={`px-4 py-2 rounded cursor-pointer transition-all duration-300 ease-in-out
      ${
        activeTab === "applicants"
          ? "bg-blue-600 text-white scale-105 shadow"
          : "bg-gray-200 hover:bg-gray-300"
      }`}
        >
          View Applicants
        </button>

        <button
          onClick={() => setActiveTab("internships")}
          className={`px-4 py-2 rounded cursor-pointer transition-all duration-300 ease-in-out
      ${
        activeTab === "internships"
          ? "bg-blue-600 text-white scale-105 shadow"
          : "bg-gray-200 hover:bg-gray-300"
      }`}
        >
          My Internships
        </button>
      </div>

      {/* POST INTERNSHIP SECTION */}
      {activeTab === "post" && (
        <div className="border rounded p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Post Internship</h2>

          <form onSubmit={handlePostInternship}>
            <input
              className="w-full border p-2 mb-3 rounded"
              placeholder="Internship Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              className="w-full border p-2 mb-4 rounded"
              placeholder="Internship Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <input
              className="w-full border p-2 mb-3 rounded"
              placeholder="Duration (e.g. 3 Months)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />

            <select
              className="w-full border p-2 mb-3 rounded"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              <option value="">Select Mode</option>
              <option value="Remote">Remote</option>
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
            </select>

            <input
              className="w-full border p-2 mb-4 rounded"
              placeholder="Skills (comma separated)"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />

            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Post Internship
            </button>
          </form>
        </div>
      )}

      {/* VIEW APPLICANTS SECTION */}
      {activeTab === "applicants" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Applicants</h2>

          {applications.length === 0 && (
            <p className="text-gray-500">No applications yet</p>
          )}

          {applications.map((app) => (
            <div key={app._id} className="border rounded p-4 mb-4 shadow">
              <p>
                <strong>Internship:</strong> {app.internship.title}
              </p>
              <p>
                <strong>Student:</strong> {app.student.name}
              </p>
              <p>
                <strong>Email:</strong> {app.student.email}
              </p>

              <p className="mt-2">
                <strong>Status:</strong>{" "}
                <span
                  className={
                    app.status === "Accepted"
                      ? "text-green-600 font-medium"
                      : app.status === "Rejected"
                      ? "text-red-600 font-medium"
                      : "text-yellow-600 font-medium"
                  }
                >
                  {app.status}
                </span>
              </p>

              {/* View Resume Link */}
              {app.resume && (
                <a
                  href={`https://internship-portal-backend-6rv5.onrender.com/${app.resume}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline mt-2 inline-block"
                >
                  View Resume
                </a>
              )}

              {app.status === "Pending" && (
                <div className="mt-3 flex gap-3">
                  <button
                    onClick={() => updateStatus(app._id, "Accepted")}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => updateStatus(app._id, "Rejected")}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* My Internships */}
      {activeTab === "internships" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">My Internships</h2>

          {internships.length === 0 && (
            <p className="text-gray-500">
              You haven’t posted any internships yet.
            </p>
          )}

          {internships.map((i) => (
            <div
              key={i._id}
              className="border rounded p-4 mb-3 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{i.title}</p>
                <p
                  className={`text-sm ${
                    i.isOpen ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {i.isOpen ? "Open" : "Closed"}
                </p>
              </div>

              {i.isOpen && (
                <button
                  onClick={() => closeInternship(i._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Close
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CompanyDashboard;
