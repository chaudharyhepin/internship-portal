import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

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
      toast.warn("Application withdrawn successfully");
    } catch {
      toast.error("Failed to withdraw application");
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
        <div
          key={app._id}
          className="group border rounded-xl p-6 mb-5 bg-white shadow-sm hover:shadow-lg transition-all duration-300"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {app.internship?.title}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                {app.internship?.company?.name || "N/A"}
              </p>
            </div>

            <Link
              to={`/internship/${app.internship?._id}`}
              className="shrink-0 px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              View
            </Link>
          </div>

          {/* Description */}
          <p className="mt-4 text-gray-600 text-sm line-clamp-2">
            {app.internship?.description}
          </p>

          {/* Footer */}
          <div className="mt-5 flex items-center justify-between">
            {/* Status Badge */}
            <span
              className={`px-3 py-1 text-sm rounded-full font-medium ${
                app.status === "Accepted"
                  ? "bg-green-100 text-green-700"
                  : app.status === "Rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {app.status}
            </span>

            {/* Withdraw Button */}
            {app.status === "Pending" && app.internship && (
              <button
                onClick={() => withdrawApplication(app.internship?._id)}
                className="px-4 py-2 text-sm rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition"
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
