import React, { useEffect, useMemo, useState } from "react";
import newsPublicController from "../controllers/newsPublicController";

const BreakingNews = () => {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  useEffect(() => {
    let isMounted = true;
    async function fetchTrending() {
      try {
        setStatus("loading");
        const res = await newsPublicController.listTrending();
        if (!isMounted) return;
        // Normalize to array of strings or titles
        const normalized = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
          ? res.data
          : [];
        const titles = normalized
          .map((n) => n?.description || n?.headline || n?.name || n?.text)
          .filter(Boolean);
        setItems(titles);
        setStatus("success");
      } catch {
        if (!isMounted) return;
        setStatus("error");
      }
    }
    fetchTrending();
    return () => {
      isMounted = false;
    };
  }, []);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (items.length === 0 || paused) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 4000);
    return () => clearInterval(id);
  }, [items.length, paused]);

  const content = useMemo(() => {
    if (status === "loading") {
      return (
        <div className="text-xs opacity-80">Breaking news loading…</div>
      );
    }
    if (status === "error") {
      return (
        <div className="text-xs opacity-80">Unable to load breaking news.</div>
      );
    }
    if (items.length === 0) {
      return (
        <div className="text-xs opacity-80">No breaking news right now.</div>
      );
    }
    return items[index];
  }, [status, items, index]);

  return (
    <div className="w-full bg-red-600 text-white overflow-hidden">
      <div className="flex items-stretch gap-3 px-3 py-2 italic"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* <span className="self-start inline-flex items-center gap-1 text-[10px] md:text-xs font-semibold bg-white text-red-600 px-2 py-0.5  mt-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
          BREAKING NEWS
        </span> */}
        <span><img src="https://png.pngtree.com/png-vector/20201027/ourmid/pngtree-breaking-news-banner-lower-png-image_2378724.jpg" className="h-50" alt="" /></span>

        <div className="relative flex-1 overflow-hidden">
          <BreakingSlide item={content} />
        </div>
      </div>
    </div>
  );
};

export default BreakingNews;

const Media = ({ image, video, alt }) => {
  if (video && image) {
    return (
      <div className="flex items-center gap-2">
        <video src={video} className="w-16 h-10 object-cover rounded border" muted playsInline loop />
        <img src={image} alt={alt || "news"} className="w-16 h-10 object-cover rounded border" />
      </div>
    );
  }
  if (video) {
    return <video src={video} className="w-24 h-14 object-cover rounded border" muted playsInline loop />;
  }
  if (image) {
    return <img src={image} alt={alt || "news"} className="w-24 h-14 object-cover rounded border" />;
  }
  return null;
};

const BreakingSlide = ({ item }) => {
  // Accept either string or object with fields
  const title = typeof item === "string" ? item : item?.title || item?.headline || item?.name || item?.text;
  const image = typeof item === "object" ? (item?.image || item?.thumbnail || item?.photo) : undefined;
  const video = typeof item === "object" ? (item?.video || item?.videoUrl || item?.video_url) : undefined;
  return (
    <div className="breaking-slider-enter">
      <div className="bg-green-700/20 rounded-md breaking-card-shadow border border-red-700/20">
        <div className="flex items-center gap-3 p-2  ">
          <Media image={image} video={video} alt={title} />
          <div className="min-w-0">
            <div className="text-xs md:text-sm font-semibold leading-snug line-clamp-5">{title}</div>
            <div className="mt-0.5 text-[10px] md:text-xs opacity-80">Breaking • Swipe/Watch</div>
          </div>
        </div>
      </div>
    </div>
  );
};


