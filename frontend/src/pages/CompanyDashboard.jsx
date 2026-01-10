import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function CompanyDashboard() {
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(location.state?.tab || "post");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [mode, setMode] = useState("");
  const [skills, setSkills] = useState("");
  const [internships, setInternships] = useState([]);

  // Fetch applicants only when Applicants tab is active
  useEffect(() => {
    const fetchInternships = async () => {
      const res = await API.get("/internships/company");
      setInternships(res.data);
    };

    fetchInternships();
  }, []);

  useEffect(() => {
    if (location.state?.tab) {
      window.history.replaceState({}, document.title);
    }
  });

  // Post internship
  const handlePostInternship = async (e) => {
    e.preventDefault();

    if (!title || !description || !duration || !mode || !skills) {
      toast.error("Please fill all fields");
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

      toast.success("Internship posted successfully");
      setTitle("");
      setDescription("");
      setDuration("");
      setMode("");
      setSkills("");
    } catch {
      toast.error("Failed to post internship");
    }
  };

  const closeInternship = async (id) => {
    try {
      const res = await API.put(`/internships/close/${id}`);

      setInternships((prev) => prev.map((i) => (i._id === id ? res.data : i)));
    } catch {
      toast.error("Failed to close internship");
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
                <p className="text-sm text-gray-500">
                  Applicants: {i.applicantCount || 0}
                </p>

                <Link
                  to={`/company/internships/${i._id}/applicants`}
                  className="text-blue-600 underline text-sm mt-1 inline-block"
                >
                  View Applicants
                </Link>
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
