import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEnvelope, FaPhone, FaSearch, FaChevronDown, FaCheck ,FaMobile } from "react-icons/fa";
import defaultAvatar from "../assets/defaultDP.jpg";

// Four top-level departments and their sub-departments
const departments = [
  "Department of Agricultural Research & Education (DARE)",
  "Dept. of Agriculture, Cooperation & Farmers Welfare (DAC&FW)",
  "Department of Animal Husbandry & Dairying (DAHD)",
  "Department of Fisheries",
];

// Department -> Sub Departments -> Contacts
const directoryTree = {
  "Department of Agricultural Research & Education (DARE)": {
    subDepartments: {
      "Headquarters": [
        { name: "Dr. Ananya Sharma", designation: "Secretary (DARE)", email: "sec.dare@gov.in", landline: "+91 11 2301 0001", mobile: "+91 98100 0001", photo: defaultAvatar },
      ],
      "Research Wing": [
        { name: "Rahul Verma", designation: "Joint Secretary", email: "js.dare@gov.in", landline: "+91 11 2301 0002", mobile: "+91 98100 0002", photo: defaultAvatar },
      ],
      "Admin Wing": [
        { name: "Priya Nair", designation: "Director (Admin)", email: "dir.admin.dare@gov.in", landline: "+91 11 2301 0003", mobile: "+91 98100 0003", photo: defaultAvatar },
      ],
    }
  },
  "Dept. of Agriculture, Cooperation & Farmers Welfare (DAC&FW)": {
    subDepartments: {
      "Headquarters": [
        { name: "Vikas Singh", designation: "Additional Secretary", email: "addsec.dacfw@gov.in", landline: "+91 11 2338 1001", mobile: "+91 98100 0101", photo: defaultAvatar },
      ],
      "Crops Division": [
        { name: "Meera Joshi", designation: "Director (Crops)", email: "dir.crops@gov.in", landline: "+91 11 2338 1002", mobile: "+91 98100 0102", photo: defaultAvatar },
      ],
      "Policy & Coordination": [
        { name: "Suresh Patil", designation: "Deputy Secretary", email: "dysec.dacfw@gov.in", landline: "+91 11 2338 1003", mobile: "+91 98100 0103", photo: defaultAvatar },
      ],
    }
  },
  "Department of Animal Husbandry & Dairying (DAHD)": {
    subDepartments: {
      "Animal Health": [
        { name: "Neha Kulkarni", designation: "Joint Commissioner", email: "jc.dahd@gov.in", landline: "+91 11 2309 2001", mobile: "+91 98100 0201", photo: defaultAvatar },
      ],
      "Dairy Development": [
        { name: "Amit Kumar", designation: "Director (Dairy)", email: "dir.dairy@gov.in", landline: "+91 11 2309 2002", mobile: "+91 98100 0202", photo: defaultAvatar },
      ],
      "Livestock Production": [
        { name: "Rohit Menon", designation: "Deputy Commissioner", email: "dc.dahd@gov.in", landline: "+91 11 2309 2003", mobile: "+91 98100 0203", photo: defaultAvatar },
      ],
    }
  },
  "Department of Fisheries": {
    subDepartments: {
      "Head Office": [
        { name: "Pooja Rao", designation: "Commissioner (Fisheries)", email: "comm.fish@gov.in", landline: "+91 11 2307 3001", mobile: "+91 98100 0301", photo: defaultAvatar },
      ],
      "Marine Division": [
        { name: "Harish Gupta", designation: "Director (Marine)", email: "dir.marine@gov.in", landline: "+91 11 2307 3002", mobile: "+91 98100 0302", photo: defaultAvatar },
      ],
      "Inland Division": [
        { name: "Sanjay Roy", designation: "Deputy Director (Inland)", email: "dd.inland@gov.in", landline: "+91 11 2307 3003", mobile: "+91 98100 0303", photo: defaultAvatar },
      ],
    }
  },
};

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const Directory = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const dept = query.get("dept") || "";
  const sub = query.get("sub") || "";
  const subDepartments = dept && directoryTree[dept]?.subDepartments ? Object.keys(directoryTree[dept].subDepartments) : [];
  const contacts = dept
    ? (sub
        ? (directoryTree[dept]?.subDepartments?.[sub] || [])
        : subDepartments.flatMap((s) => directoryTree[dept].subDepartments[s] || []))
    : [];
  // Only essential meta will be displayed per requirements

  // no clipboard interactions required in simplified view

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-dark-green">Directory</h1>
      
      </div>

      {!dept && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {departments.map((d) => (
            <button
              key={d}
              onClick={() => navigate(`/directory?dept=${encodeURIComponent(d)}`)}
              className="text-left bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm"
            >
              <div className="font-semibold text-gray-800">{d}</div>
              <div className="text-xs text-gray-500">View contacts</div>
            </button>
          ))}
        </div>
      )}

      {dept && (
        <div>
          <div className="mb-3">
            <h2 className="text-lg font-semibold text-gray-800">{dept || 'Select Department'}</h2>
            <p className="text-xs text-gray-600">{contacts.length} contacts{sub ? ` • ${sub}` : ""}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {contacts.map((c, i) => (
              <div key={c.email + i} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-start gap-3">
                  <img src={c.photo} alt={c.name} className="w-8 h-8 rounded-full object-cover border" />
                  <div className="min-w-0">
                    <div className="text-gray-900 font-semibold leading-tight">{c.name}</div>
                    <div className="text-xs text-gray-600">{c.designation}</div>
                    {/* <div className="text-[11px] text-gray-500">{dept}</div> */}
                  </div>
                </div>

                <div className="mt-3 space-y-1.5 text-sm">
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-gray-500" />
                    <a href={`mailto:${c.email}`} className="text-gray-800 hover:underline truncate">{c.email}</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaPhone   className="text-gray-500" />
                    <span className="text-gray-800">Landline: {c.landline}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMobile className="text-gray-500" />
                    <a href={`tel:${c.mobile.replace(/\s/g, "")}`} className="text-gray-800 hover:underline">Mobile: {c.mobile}</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Directory;

const CustomDropdown = ({ value, onChange, placeholder, options }) => {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const ref = React.useRef(null);

  React.useEffect(() => {
    const onClick = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const filtered = React.useMemo(() => {
    if (!query) return options;
    const q = query.toLowerCase();
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, query]);

  const selected = value || "";

  return (
    <div ref={ref} className="relative w-full sm:w-[28rem]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-left bg-white hover:border-gray-300 flex items-center justify-between"
      >
        <span className={selected ? "text-gray-800" : "text-gray-500"}>{selected || placeholder}</span>
        <FaChevronDown className={`text-gray-500 transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`} />
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow">
          {/* Search bar */}
          <div className="flex items-center gap-2 px-2 py-2 border-b">
            <FaSearch className="text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search departments"
              className="w-full outline-none text-sm"
            />
          </div>
          {/* Options list */}
          <div className="max-h-60 overflow-auto">
            {filtered.length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-500">No results</div>
            )}
            {filtered.map((opt) => (
              <button
                key={opt}
                onClick={() => { setOpen(false); setQuery(""); onChange(opt); }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-green-50 flex items-center justify-between ${selected === opt ? 'bg-green-50 text-dark-green' : 'text-gray-800'}`}
              >
                <span>{opt}</span>
                {selected === opt && <FaCheck className="text-dark-green" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


