import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { NavLink, Link } from "react-router-dom";
import { 
  Menu, Cloud, Wind, Sun, CloudRain, CloudDrizzle, Moon, Loader2 
} from "lucide-react";
import { fetchWeather } from "@/services/api/weatherService";
import type { WeatherData } from '@/types';
import { useTheme } from "@/context/ThemeContext";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

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

  // Handle scroll effect for floating header
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  // Get appropriate weather icon with dark mode support
  const getWeatherIcon = () => {
    if (weatherLoading) return <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />;
    if (!weatherData || weatherData.temperature === 'N/A') return <Cloud className="h-5 w-5 text-muted-foreground" />;

    const condition = weatherData.description.toLowerCase();
    if (condition.includes("rain") || condition.includes("shower")) return <CloudRain className="h-5 w-5 text-blue-500" />;
    if (condition.includes("drizzle") || condition.includes("mist")) return <CloudDrizzle className="h-5 w-5 text-blue-400" />;
    if (condition.includes("cloud") || condition.includes("overcast")) return <Cloud className="h-5 w-5 text-muted-foreground" />;
    if (condition.includes("wind") || condition.includes("breeze")) return <Wind className="h-5 w-5 text-muted-foreground" />;
    if (condition.includes("clear") || condition.includes("sunny")) return <Sun className="h-5 w-5 text-yellow-500" />;
    return <Sun className="h-5 w-5 text-yellow-500" />;
  };

  // Get weather display values with dark mode support
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
  const isDarkMode = theme === 'dark';

  return (
    <>
      {/* HEADER - Fixed at top */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 flex h-20 items-center justify-between px-4 md:px-6 border-b transition-all duration-300 ${
          isScrolled 
            ? `shadow-lg backdrop-blur-md ${
                isDarkMode 
                  ? 'bg-[#151517]/90 border-[#2a2a2d]' 
                  : 'bg-white/90 border-gray-200'
              }`
            : `border-transparent ${
                isDarkMode 
                  ? 'bg-[#151517]' 
                  : 'bg-white'
              }`
        }`}
        style={{
          backgroundColor: isScrolled 
            ? isDarkMode 
              ? 'rgba(21, 21, 23, 0.9)' 
              : 'rgba(255, 255, 255, 0.9)'
            : isDarkMode 
              ? '#151517' 
              : '#ffffff',
          borderColor: isScrolled 
            ? (isDarkMode ? '#2a2a2d' : '#e5e7eb')
            : 'transparent'
        }}
      >
        <div className="flex items-center gap-4" ref={menuRef}>
          {/* MENU BUTTON */}
          <div className="relative">
            <Button 
              variant="default"
              className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200"
              onClick={() => setOpen(!open)}
            >
              <Menu className="h-6 w-6 mr-2" />
              MENU
            </Button>

            {/* DROPDOWN / SIDEBAR MENU */}
            {open && (
              <div
                className={`absolute left-[-25px] top-14 z-50 w-62 pl-[50px] rounded-lg shadow-lg p-4 transition-all duration-300 ease-in-out ${
                  isDarkMode 
                    ? 'bg-[#1e1e20] border border-[#2a2a2d]' 
                    : 'bg-white border border-gray-200'
                }`}
                style={{
                  backgroundColor: isDarkMode ? '#1e1e20' : '#ffffff',
                  borderColor: isDarkMode ? '#2a2a2d' : '#e5e7eb'
                }}
                onMouseLeave={() => setOpen(false)}
              >
                <nav className="flex flex-col space-y-2 text-base font-medium">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `hover:text-blue-600 transition ${
                        isActive 
                          ? "text-blue-600 font-bold px-3 py-1 rounded-md" + 
                            (isDarkMode ? " bg-blue-900/30" : " bg-blue-50") 
                          : isDarkMode ? "text-gray-300 hover:text-blue-400" : "text-gray-700 hover:text-blue-600"
                      }`
                    }
                    onClick={() => setOpen(false)}
                  >
                    HOME
                  </NavLink>

                  <NavLink
                    to="/business-lists"
                    className={({ isActive }) =>
                      `hover:text-blue-600 transition ${
                        isActive 
                          ? "text-blue-600 font-bold px-3 py-1 rounded-md" + 
                            (isDarkMode ? " bg-blue-900/30" : " bg-blue-50") 
                          : isDarkMode ? "text-gray-300 hover:text-blue-400" : "text-gray-700 hover:text-blue-600"
                      }`
                    }
                    onClick={() => setOpen(false)}
                  >
                    BUSINESS LISTS
                  </NavLink>

                  <NavLink
                    to="/business-form"
                    className={({ isActive }) =>
                      `hover:text-blue-600 transition ${
                        isActive 
                          ? "text-blue-600 font-bold px-3 py-1 rounded-md" + 
                            (isDarkMode ? " bg-blue-900/30" : " bg-blue-50") 
                          : isDarkMode ? "text-gray-300 hover:text-blue-400" : "text-gray-700 hover:text-blue-600"
                      }`
                    }
                    onClick={() => setOpen(false)}
                  >
                    BUSINESS REGISTER
                  </NavLink>

                  <NavLink
                    to="/maps"
                    className={({ isActive }) =>
                      `hover:text-blue-600 transition ${
                        isActive 
                          ? "text-blue-600 font-bold px-3 py-1 rounded-md" + 
                            (isDarkMode ? " bg-blue-900/30" : " bg-blue-50") 
                          : isDarkMode ? "text-gray-300 hover:text-blue-400" : "text-gray-700 hover:text-blue-600"
                      }`
                    }
                    onClick={() => setOpen(false)}
                  >
                    MAPS
                  </NavLink>

                  <NavLink
                    to="/satelite-map"
                    className={({ isActive }) =>
                      `hover:text-blue-600 transition ${
                        isActive 
                          ? "text-blue-600 font-bold px-3 py-1 rounded-md" + 
                            (isDarkMode ? " bg-blue-900/30" : " bg-blue-50") 
                          : isDarkMode ? "text-gray-300 hover:text-blue-400" : "text-gray-700 hover:text-blue-600"
                      }`
                    }
                    onClick={() => setOpen(false)}
                  >
                    SATELLITE IMAGES
                  </NavLink>

                  <NavLink
                    to="/media"
                    className={({ isActive }) =>
                      `hover:text-blue-600 transition ${
                        isActive 
                          ? "text-blue-600 font-bold px-3 py-1 rounded-md" + 
                            (isDarkMode ? " bg-blue-900/30" : " bg-blue-50") 
                          : isDarkMode ? "text-gray-300 hover:text-blue-400" : "text-gray-700 hover:text-blue-600"
                      }`
                    }
                    onClick={() => setOpen(false)}
                  >
                    GENERATE REPORT
                  </NavLink>
                </nav>
              </div>
            )}
          </div>

          {/* LOGO + TITLE */}
          <div className="hidden md:flex items-center gap-2">
            <img 
              src="/assets/logo.png" 
              alt="Leganes Logo" 
              className="h-12 transition-transform duration-300 hover:scale-105" 
            />
            <h1 className={`text-2xl font-bold transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              LGU Leganes
            </h1>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-4">
          {/* WEATHER DISPLAY */}
          <Link to="/dashboard-summary">
            {/* Desktop Weather Display */}
            <div 
              className={`hidden sm:flex items-center gap-3 px-4 py-2 rounded-lg border transition-all duration-300 hover:scale-105 ${
                isDarkMode 
                  ? 'bg-[#1e1e20] border-[#2a2a2d] hover:border-[#3a3a3d]' 
                  : 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 hover:border-blue-300'
              }`}
              style={{
                backgroundColor: isDarkMode ? '#1e1e20' : '',
                borderColor: isDarkMode ? '#2a2a2d' : ''
              }}
            >
              <div className="flex items-center gap-2">
                {getWeatherIcon()}
                <span className={`text-lg font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  {weatherDisplay.temperature}
                </span>
              </div>

              <div 
                className={`flex flex-col text-xs border-l pl-3 ${
                  isDarkMode 
                    ? 'text-gray-400 border-[#2a2a2d]' 
                    : 'text-gray-600 border-blue-200'
                }`}
              >
                <div className="flex items-center gap-1">
                  <Cloud className={`h-3 w-3 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`} />
                  <span className="capitalize">{weatherDisplay.condition}</span>
                </div>
                {weatherData?.city && (
                  <div className={`text-xs ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    {weatherData.city}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Weather Display */}
            <div 
              className={`flex sm:hidden items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-300 hover:scale-105 ${
                isDarkMode 
                  ? 'bg-[#1e1e20] border-[#2a2a2d] hover:border-[#3a3a3d]' 
                  : 'bg-blue-50 border-blue-200 hover:border-blue-300'
              }`}
              style={{
                backgroundColor: isDarkMode ? '#1e1e20' : '',
                borderColor: isDarkMode ? '#2a2a2d' : ''
              }}
            >
              {getWeatherIcon()}
              <span className={`text-sm font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                {weatherDisplay.temperature}
              </span>
            </div>
          </Link>

          {/* DARK/LIGHT TOGGLE */}
          <button
            onClick={toggleTheme}
            className={`relative w-14 h-8 rounded-full transition-all duration-300 flex items-center border-2 hover:scale-105 ${
              isDarkMode 
                ? 'bg-[#2a2a2d] border-[#3a3a3d]' 
                : 'bg-gray-200 border-gray-300'
            }`}
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          >
            <span
              className={`absolute left-1 top-1 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
                isDarkMode 
                  ? 'translate-x-6 bg-[#151517]' 
                  : 'translate-x-0 bg-white'
              }`}
            >
              {isDarkMode ? (
                <Moon className="h-4 w-4 text-gray-300" />
              ) : (
                <Sun className="h-4 w-4 text-yellow-500" />
              )}
            </span>
          </button>
        </div>
      </header>

      {/* SPACER DIV - Para hindi ma-overlap ang content */}
      <div className="h-20 w-full"></div>
    </>
  );
};

export default Header;