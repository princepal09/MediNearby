import { Hospital, Navigation, Phone, Mail } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white shadow-inner relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>

      <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center relative z-10">
        
        {/* Left: Brand */}
        <div className="flex items-center space-x-3 mb-6 md:mb-0">
          <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
            <Hospital className="w-6 h-6 text-white" />
          </div>
          <span className="font-extrabold text-2xl tracking-wide">MediNearby</span>
        </div>

        {/* Center: Info */}
        <div className="flex flex-col md:flex-row items-center text-sm text-gray-200 space-y-2 md:space-y-0 md:space-x-6">
          <span className="text-gray-300">© {new Date().getFullYear()} MediNearby</span>
          <span className="hidden md:inline-block text-gray-400">|</span>
          <span className="hover:text-yellow-300 cursor-pointer transition-colors">
            Privacy Policy
          </span>
          <span className="hidden md:inline-block text-gray-400">|</span>
          <span className="hover:text-yellow-300 cursor-pointer transition-colors">
            Terms of Service
          </span>
        </div>

        {/* Right: Buttons */}
        <div className="flex items-center space-x-6 mt-6 md:mt-0">
          <button className="flex items-center space-x-2 hover:text-yellow-300 transition-colors">
            <Navigation className="w-5 h-5" />
            <span className="text-sm font-medium">Directions</span>
          </button>
          <button className="flex items-center space-x-2 hover:text-yellow-300 transition-colors">
            <Phone className="w-5 h-5" />
            <span className="text-sm font-medium">Contact</span>
          </button>
          <button className="flex items-center space-x-2 hover:text-yellow-300 transition-colors">
            <Mail className="w-5 h-5" />
            <span className="text-sm font-medium">Email</span>
          </button>
        </div>
      </div>

      {/* Bottom Accent Bar */}
      <div className="h-[3px] bg-gradient-to-r from-yellow-400 via-pink-400 to-blue-400 w-full"></div>
    </footer>
  );
}

export default Footer;
