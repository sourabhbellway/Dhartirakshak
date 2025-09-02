import React, { useState } from "react";
import Welcome from "../components/Welcome";
import Headline from "../components/Headline";
import Background from "../components/Background";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";

const Home = () => {
  const [showWelcome, setShowWelcome] = useState(true);

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

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  if (showWelcome) {
    return <Welcome onComplete={handleWelcomeComplete} />;
  }

  return (
    <div className="bg-olive h-[500vh] w-screen">
      <Background />
      <Headline headline={headlines} />
      <Navbar />
      <Banner />
    </div>
  );
};

export default Home;
