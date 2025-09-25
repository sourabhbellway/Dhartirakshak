import React from "react";

const Headline = ({ headline }) => {
  return (
    <div className="w-full bg-dark-green p-1 text-center text-olive overflow-hidden group">
      <div className="animate-scroll whitespace-nowrap inline-block">
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
