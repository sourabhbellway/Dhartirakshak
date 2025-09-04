import React from 'react'
import { Outlet } from 'react-router-dom'
import Background from '../components/Background'
import Headline from '../components/Headline'
import Banner from '../components/Banner'
import Navbar from '../components/Navbar'
import LeftSidebar from '../components/LeftSidebar'
import RightSidebar from '../components/RightSidebar'

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
  ]

  return (
    <div className="bg-olive min-h-screen w-screen">
      <Background />
      <Headline headline={headlines} />
      <Banner />
      <Navbar />

      <div className="">
        <div className=" mx-auto px-3 sm:px-4 lg:px-8">
          {/* Desktop / Large Screens */}
          <div className="hidden lg:grid grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <div className="sticky top-32">
                <LeftSidebar />
              </div>
            </div>

            <div className="lg:col-span-2 min-w-0 mt-8">
              <Outlet />
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-32">
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
    </div>
  )
}

export default MainLayout
