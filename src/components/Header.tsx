
import { Bell, Train, Megaphone } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-railway-blue to-blue-700 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-white p-1.5 rounded-full">
            <Train size={28} className="text-railway-blue" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">भारतीय रेल</h1>
            <p className="text-sm font-medium text-railway-yellow">Railway Announcement System</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center bg-blue-800 bg-opacity-50 px-3 py-2 rounded-lg">
            <Megaphone size={18} className="mr-2 text-railway-yellow" />
            <span className="font-medium">प्लेटफॉर्म अनाउंसमेंट</span>
          </div>
          <div className="flex items-center space-x-2 bg-blue-800 px-3 py-2 rounded-lg">
            <Bell size={20} className="text-railway-yellow animate-pulse-slow" />
            <span className="font-medium">Station Master</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
