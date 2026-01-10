import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

function InternshipApplicants() {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await API.get(`/applications/internship/${id}`);
        setApplications(res.data);
      } catch {
        toast.error("Failed to load applicants");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [id]);

  const updateStatus = async (applicationId, status) => {
    try {
      const res = await API.patch(`/applications/${applicationId}/status`, {
        status,
      });

      setApplications((prev) =>
        prev.map((app) => (app._id === applicationId ? res.data : app))
      );

      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading applicants...</p>;
  }

  if (applications.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Applicants</h1>
        <p className="text-gray-500">No applications yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link
        to="/company"
        state={{ tab: "internships" }}
        className="text-blue-600 hover:underline text-sm mb-4 inline-block"
      >
        ← Back to my internships
      </Link>

      <h1 className="text-2xl font-bold mb-6">Applicants</h1>

      {applications.map((app) => (
        <div key={app._id} className="border rounded p-4 mb-4">
          <p className="font-semibold">{app.student.name}</p>

          <p className="text-sm text-gray-600">{app.student.email}</p>
          <p className="mt-2 text-sm">
            <strong>Status:</strong>{" "}
            <span
              className={
                app.status === "Selected"
                  ? "text-green-600 font-medium"
                  : app.status === "Rejected"
                  ? "text-red-600 font-medium"
                  : "text-yellow-600 font-medium"
              }
            >
              {app.status}
            </span>
          </p>

          <div className="mt-3">
            <select
              value={app.status}
              disabled={app.status === "Selected" || app.status === "Rejected"}
              onChange={(e) => updateStatus(app._id, e.target.value)}
              className="border px-3 py-1 rounded"
            >
              <option value="Applied">Applied</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {app.resume && (
            <a
              href={`${import.meta.env.VITE_API_URL.replace("/api", "")}/${
                app.resume
              }`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline text-sm"
            >
              View Resume
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

export default InternshipApplicants;
