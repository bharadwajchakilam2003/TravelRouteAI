import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container-wide py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold text-xs">TR</div>
              <span className="text-lg font-bold text-white">TravelRoute AI</span>
            </div>
            <p className="text-gray-400 text-sm max-w-md">
              Smart travel route planner helping you discover attractions, weather forecasts, and cost estimates between any two destinations.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-blue-400 transition-colors cursor-pointer">About Us</span></li>
              <li><span className="hover:text-blue-400 transition-colors cursor-pointer">Contact</span></li>
              <li><span className="hover:text-blue-400 transition-colors cursor-pointer">Privacy Policy</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} TravelRoute AI. All rights reserved.</p>
          <p className="mt-1 text-sm font-bold text-gray-400">Developed by Bharadwaj</p>
        </div>
      </div>
    </footer>
  );
}
