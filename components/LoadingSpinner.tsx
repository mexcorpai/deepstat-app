import React from 'react';

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center space-y-4 py-16">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-sky-400"></div>
    <p className="text-white text-lg font-semibold">Analyzing data, please wait...</p>
  </div>
);

export default LoadingSpinner;
