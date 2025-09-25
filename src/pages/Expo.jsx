import React from "react";
import { FaChevronRight } from "react-icons/fa";

const DUMMY_EVENTS = [
  {
    id: "ev1",
    title: "AgriTech Expo 2025",
    date: "2025-10-12",
    city: "Indore",
    image: "https://www.kisaanhelpline.com/public/uploads/events/1753246536.jpg",
    location: "Brilliant Convention Center, Indore",
    description:
      "Explore cutting-edge agricultural technologies, precision farming tools, drones, sensors, irrigation solutions and more.",
    mapQuery: "Brilliant Convention Center Indore",
  },
  {
    id: "ev2",
    title: "Organic Farming Summit",
    date: "2025-11-02",
    city: "Bhopal",
    image: "https://www.kisaanhelpline.com/public/uploads/events/1756981298.jpg",
    location: "Minto Hall, Bhopal",
    description:
      "Sessions on soil health, bio-inputs, certification, and market linkages for organic produce.",
    mapQuery: "Minto Hall Bhopal",
  },
  {
    id: "ev3",
    title: "Irrigation & Water Management Fair",
    date: "2025-10-25",
    city: "Jaipur",
    image: "https://www.kisaanhelpline.com/public/uploads/events/1754388170.jpg",
    location: "JECC, Jaipur",
    description:
      "Micro-irrigation systems, smart pumps, canal modernization, and watershed case studies.",
    mapQuery: "JECC Jaipur",
  },
  {
    id: "ev4",
    title: "Horticulture Expo",
    date: "2025-12-05",
    city: "Pune",
    image: "https://www.kisaanhelpline.com/public/uploads/events/1753247909.jpg",
    location: "Agriculture College Grounds, Pune",
    description:
      "Protected cultivation, nursery tech, post-harvest management and cold-chain solutions.",
    mapQuery: "Agriculture College Pune",
  },
  {
    id: "ev5",
    title: "Seed Innovation Meet",
    date: "2025-09-30",
    city: "Hyderabad",
    image: "https://www.kisaanhelpline.com/public/uploads/events/1745237909.jpg",
    location: "HITEX, Hyderabad",
    description:
      "New hybrids, seed treatment, germination best practices and IP for seed businesses.",
    mapQuery: "HITEX Hyderabad",
  },
  {
    id: "ev6",
    title: "Dairy & Livestock Expo",
    date: "2025-10-18",
    city: "Anand",
    image: "https://www.kisaanhelpline.com/public/uploads/events/1753250336.jpg",
    location: "Amul Campus, Anand",
    description:
      "Breeding, fodder, animal health, milking tech, and cooperative success stories.",
    mapQuery: "Amul Anand",
  },
  {
    id: "ev7",
    title: "Agri Finance & Insurance Forum",
    date: "2025-11-15",
    city: "Mumbai",
    image: "https://www.kisaanhelpline.com/public/uploads/events/1738993506.png",
    location: "BKC, Mumbai",
    description:
      "Credit facilitation, PMFBY, risk mitigation, and fintech innovations for farmers.",
    mapQuery: "BKC Mumbai",
  },
  {
    id: "ev8",
    title: "Smart Mechanization Expo",
    date: "2025-12-12",
    city: "Nagpur",
    image: "https://www.kisaanhelpline.com/public/uploads/events/1747476118.jpg",
    location: "Reshimbagh Ground, Nagpur",
    description:
      "Implements, power tillers, mini-harvesters, IoT retrofits and rental model showcases.",
    mapQuery: "Reshimbagh Ground Nagpur",
  },
  {
    id: "ev9",
    title: "Agri Startup Conclave",
    date: "2025-10-09",
    city: "Bengaluru",
    image: "https://www.kisaanhelpline.com/public/uploads/events/1753269474.jpg",
    location: "NIMHANS Convention Centre, Bengaluru",
    description:
      "Pitch sessions, mentorship, funding avenues and incubator connect for agri-tech startups.",
    mapQuery: "NIMHANS Convention Centre Bengaluru",
  },
  {
    id: "ev10",
    title: "Soil & Climate Resilience Meet",
    date: "2025-11-28",
    city: "Chandigarh",
    image: "https://www.kisaanhelpline.com/public/uploads/events/1753270857.jpg",
    location: "Sector 17 Plaza, Chandigarh",
    description:
      "Climate-smart practices, soil carbon, mulching, and regenerative agriculture panels.",
    mapQuery: "Sector 17 Plaza Chandigarh",
  },
];

const Expo = () => {
  const [selected, setSelected] = React.useState(null);

  const open = (event) => setSelected(event);
  const close = () => setSelected(null);

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString();
    } catch {
      return iso;
    }
  };

  return (
    <div className="min-h-[60vh] bg-white p-4">
      <div className="mb-4 sm:mb-6 text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-dark-green">Upcoming events</h1>
        <p className="text-xs sm:text-sm text-gray-600">Discover expos, meets and summits</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {DUMMY_EVENTS.map((ev) => (
          <div key={ev.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200">
            {ev.image ? (
              <img src={ev.image} alt={ev.title} className="w-full h-36 object-cover" />
            ) : (
              <div className="w-full h-36 bg-gray-100" />
            )}
            <div className="p-3 sm:p-4">
              <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">{ev.title}</h3>
              <div className="space-y-2 mb-2">
                <div>
                  <div className="text-[11px] font-semibold text-gray-500 mb-1">Date</div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] sm:text-xs">
                    {formatDate(ev.date)}
                  </span>
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-gray-500 mb-1">City</div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[11px] sm:text-xs">
                    {ev.city}
                  </span>
                </div>
              </div>
              <button onClick={() => open(ev)} className="mt-2 w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-dark-green text-white text-sm shadow-sm hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-emerald-300 transition">
                Read more
                <FaChevronRight className="text-white" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={close} />
          <div className="relative z-10 bg-white w-full max-w-3xl rounded-xl shadow-lg overflow-hidden">
            <div className="p-3 sm:p-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">{selected.title}</h2>
                <div className="mt-1 text-[11px] sm:text-xs text-gray-600 flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">{formatDate(selected.date)}</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">{selected.city}</span>
                </div>
              </div>
              <button onClick={close} className="text-gray-500 hover:text-gray-700 text-sm">Close</button>
            </div>
            <div className="grid grid-cols-1  gap-0">
              <div className="p-3 sm:p-4">
                {selected.image ? (
                  <img src={selected.image} alt={selected.title} className="w-full h-44 sm:h-52 object-cover rounded-md border" />
                ) : (
                  <div className="w-full h-44 sm:h-52 bg-gray-100 rounded-md border" />
                )}
                <div className="mt-3 text-sm text-gray-800">
                  <div className="font-semibold mb-1">Location</div>
                  <div className="text-gray-700">{selected.location}</div>
                </div>
                <div className="mt-3 text-sm text-gray-800">
                  <div className="font-semibold mb-1">Description</div>
                  <p className="text-gray-700 leading-relaxed">{selected.description}</p>
                </div>
              </div>
            
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expo;


