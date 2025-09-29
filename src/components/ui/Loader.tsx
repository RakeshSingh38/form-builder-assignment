import React from 'react';

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="flex items-center justify-center">
        <div className="loader-dot mr-2.5" style={{ animationDelay: '-0.3s' }} />
        <div className="loader-dot mr-2.5" style={{ animationDelay: '-0.1s' }} />
        <div className="loader-dot mr-2.5" style={{ animationDelay: '0.1s' }} />
        <div className="loader-dot mr-2.5" style={{ animationDelay: '0.3s' }} />
        <div className="loader-dot" style={{ animationDelay: '0.5s' }} />
      </div>
    </div>
  );
};

export default Loader;
