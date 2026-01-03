import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

function Internships() {
  const [internships, setInternships] = useState([]);
  const [appliedIds, setAppliedIds] = useState([]);
  const { user } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [resumeFile, setResumeFile] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const internshipsRes = await API.get("/internships");
      setInternships(internshipsRes.data);

      if (user?.role === "student") {
        const appliedRes = await API.get("/applications/student");

        // ✅ FIX: store ONLY internship IDs
        setAppliedIds(appliedRes.data.map((a) => a.internship._id));
      }
    };

    fetchData();
  }, [user]);

  const applyInternship = async (id) => {
    const file = resumeFile[id];

    if (!file) {
      alert("Please upload resume (PDF)");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      await API.post(`/applications/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAppliedIds((prev) => [...prev, id]);

      // remove used resume from state
      setResumeFile((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    } catch (err) {
      alert(err.response?.data?.message || "Apply failed");
    }
  };

  const availableInternships = internships.filter((i) => {
    const notApplied = !appliedIds.includes(i._id);
    const isOpen = i.isOpen;

    const matchesTitle = i.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCompany = i.company.name
      .toLowerCase()
      .includes(companyFilter.toLowerCase());

    return notApplied && isOpen && matchesTitle && matchesCompany;
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Available Internships</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by internship title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <input
          type="text"
          placeholder="Filter by company name"
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      {availableInternships.map((i) => (
        <div key={i._id} className="border rounded p-5 mb-4 shadow-sm">
          <h3 className="text-xl font-semibold">{i.title}</h3>

          <p className="text-gray-600">{i.description}</p>

          <p className="text-sm mt-2 text-gray-500">
            Company: {i.company.name}
          </p>

          <div className="mt-2 text-sm text-gray-600">
            <p>
              <strong>Duration:</strong> {i.duration}
            </p>
            <p>
              <strong>Mode:</strong> {i.mode}
            </p>
          </div>

          {i.skills && i.skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {i.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          {user?.role === "student" && (
            <div className="mt-4 flex flex-col gap-3">
              {/* Hidden file input */}
              <input
                type="file"
                accept="application/pdf"
                id={`resume-${i._id}`}
                className="hidden"
                onChange={(e) =>
                  setResumeFile((prev) => ({
                    ...prev,
                    [i._id]: e.target.files[0],
                  }))
                }
              />

              {/* Custom upload button */}
              <label
                htmlFor={`resume-${i._id}`}
                className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 transition"
              >
                📄 Upload Resume (PDF)
              </label>

              {/* Selected file name */}
              {resumeFile[i._id] && (
                <p className="text-sm text-gray-600">
                  Selected: {resumeFile[i._id].name}
                </p>
              )}

              {/* Apply button */}
              <button
                onClick={() => applyInternship(i._id)}
                className="w-full px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Empty State */}
      {availableInternships.length === 0 && (
        <p className="text-gray-500 text-center mt-10">
          No new internships available right now.
        </p>
      )}
    </div>
  );
}

export default Internships;
