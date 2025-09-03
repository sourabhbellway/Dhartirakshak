import React, { useState } from "react";
import Welcome from "../components/Welcome";
import NewsFeed from "../components/NewsFeed";

const Home = () => {
  const [showWelcome, setShowWelcome] = useState(true);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  if (showWelcome) {
    return <Welcome onComplete={handleWelcomeComplete} />;
  }

  return (
    <div className="min-h-screen">
      <NewsFeed />
    </div>
  );
};

export default Home;
