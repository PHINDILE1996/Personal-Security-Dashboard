
import React from 'react';

interface DashboardCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, icon, children }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden h-full flex flex-col">
      <div className="p-4 bg-gray-700/50 flex items-center border-b border-gray-700">
        <div className="mr-3 text-teal-500">{icon}</div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      <div className="p-4 flex-grow">
        {children}
      </div>
    </div>
  );
};

export default DashboardCard;
