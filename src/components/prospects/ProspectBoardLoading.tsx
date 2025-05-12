
import React from 'react';

const ProspectBoardLoading: React.FC = () => {
  return (
    <div className="card p-8 text-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-t-blue-500 border-b-blue-700 border-l-blue-500 border-r-blue-700 rounded-full animate-spin"></div>
        <p className="text-lg font-medium">Loading prospects...</p>
      </div>
    </div>
  );
};

export default ProspectBoardLoading;
