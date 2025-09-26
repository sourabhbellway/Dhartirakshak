import React, { useEffect, useState } from "react";
import { useUserAuth } from "../contexts/UserAuthContext.jsx";
import Navbar from "../components/Navbar";
import LeftSidebar from "../components/LeftSidebar";
import { BASE_URL } from "../config.js";
import userAuth from "../controllers/userAuthController.js";
import defaultDP from "../assets/defaultDP.jpg";
const Profile = () => {
  const { token, user, loadProfile, isAuthenticated } = useUserAuth();
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("info");
  const [researches, setResearches] = useState([]);
  const [loadingResearch, setLoadingResearch] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated) return;
      const res = await loadProfile();
      if (!res.success) setError(res.message);
    };
    fetchProfile();
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchResearches = async () => {
      if (!isAuthenticated) return;
      setLoadingResearch(true);
      const res = await userAuth.myResearches(token);
      if (res.success)
        setResearches(Array.isArray(res.researches) ? res.researches : []);
      else setError(res.message || "Failed to load researches");
      setLoadingResearch(false);
    };
    fetchResearches();
  }, [isAuthenticated, token]);

  const fullUrl = (path) => {
    if (!path) return null;
    const raw = String(path);
    if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
    const base = (BASE_URL || "").replace(/\/$/, "");
    const normalized = raw.replace(/\\/g, "/").replace(/^\/+/, "");
    return `${base}/${normalized}`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-olive p-4">
        Please sign in to view profile.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-olive">
      <div className="sticky top-0 z-50 bg-olive">
        <Navbar />
      </div>
      <div className=" mx-auto px-3 sm:px-4 lg:px-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl  p-6  mx-auto">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={defaultDP}
                  alt="avatar"
                  className="w-20 h-20 rounded-full object-cover border border-lime-600"
                />
                <div>
                  <h1 className="text-2xl font-semibold text-dark-green">
                    {user?.name || "Your Profile"}
                  </h1>
                  <p className="text-green text-sm">{user?.email}</p>
                </div>
              </div>
              <div className="flex gap-2 mb-5 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("info")}
                  className={`px-4 py-2 text-sm rounded-t-md ${
                    activeTab === "info"
                      ? "bg-olive text-dark-green font-medium"
                      : "text-green hover:text-dark-green"
                  }`}
                >
                  Profile Info
                </button>
                <button
                  onClick={() => setActiveTab("research")}
                  className={`px-4 py-2 text-sm rounded-t-md ${
                    activeTab === "research"
                      ? "bg-olive text-dark-green font-medium"
                      : "text-green hover:text-dark-green"
                  }`}
                >
                  My Research
                </button>
              </div>
              {activeTab === "info" && (
                <div className="space-y-6">
                  {/* About card */}
                  {user?.description && (
                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                      <h3 className="text-emerald-900 font-semibold mb-2">
                        About
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {user.description}
                      </p>
                    </div>
                  )}

                  {/* Details grid */}
                  <div className="rounded-lg border border-gray-100 p-4">
                    <h3 className="text-emerald-900 font-semibold mb-4">
                      Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                      <div>
                        <div className="text-gray-500 text-xs uppercase tracking-wide">
                          Name
                        </div>
                        <div className="text-emerald-900 font-medium">
                          {user?.name || "-"}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs uppercase tracking-wide">
                          Email
                        </div>
                        <div className="text-emerald-900 font-medium">
                          {user?.email || "-"}
                        </div>
                      </div>
                      {user?.research_type && (
                        <div>
                          <div className="text-gray-500 text-xs uppercase tracking-wide">
                            Type
                          </div>
                          <div className="text-emerald-900 font-medium">
                            {user.research_type}
                          </div>
                        </div>
                      )}
                      {user?.research_field && (
                        <div>
                          <div className="text-gray-500 text-xs uppercase tracking-wide">
                            Field
                          </div>
                          <div className="text-emerald-900 font-medium">
                            {user.research_field}
                          </div>
                        </div>
                      )}
                      {user?.institution && (
                        <div>
                          <div className="text-gray-500 text-xs uppercase tracking-wide">
                            Institution
                          </div>
                          <div className="text-emerald-900 font-medium">
                            {user.institution}
                          </div>
                        </div>
                      )}
                      {user?.qualification && (
                        <div>
                          <div className="text-gray-500 text-xs uppercase tracking-wide">
                            Qualification
                          </div>
                          <div className="text-emerald-900 font-medium">
                            {user.qualification}
                          </div>
                        </div>
                      )}
                      {(user?.research_start_year ||
                        user?.research_end_year) && (
                        <div>
                          <div className="text-gray-500 text-xs uppercase tracking-wide">
                            Years
                          </div>
                          <div className="text-emerald-900 font-medium">
                            {user?.research_start_year} -{" "}
                            {user?.research_end_year}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "research" && (
                <div>
                  {loadingResearch ? (
                    <div className="text-green">Loading...</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {researches.map((r) => (
                        <article
                          key={r.id}
                          className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all"
                        >
                          <div className="h-32 bg-gray-50 overflow-hidden">
                            <img
                              src={fullUrl(r.image)}
                              alt={r.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <div className="flex items-start justify-between gap-3">
                              <h3 className="text-emerald-900 font-semibold line-clamp-2">
                                {r.title}
                              </h3>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full capitalize ${
                                  r.status === "approved"
                                    ? "bg-green-100 text-green-700"
                                    : r.status === "rejected"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {r.status}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                              {r.description}
                            </p>
                            <p className="text-gray-400 text-xs mt-2">
                              {new Date(r.created_at)
                                .toISOString()
                                .slice(0, 10)}
                            </p>
                          </div>
                        </article>
                      ))}
                      {researches.length === 0 && (
                        <div className="text-green">No researches found.</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <LeftSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
