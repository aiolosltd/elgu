import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/atoms/button";
import { NavLink, Link } from "react-router-dom";
import { 
  Menu, Cloud, Wind, Sun, CloudRain, CloudDrizzle, Moon, Loader2 
} from "lucide-react";
import { fetchWeather } from "@/services/api/weatherService";
import type { WeatherData } from '@/types';

const Header = () => {
  const [open, setOpen] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch real weather data
  useEffect(() => {
    const getWeatherData = async () => {
      try {
        setWeatherLoading(true);
        const data = await fetchWeather("Leganes,PH");
        setWeatherData(data);
      } catch (error) {
        console.error('Failed to fetch weather data:', error);
        setWeatherData({
          city: "Leganes",
          temperature: "N/A",
          description: "Weather unavailable",
          fullDescription: "Unable to fetch weather data"
        });
      } finally {
        setWeatherLoading(false);
      }
    };

    getWeatherData();
    const interval = setInterval(getWeatherData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Get appropriate weather icon
  const getWeatherIcon = () => {
    if (weatherLoading) return <Loader2 className="h-5 w-5 text-gray-500 animate-spin" />;
    if (!weatherData || weatherData.temperature === 'N/A') return <Cloud className="h-5 w-5 text-gray-500" />;

    const condition = weatherData.description.toLowerCase();
    if (condition.includes("rain") || condition.includes("shower")) return <CloudRain className="h-5 w-5 text-blue-500" />;
    if (condition.includes("drizzle") || condition.includes("mist")) return <CloudDrizzle className="h-5 w-5 text-blue-400" />;
    if (condition.includes("cloud") || condition.includes("overcast")) return <Cloud className="h-5 w-5 text-gray-500" />;
    if (condition.includes("wind") || condition.includes("breeze")) return <Wind className="h-5 w-5 text-gray-600" />;
    if (condition.includes("clear") || condition.includes("sunny")) return <Sun className="h-5 w-5 text-yellow-500" />;
    return <Sun className="h-5 w-5 text-yellow-500" />;
  };

  // Get weather display values
  const getWeatherDisplay = () => {
    if (weatherLoading) {
      return { temperature: "Loading...", condition: "Loading weather...", windSpeed: "--" };
    }
    if (!weatherData || weatherData.temperature === 'N/A') {
      return { temperature: "N/A", condition: "Unavailable", windSpeed: "--" };
    }
    return { temperature: weatherData.temperature, condition: weatherData.description, windSpeed: "12" };
  };

  const weatherDisplay = getWeatherDisplay();

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  return (
    <header className="flex h-20 items-center justify-between px-4 md:px-6 bg-white border-b-2 relative">
      <div className="flex items-center gap-4" ref={menuRef}>
        {/* MENU BUTTON */}
        <div className="relative">
          <Button 
            variant="destructive"
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={() => setOpen(!open)}
          >
            <Menu className="h-6 w-6 mr-2" />
            MENU
          </Button>

          {/* DROPDOWN / SIDEBAR MENU */}
          {open && (
            <div
              className="absolute left-[-25px] top-14 z-50 w-62 bg-white pl-[50px] border-gray-200 rounded-lg shadow-lg p-4 transition-all duration-300 ease-in-out"
              onMouseLeave={() => setOpen(false)}
            >
              <nav className="flex flex-col space-y-2 text-base font-medium text-gray-700">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `hover:text-red-600 transition ${
                      isActive ? "text-red-600 font-bold bg-red-50 px-3 py-1 rounded-md" : ""
                    }`
                  }
                >
                  HOME
                </NavLink>

                <NavLink
                  to="/business-lists"
                  className={({ isActive }) =>
                    `hover:text-red-600 transition ${
                      isActive ? "text-red-600 font-bold bg-red-50 px-3 py-1 rounded-md" : ""
                    }`
                  }
                >
                  BUSINESS LISTS
                </NavLink>

                <NavLink
                  to="/business-form"
                  className={({ isActive }) =>
                    `hover:text-red-600 transition ${
                      isActive ? "text-red-600 font-bold bg-red-50 px-3 py-1 rounded-md" : ""
                    }`
                  }
                >
                  BUSINESS REGISTER
                </NavLink>

                <NavLink
                  to="/maps"
                  className={({ isActive }) =>
                    `hover:text-red-600 transition ${
                      isActive ? "text-red-600 font-bold bg-red-50 px-3 py-1 rounded-md" : ""
                    }`
                  }
                >
                  MAPS
                </NavLink>

                <NavLink
                  to="/satelite-map"
                  className={({ isActive }) =>
                    `hover:text-red-600 transition ${
                      isActive ? "text-red-600 font-bold bg-red-50 px-3 py-1 rounded-md" : ""
                    }`
                  }
                >
                  SATELLITE IMAGES
                </NavLink>

                <NavLink
                  to="/media"
                  className={({ isActive }) =>
                    `hover:text-red-600 transition ${
                      isActive ? "text-red-600 font-bold bg-red-50 px-3 py-1 rounded-md" : ""
                    }`
                  }
                >
                  GENERATE REPORT
                </NavLink>
              </nav>
            </div>
          )}
        </div>

        {/* LOGO + TITLE */}
        <div className="hidden md:flex items-center gap-2">
          <img src="/assets/logo.png" alt="Leganes Logo" className="h-12" />
          <h1 className="text-2xl font-bold text-gray-700">LGU Leganes</h1>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-4">
        {/* WEATHER DISPLAY */}
        <Link to="/dashboard-summary">
          {/* Desktop Weather Display */}
          <div className="hidden sm:flex items-center gap-3 bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-2 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              {getWeatherIcon()}
              <span className="text-lg font-bold text-gray-800">
                {weatherDisplay.temperature}
              </span>
            </div>

            <div className="flex flex-col text-xs text-gray-600 border-l border-blue-200 pl-3">
              <div className="flex items-center gap-1">
                <Cloud className="h-3 w-3" />
                <span className="capitalize">{weatherDisplay.condition}</span>
              </div>
              {weatherData?.city && (
                <div className="text-xs text-gray-500">{weatherData.city}</div>
              )}
            </div>
          </div>

          {/* Mobile Weather Display */}
          <div className="flex sm:hidden items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
            {getWeatherIcon()}
            <span className="text-sm font-semibold text-gray-800">
              {weatherDisplay.temperature}
            </span>
          </div>
        </Link>

        {/* DARK/LIGHT TOGGLE */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`relative w-14 h-8 rounded-full transition-colors duration-300 flex items-center ${
            darkMode ? "bg-gray-700" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute left-1 top-1 w-6 h-6 rounded-full bg-white flex items-center justify-center transition-all duration-300 ${
              darkMode ? "translate-x-6" : "translate-x-0"
            }`}
          >
            {darkMode ? (
              <Moon className="h-4 w-4 text-gray-800" />
            ) : (
              <Sun className="h-4 w-4 text-yellow-500" />
            )}
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;
