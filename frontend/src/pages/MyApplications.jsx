import { useEffect, useState } from "react";
import API from "../services/api";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await API.get("/applications/student");
        setApplications(res.data);
      } catch (err) {
        console.error("Failed to fetch applications", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const withdrawApplication = async (internshipId) => {
    const confirmWithdraw = window.confirm(
      "Are you sure you want to withdraw this application?"
    );

    if (!confirmWithdraw) return;

    try {
      await API.delete(`/applications/withdraw/${internshipId}`);
      setApplications((prev) =>
        prev.filter((app) => app.internship?._id !== internshipId)
      );
    } catch {
      alert("Failed to withdraw application");
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center text-gray-500">
        Loading your applications...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">My Applications</h2>

      {applications.length === 0 && (
        <p className="text-gray-500">
          You haven’t applied to any internships yet.
        </p>
      )}

      {applications.map((app) => (
        <div key={app._id} className="border rounded p-5 mb-4 shadow">
          <h3 className="text-xl font-semibold">{app.internship?.title}</h3>

          <p className="text-gray-600">{app.internship?.description}</p>

          <p className="text-sm mt-2 text-gray-500">
            Company: {app.internship?.company?.name || "N/A"}
          </p>

          <div className="mt-4 flex items-center gap-3">
            <span
              className={`font-medium ${
                app.status === "Accepted"
                  ? "text-green-600"
                  : app.status === "Rejected"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            >
              Status: {app.status}
            </span>

            {app.status === "Pending" && app.internship && (
              <button
                onClick={() => withdrawApplication(app.internship?._id)}
                className="ml-auto px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600"
              >
                Withdraw
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyApplications;
