import React from "react";
import { Outlet } from "react-router-dom";
import Background from "../components/Background";
import Headline from "../components/Headline";
import Banner from "../components/Banner";
import BreakingNews from "../components/BreakingNews";
import Navbar from "../components/Navbar";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";

const MainLayout = () => {
  const headlines = [
    {
      headline:
        "🌾 मध्य प्रदेश में हुई 'मुख्यमंत्री कृषक मित्र योजना' लॉन्च, सीएम बोले- किसानों के सुख-दुख की चिंता करना हमारा धर्म एवं हितग्राही महिला किसान का खुद भरा फॉर्म",
    },
    {
      headline: "🚜 किसानों के लिए नई योजनाएं, सरकार की ओर से बड़ी सौगात",
    },
    {
      headline: "🌱 खेती के लिए बिजली देने नए ट्रांसफॉर्मर लगाए जाएंगे : सीएम",
    },
  ];

  return (
    <div className="bg-olive min-h-screen scroll-smooth">
      <ScrollToTop />
      <Background />
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <Banner />
      <div className="sticky top-16 z-40">
        <Headline headline={headlines} />
      </div>

      <div className="relative">
        <div className="mx-auto px-3 sm:px-4 lg:px-8">
          {/* Desktop / Large Screens */}
          <div className="hidden lg:grid grid-cols-4 ">
            <div className="lg:col-span-1">
              <div className="sticky top-24 z-10">
                <LeftSidebar />
              </div>
            </div>

            <div className="lg:col-span-2 min-w-0  ">
              <BreakingNews  />

              <Outlet />
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 z-10">
                <RightSidebar />
              </div>
            </div>
          </div>

          {/* Mobile / Tablet */}
          <div className="lg:hidden flex flex-col gap-4">
            <div className="order-1">
              <Outlet />
            </div>
            <div className="order-2">
              <LeftSidebar />
            </div>
            <div className="order-3">
              <RightSidebar />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
