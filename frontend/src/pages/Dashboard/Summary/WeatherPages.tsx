import { Typography } from '@/components/atoms/typography';
import { useDashboardSummary } from '@/hooks/useDashboardSummary';

const DashboardSummary = () => {
  const { loading, greeting, timestamp, weather, weatherGreeting, systemInfo, news } =
    useDashboardSummary();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <Typography as="p" className="mt-4 text-gray-600">
            Loading dashboard summary...
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Typography variant="h2" weight="bold" className="text-gray-900">
            {greeting}
          </Typography>
          <Typography as="p" className="text-gray-600 mt-2">
            {timestamp}
          </Typography>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weather */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <Typography variant="h4" weight="bold" className="text-gray-800 mb-2">
              ☁️ Weather Update
            </Typography>
            {weather ? (
              <>
                <Typography variant="large" weight="semibold">
                  {weather.city}
                </Typography>
                <Typography variant="h2" weight="bold">
                  {weather.temperature}
                </Typography>
                <Typography as="p" className="text-gray-600 capitalize mt-2">
                  {weatherGreeting}
                </Typography>
              </>
            ) : (
              <Typography as="p">Weather data unavailable</Typography>
            )}
          </div>

          {/* System Info */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <Typography variant="lead" weight="semibold" className="mb-2">
              📋 System Information
            </Typography>
            {systemInfo.length ? (
              <ul className="space-y-2">
                {systemInfo.map((info, i) => (
                  <li key={i} className="text-gray-700">
                    • {info}
                  </li>
                ))}
              </ul>
            ) : (
              <Typography>No system information available</Typography>
            )}
          </div>

          {/* News */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <Typography variant="lead" weight="semibold" className="mb-2">
              📰 Local News
            </Typography>
            {news.length ? (
              <ul className="space-y-2">
                {news.map((item, i) => (
                  <li key={i}>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <Typography>No news available</Typography>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;
