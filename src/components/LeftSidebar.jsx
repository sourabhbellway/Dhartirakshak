import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaInfoCircle, FaBolt, FaChevronRight } from "react-icons/fa";
import newsPublicController from "../controllers/newsPublicController.js";
import { FaFire } from "react-icons/fa";
import businessSettingsPublicController from "../controllers/businessSettingsPublicController.js";
import weatherPublicController from "../controllers/weatherPublicController.js";
import geocodingPublicController from "../controllers/geocodingPublicController.js";
import { MdOutlineRemoveRedEye  } from "react-icons/md";
import expo from "../assets/expo.png"
const LeftSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Trending states
  const [trending, setTrending] = React.useState([]);
  const [expandedTrending, setExpandedTrending] = React.useState(
    () => new Set()
  );

  // Weather states
  const [weatherApiKey, setWeatherApiKey] = React.useState("");
  const [selectedCity, setSelectedCity] = React.useState(() => {
    try {
      return localStorage.getItem("weather_city") || "Indore";
    } catch {
      return "Indore";
    }
  });
  const [selectedCoords, setSelectedCoords] = React.useState(() => {
    try {
      const raw = localStorage.getItem("weather_city_coords");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [cityQuery, setCityQuery] = React.useState("");
  const [suggestions, setSuggestions] = React.useState([]);
  const [weatherLoading, setWeatherLoading] = React.useState(false);
  const [weatherError, setWeatherError] = React.useState("");
  const [weatherData, setWeatherData] = React.useState(null);

  // Directory options shown on Directory route
  const departments = [
    "Department of Agricultural Research & Education (DARE)",
    "Dept. of Agriculture, Cooperation & Farmers Welfare (DAC&FW)",
    "Department of Animal Husbandry & Dairying (DAHD)",
    "Department of Fisheries",
  ];
  const subDepartmentsByDept = {
    "Department of Agricultural Research & Education (DARE)": [
      "Headquarters",
      "Research Wing",
      "Admin Wing",
    ],
    "Dept. of Agriculture, Cooperation & Farmers Welfare (DAC&FW)": [
      "Headquarters",
      "Crops Division",
      "Policy & Coordination",
    ],
    "Department of Animal Husbandry & Dairying (DAHD)": [
      "Animal Health",
      "Dairy Development",
      "Livestock Production",
    ],
    "Department of Fisheries": [
      "Head Office",
      "Marine Division",
      "Inland Division",
    ],
  };
  const [openDept, setOpenDept] = React.useState(null);

  React.useEffect(() => {
    const load = async () => {
      try {
        const trendRes = await newsPublicController.listTrending();
        const trendData = trendRes?.data || trendRes || [];
        setTrending(Array.isArray(trendData) ? trendData : []);
      } catch {
        // ignore trending fetch errors
      }
    };
    load();
  }, []);

  // Load public business settings for weather key
  React.useEffect(() => {
    const loadConfig = async () => {
      try {
        const settings = await businessSettingsPublicController.list();
        const arr = Array.isArray(settings) ? settings : [];
        const weather = arr.find((s) => s.key === "weather_api");
        const key = weather?.value?.api_key || "";
        setWeatherApiKey(key);
      } catch {
        // ignore, will error later if missing
      }
    };
    loadConfig();
  }, []);

  // On first load, if no saved city/coords, try geolocation to set defaults
  React.useEffect(() => {
    const setFromGeolocation = async () => {
      if (!weatherApiKey) return;
      if (!("geolocation" in navigator)) return;
      try {
        await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 300000,
          });
        }).then(async (pos) => {
          const { latitude, longitude } = pos.coords;
          // reverse geocode
          try {
            const results = await geocodingPublicController.reverseLookup(
              weatherApiKey,
              latitude,
              longitude,
              1
            );
            const first =
              Array.isArray(results) && results[0] ? results[0] : null;
            const name = first?.name || "My Location";
            setSelectedCity(name);
            setSelectedCoords({ lat: latitude, lon: longitude });
            try {
              localStorage.setItem("weather_city", name);
              localStorage.setItem(
                "weather_city_coords",
                JSON.stringify({ lat: latitude, lon: longitude })
              );
            } catch {
              // ignore localStorage errors
            }
          } catch {
            // fallback to coords without name
            setSelectedCity("My Location");
            setSelectedCoords({ lat: latitude, lon: longitude });
          }
        });
      } catch {
        // ignore permission denied/timeouts
      }
    };
    setFromGeolocation();
  }, [weatherApiKey]);

  // Debounced city geocoding suggestions
  React.useEffect(() => {
    let timer;
    const run = async () => {
      if (!weatherApiKey || !cityQuery || cityQuery.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const list = await geocodingPublicController.searchCities(
          weatherApiKey,
          cityQuery,
          "IN",
          8
        );
        setSuggestions(list);
      } catch {
        setSuggestions([]);
      }
    };
    timer = setTimeout(run, 300);
    return () => clearTimeout(timer);
  }, [cityQuery, weatherApiKey]);

  // Fetch weather when api key or selection changes
  React.useEffect(() => {
    const fetchWeather = async () => {
      if (!weatherApiKey || !selectedCity) return;
      setWeatherLoading(true);
      setWeatherError("");
      try {
        let data;
        if (
          selectedCoords &&
          typeof selectedCoords.lat === "number" &&
          typeof selectedCoords.lon === "number"
        ) {
          data = await weatherPublicController.getCurrentByCoords(
            weatherApiKey,
            selectedCoords.lat,
            selectedCoords.lon
          );
        } else {
          data = await weatherPublicController.getCurrentByCity(
            weatherApiKey,
            selectedCity,
            "IN"
          );
        }
        setWeatherData(data);
      } catch {
        setWeatherError("Failed to load weather");
      } finally {
        setWeatherLoading(false);
      }
    };
    fetchWeather();
  }, [weatherApiKey, selectedCity, selectedCoords]);

  const handlePickSuggestion = (sugg) => {
    const cityName = sugg.name;
    setSelectedCity(cityName);
    setSelectedCoords({ lat: sugg.lat, lon: sugg.lon });
    setCityQuery("");
    setSuggestions([]);
    try {
      localStorage.setItem("weather_city", cityName);
      localStorage.setItem(
        "weather_city_coords",
        JSON.stringify({ lat: sugg.lat, lon: sugg.lon })
      );
    } catch {
      // ignore localStorage errors
    }
  };

  const toggleTrendingExpand = (key) => {
    setExpandedTrending((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
      <div className="w-full h-full bg-gray-50  border-r lg:border-r border-b lg:border-b-0 border-gray-200 p-3 sm:p-4">
        <div>
          <Link to="/expo" className="">
          <img src={expo} alt="" className="w-full" />
          </Link>
        </div>
      {/* Bulletins (default) or Departments (on /directory) */}
      <div className="mb-6 sm:mb-8">
        <div className="rounded-xl p-[2px] bg-[radial-gradient(circle_at_20%_0%,_#d9fbe6,_#ffffff_60%)]">
          <div className="rounded-[11px] bg-white">
            {location.pathname === '/directory' ? (
              <>
                <div className="px-3 sm:px-4 pt-3 sm:pt-4 pb-2 sm:pb-3">
                  <h3 className="text-lg sm:text-xl font-bold text-dark-green">Agriculture Departments</h3>
                </div>
                <ul className="divide-y divide-gray-100">
                  {departments.map((name) => {
                    const isOpen = openDept === name;
                    return (
                      <li key={name} className="group px-3 sm:px-4">
                        <button
                          onClick={() => {
                            setOpenDept((prev) => (prev === name ? null : name));
                            const current = new URLSearchParams(location.search);
                            current.set('dept', name);
                            current.delete('sub');
                            navigate(`/directory?${current.toString()}`);
                          }}
                          className="w-full text-left relative py-2.5 sm:py-3 flex items-start gap-2 sm:gap-3"
                        >
                          <div className="mt-1.5 inline-flex h-2 w-2 rounded-full bg-green-600"></div>
                          <p className="flex-1 text-[13px] sm:text-sm text-gray-800 leading-snug">
                            <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">
                              {name}
                            </span>
                          </p>
                          <FaChevronRight className={`mt-0.5 text-gray-400 group-hover:text-dark-green transition-all ${isOpen ? 'rotate-90' : ''}`} />
                        </button>
                        {isOpen && (
                          <div className="mb-2 pl-6">
                            {subDepartmentsByDept[name].map((s) => (
                              <Link
                                key={s}
                                to={`/directory?dept=${encodeURIComponent(name)}&sub=${encodeURIComponent(s)}`}
                                className="block px-2 py-1.5 text-[13px] text-gray-700 hover:text-dark-green hover:bg-green-50 rounded"
                              >
                                {s}
                              </Link>
                            ))}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : (
              <>
                <div className="px-3 sm:px-4 pt-3 sm:pt-4 pb-2 sm:pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-bold text-dark-green">Bulletins</h3>
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 border border-emerald-200 px-2 py-0.5 rounded-full">
                      <FaBolt className="text-emerald-600" /> Live
                    </span>
                  </div>
                  <div className="hidden sm:block text-[11px] text-gray-500">Top 10 updates</div>
                </div>
                <ul className="divide-y divide-gray-100">
                  {[
                    "Monsoon likely to advance over central India this week",
                    "Govt announces MSP hike for key Kharif crops",
                    "Soil health cards distribution drive starts today",
                    "New drone guidelines for crop spraying released",
                    "Wheat arrivals ease; prices remain steady in mandis",
                    "PMFBY claim window extended for select districts",
                    "Horticulture exports hit new record this quarter",
                    "Major canal maintenance scheduled next month",
                    "Pulses acreage up 12% year-on-year",
                    "Farmer producer org grants open for applications",
                  ].map((text, i) => (
                    <li key={i} className="group px-3 sm:px-4">
                      <div className="relative py-2.5 sm:py-3 flex items-start gap-2 sm:gap-3">
                        <div className="mt-1.5 inline-flex h-2 w-2 rounded-full bg-rose-700  animate-pulse"></div>
                        <p className="flex-1 text-[13px] sm:text-sm text-gray-800 leading-snug">
                          <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">
                            {text}
                          </span>
                        </p>
                        <FaChevronRight className="mt-0.5 text-gray-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                        <span className="absolute inset-0 pointer-events-none rounded-md bg-gradient-to-r from-green-50/0 via-green-50/0 to-green-50/0 group-hover:to-green-50/60 transition-colors duration-300"></span>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Trending News - moved from RightSidebar to top here */}
      {Array.isArray(trending) && trending.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <div className="mb-4 sm:mb-6 text-center">
            <h2 className="text-lg sm:text-xl font-bold text-dark-green">
              Trending News
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">Latest & Popular</p>
          </div>
          <div className="space-y-3">
            {trending.slice(0, 6).map((item, idx) => (
              <article
                key={item.id || item._id || idx}
                className="relative bg-white rounded-lg p-3 border border-gray-200 hover:shadow-sm transition-all duration-200"
              >
                <div className="absolute top-1 right-1 flex items-center gap-1 bg-rose-100 text-rose-700 text-[9px] px-2 py-0.5 rounded-full border border-red-200 shadow-sm animate-pulse">
                  <FaFire className="text-rose-500" />
                  <span className="font-semibold ">Trending Now</span>
                </div>
                <div className="flex items-start gap-3">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title || "trending"}
                      className="w-16 h-16 object-cover rounded-md border"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-md border bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                      No image
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    {item.title && (
                      <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                        {item.title}
                      </h4>
                    )}
                    {(() => {
                      const key = item.id || item._id || idx;
                      const isExpanded = expandedTrending.has(key);
                      return item.description ? (
                        <>
                          <p
                            className={`text-xs text-gray-600 break-words ${
                              isExpanded ? "" : "line-clamp-3"
                            }`}
                          >
                            {item.description}
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              if (isExpanded) {
                                toggleTrendingExpand(key);
                              } else {
                                navigate(`/trending/${item.id || item._id}`);
                              }
                            }}
                            className="mt-1 text-[11px] text-dark-green hover:underline"
                          >
                            {isExpanded ? "Show less" : "Read more"}
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() =>
                            navigate(`/trending/${item.id || item._id}`)
                          }
                          className="mt-2 text-[11px] text-dark-green hover:underline"
                        >
                          Read more
                        </button>
                      );
                    })()}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Logo Section */}
      {/* <div className="mb-4 sm:mb-6 text-center">
        <h2 className="text-lg sm:text-xl font-bold text-dark-green">
          Quick Access
        </h2>
        <p className="text-xs sm:text-sm text-gray-600">Navigate & Discover</p>
      </div> */}

      {/* Navigation (Categories) */}
      {/* <div className="mb-6 sm:mb-8">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
          <FaNewspaper className="text-dark-green" />
          Navigation
        </h3>
        {catLoading && (
          <div className="text-sm text-gray-500">Loading categories...</div>
        )}
        {catError && <div className="text-sm text-rose-600">{catError}</div>}
        {!catLoading && !catError && (
          <nav className="space-y-2 max-h-[50vh] lg:max-h-none overflow-auto lg:overflow-visible">
            <Link
              to="/"
              className="block px-3 py-2 text-sm text-gray-700 hover:text-dark-green hover:bg-green-50 rounded-lg transition-all duration-200"
            >
              Home
            </Link>
            <Link
              to="/epapers"
              className="block px-3 py-2 text-sm text-gray-700 hover:text-dark-green hover:bg-green-50 rounded-lg transition-all duration-200"
            >
              E-Papers
            </Link>

            {categories.map((cat, idx) => {
              const name = getCategoryName(cat);
              const routeName = normalize(name);
              if (!routeName) return null;
              return (
                <Link
                  key={cat.id || cat._id || name + idx}
                  to={`/${routeName}`}
                  className="block px-3 py-2 text-sm text-gray-700 capitalize hover:text-dark-green hover:bg-green-50 rounded-lg transition-all duration-200"
                >
                  {name}
                </Link>
              );
            })}

            {categories.length === 0 && (
              <div className="text-sm text-gray-500">
                No categories available
              </div>
            )}
          </nav>
        )}
      </div> */}

      {/* Weather Widget */}
      <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">
          Weather Update
        </h4>
        <div className="mb-2 relative">
          <input
            type="text"
            value={cityQuery}
            onChange={(e) => setCityQuery(e.target.value)}
            placeholder={
              selectedCity
                ? `Change city (current: ${selectedCity})`
                : "Search city"
            }
            className="w-full border border-blue-200 rounded-md px-2 py-2 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {suggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full max-h-56 overflow-auto bg-white border border-blue-200 rounded-md shadow">
              {suggestions.map((s, i) => (
                <button
                  key={`${s.name}-${s.lat}-${s.lon}-${i}`}
                  onClick={() => handlePickSuggestion(s)}
                  className="w-full text-left px-3 py-2 text-xs sm:text-sm hover:bg-blue-50"
                >
                  {s.name}
                  {s.state ? `, ${s.state}` : ""}
                  {s.country ? `, ${s.country}` : ""}
                </button>
              ))}
            </div>
          )}
        </div>
        {weatherLoading && (
          <div className="text-xs text-blue-700">Loading weather...</div>
        )}
        {weatherError && (
          <div className="text-xs text-rose-600">{weatherError}</div>
        )}
        {!weatherLoading && !weatherError && weatherData && (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              {weatherData.weather?.[0]?.icon ? (
                <img
                  alt="icon"
                  className="w-8 h-8"
                  src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                />
              ) : (
                <span className="text-2xl">🌤️</span>
              )}
              <div className="text-blue-800 text-sm sm:text-base font-semibold">
                {Math.round(weatherData.main?.temp)}°C
              </div>
            </div>
            <p className="text-xs sm:text-sm text-blue-700">{selectedCity}</p>
            <p className="text-[11px] sm:text-xs text-blue-600">
              {weatherData.weather?.[0]?.description || ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftSidebar;
