import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

function Internships() {
  const [loading, setLoading] = useState(true);
  const [internships, setInternships] = useState([]);
  const [appliedIds, setAppliedIds] = useState([]);
  const { user } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const internshipsRes = await API.get("/internships");
        setInternships(internshipsRes.data);

        if (user?.role === "student") {
          const appliedRes = await API.get("/applications/student");
          setAppliedIds(appliedRes.data.map((a) => a.internship._id));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

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

  const shortText = (text, length = 100) => {
    if (!text) return "";
    return text.length > length ? text.slice(0, length) + "..." : text;
  };

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

      {loading ? (
        <p className="text-center text-gray-500 mt-10">
          Loading internships...
        </p>
      ) : availableInternships.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          No new internships available right now.
        </p>
      ) : (
        availableInternships.map((i) => (
          <Link
            to={`/internship/${i._id}`}
            key={i._id}
            className="block border rounded p-5 mb-4 shadow-sm hover:shadow-md transition cursor-pointer"
          >
            {/* Title */}
            <h3 className="text-xl font-semibold text-blue-600">{i.title}</h3>

            {/* Company */}
            <p className="text-gray-700 font-medium mt-1">{i.company.name}</p>

            {/* One-line description */}
            <p className="text-gray-600 mt-2">{shortText(i.description, 90)}</p>

            {/* Internship meta */}
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
              <span>
                <strong>Mode:</strong> {i.mode}
              </span>
              <span>
                <strong>Duration:</strong> {i.duration}
              </span>
            </div>

            {/* Skills */}
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
          </Link>
        ))
      )}
    </div>
  );
}

export default Internships;
