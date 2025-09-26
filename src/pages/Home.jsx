import React, { useState } from "react";
import Welcome from "../components/Welcome";
import NewsFeed from "../components/NewsFeed";
import Banner from "../components/Banner";
import BreakingNews from "../components/BreakingNews";
const Home = () => {
  const [showWelcome, setShowWelcome] = useState(true);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  if (showWelcome) {
    return <Welcome onComplete={handleWelcomeComplete} />;
  }

  return (
    <div className="min-h-screen ">
      <BreakingNews />

      <NewsFeed />
    </div>
  );
};

export default Home;
