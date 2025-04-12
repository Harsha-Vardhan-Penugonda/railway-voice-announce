
import { Bell, Train } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-railway-blue text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Train size={28} className="text-railway-yellow" />
          <h1 className="text-2xl font-bold">Railway Announcement System</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Bell size={20} />
          <span className="font-medium">Admin Dashboard</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
