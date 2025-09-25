import React, { useEffect, useState, useRef } from "react";
import { BASE_URL } from "../config.js";
import axios from "axios";

const AUTO_PLAY_MS = 4000;

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/banners`);
        const items = Array.isArray(res?.data?.data) ? res.data.data : [];
        
        
        setBanners(items);
        setActiveIndex(0);
      } catch (err) {
        console.error("Failed to load banners", err);
        setBanners([]);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return; // no auto-play if 0/1 banners
    if (isHovering) return; // pause on hover
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % banners.length);
    }, AUTO_PLAY_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [banners.length, isHovering]);

  const goTo = (index) => {
    if (!banners.length) return;
    const next = ((index % banners.length) + banners.length) % banners.length;
    setActiveIndex(next);
  };

  if (!banners.length) {
    return null;
  }

  return (
    <div
      className="relative w-full overflow-hidden z-10 "
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {banners.map((item) => (
          <div key={item.id} className="min-w-full">
            <div className="w-full max-w-7xl mx-auto">
              <img
                src={item.image}
                alt={item.title || 'banner'}
                // className="w-full h-[200px] sm:h-[120px] md:h-[160px] lg:h-[200px] object-cover"
                className="w-full h-[60vh] object-cover"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, idx) => (
          <button
            key={idx}
            aria-label={`Go to slide ${idx + 1}`}
            onClick={() => goTo(idx)}
            className={`h-2.5 w-2.5 rounded-full transition-all ${
              idx === activeIndex ? 'bg-white/90 w-6' : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
