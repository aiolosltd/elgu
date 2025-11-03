import { Typography } from '@/components/atoms/typography';
import { useDashboardSummary } from '@/hooks/useDashboardSummary';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const DashboardSummary = () => {
  const { loading, greeting, timestamp, weather, weatherGreeting, systemInfo, news } =
    useDashboardSummary();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center  p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <Typography as="p" className="mt-4 text-muted-foreground">
            Loading dashboard summary...
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <Typography variant="h2" weight="bold" className="text-foreground">
            {greeting}
          </Typography>
          <Typography as="p" className="text-muted-foreground mt-2">
            {timestamp}
          </Typography>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weather Card */}
          <Card className="bg-card border-border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <span className="text-2xl">☁️</span>
                Weather Update
              </CardTitle>
            </CardHeader>
            <CardContent>
              {weather ? (
                <div className="space-y-3">
                  <Typography variant="large" weight="semibold" className="text-card-foreground">
                    {weather.city}
                  </Typography>
                  <Typography variant="h2" weight="bold" className="text-primary">
                    {weather.temperature}
                  </Typography>
                  <Typography as="p" className="text-muted-foreground capitalize">
                    {weatherGreeting}
                  </Typography>
                </div>
              ) : (
                <Typography as="p" className="text-muted-foreground">
                  Weather data unavailable
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* System Info Card */}
          <Card className="bg-card border-border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <span className="text-2xl">📋</span>
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {systemInfo.length ? (
                <ul className="space-y-2">
                  {systemInfo.map((info, i) => (
                    <li key={i} className="text-card-foreground flex items-start gap-2">
                      <span className="text-muted-foreground mt-1">•</span>
                      <span>{info}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography as="p" className="text-muted-foreground">
                  No system information available
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* News Card - Full Width */}
          <Card className="lg:col-span-2 bg-card border-border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <span className="text-2xl">📰</span>
                Local News
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Latest updates from Leganes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {news.length ? (
                <ul className="space-y-3">
                  {news.map((item, i) => (
                    <li key={i} className="border-b border-border last:border-b-0 pb-3 last:pb-0">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 hover:underline transition-colors duration-200 block py-1"
                      >
                        <Typography variant="p" className="font-medium">
                          {item.title}
                        </Typography>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography as="p" className="text-muted-foreground">
                  No news available at the moment
                </Typography>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;