
import React from 'react';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 shadow-md p-4 flex items-center">
        <ShieldCheckIcon className="h-8 w-8 text-teal-500 mr-3" />
        <h1 className="text-xl md:text-2xl font-bold text-white">
            Personal Security Dashboard
        </h1>
    </header>
  );
};

export default Header;
