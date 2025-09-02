import React from "react";

const Headline = ({ headline }) => {
  return (
    <div className="fixed top-0 w-full bg-dark-green p-1 text-center text-olive overflow-hidden z-50">
      <div className="animate-scroll whitespace-nowrap">
        {headline.map((item, index) => (
          <span key={index} className="mr-20 text-xs">
            {item.headline}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Headline;
