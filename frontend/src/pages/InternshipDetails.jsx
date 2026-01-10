import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

function InternshipDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resume, setResume] = useState(null);
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const internshipRes = await API.get(`/internships/${id}`);
        setInternship(internshipRes.data);

        if (user?.role === "student") {
          const appliedRes = await API.get("/applications/student");

          const myApplication = appliedRes.data.find(
            (a) => a.internship?._id === id
          );

          if (myApplication) {
            setApplied(true);
            setApplicationStatus(myApplication.status); // ✅ correct status
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const applyInternship = async () => {
    if (!resume) {
      toast.info("Please upload your resume first");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);

    try {
      setApplying(true);
      await API.post(`/applications/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setApplied(true);
      toast.success("Application submitted successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  const withdrawApplication = async () => {
    const confirmWithdraw = window.confirm(
      "Are you sure you want to withdraw your application?"
    );

    if (!confirmWithdraw) return;

    try {
      await API.delete(`/applications/withdraw/${id}`);
      setApplied(false);
      setApplicationStatus(null);
      toast.warn("Application withdrawn");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to withdraw application"
      );
    }
  };

  if (loading) {
    return (
      <p className="text-center text-gray-500 mt-10">
        Loading internship details...
      </p>
    );
  }

  if (!internship) {
    return (
      <p className="text-center text-gray-500 mt-10">Internship not found.</p>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back */}
      <Link to="/internships" className="text-blue-600 hover:underline text-sm">
        ← Back to internships
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        {/* LEFT CONTENT */}
        <div className="lg:col-span-2">
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900">
            {internship.title}
          </h1>

          {/* Company */}
          <p className="text-gray-600 text-lg mt-1">
            {internship.company?.name}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap gap-4 mt-4">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">
              ⏳ {internship.duration}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">
              📍 {internship.mode}
            </span>
          </div>

          {/* Description */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Internship Description
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {internship.description}
            </p>
          </div>

          {/* Skills */}
          {internship.skills?.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Skills Required
              </h2>
              <div className="flex flex-wrap gap-2">
                {internship.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT APPLY CARD */}
        {user?.role === "student" && (
          <div className="sticky top-24 border rounded-xl p-6 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Apply for this internship
            </h3>

            {!internship.isOpen ? (
              <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
                ❌ Applications are closed
              </div>
            ) : applied ? (
              <div className="flex flex-col gap-3 p-4 bg-green-50 rounded-md">
                {/* Applied + Status */}
                <div className="flex items-center justify-between gap-3">
                  <span className="text-green-700 text-sm font-medium">
                    ✅ You have already applied
                  </span>

                  <span
                    className={`px-3 py-1 text-sm rounded-full font-medium ${
                      applicationStatus === "Selected"
                        ? "bg-green-100 text-green-700"
                        : applicationStatus === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {applicationStatus || "Pending"}
                  </span>
                </div>

                {/* Withdraw button (ONLY when Pending) */}
                {applicationStatus === "Pending" && (
                  <button
                    onClick={withdrawApplication}
                    className="w-full mt-2 px-4 py-2 text-sm rounded-md
        bg-yellow-500 text-white font-medium
        hover:bg-yellow-600 transition"
                  >
                    Withdraw Application
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  id="resume-upload"
                  className="hidden"
                  onChange={(e) => setResume(e.target.files[0])}
                />

                <label
                  htmlFor="resume-upload"
                  className="inline-flex items-center justify-center gap-2
          border border-dashed border-blue-500 rounded-md h-14 px-6
          cursor-pointer hover:bg-blue-50 hover:border-blue-600
          focus-within:ring-2 focus-within:ring-blue-200 transition"
                >
                  <span className="text-blue-600 text-lg">⬆</span>
                  <span className="text-blue-600 font-medium">
                    Upload resume
                  </span>
                </label>

                <p className="text-sm text-gray-500">
                  Max file size: 10MB · PDF, DOC, DOCX
                </p>

                {resume && (
                  <p className="text-sm text-gray-700">
                    Selected: <strong>{resume.name}</strong>
                  </p>
                )}

                {!resume && (
                  <p className="text-xs text-gray-500">
                    Upload your resume to enable submit
                  </p>
                )}

                <button
                  onClick={applyInternship}
                  disabled={!resume || applying}
                  className={`h-14 rounded-md font-semibold transition transform ${
                    !resume || applying
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.02] cursor-pointer"
                  }`}
                >
                  {applying ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default InternshipDetails;
