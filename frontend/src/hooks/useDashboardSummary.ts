// src/hooks/useDashboardSummary.ts
import { useState, useEffect } from 'react';
import { fetchWeather } from '@/services/api/weatherService';
import { fetchNews } from '@/services/api/newsService';
import { fetchOpenAIResponse } from '@/services/api/openaiService';
import { formatTimestamp } from '@/components/molecules/helpers/formatters';
import { getFallbackGreeting, generateWeatherGreeting } from '@/components/molecules/helpers/greetings';
import type { WeatherData } from '@/types/index';
import type { NewsItem } from '@/services/api/newsService';

export function useDashboardSummary() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherGreeting, setWeatherGreeting] = useState('');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [greeting, setGreeting] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [loading, setLoading] = useState(true);
  const [systemInfo, setSystemInfo] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        setTimestamp(formatTimestamp());
        setSystemInfo([
          '3 businesses have expiring DTI permits.',
          '2 branches have unverified documents.',
        ]);

        const aiGreeting = await fetchOpenAIResponse(
          "Generate a short friendly greeting like 'Good Morning! Here's your daily update.'",
          40
        );
        setGreeting(aiGreeting || getFallbackGreeting());

        const w = await fetchWeather('Leganes,PH');
        setWeather(w);
        setWeatherGreeting(await generateWeatherGreeting(w));

        setNews(await fetchNews('Leganes Iloilo'));
      } catch (err) {
        console.error(err);
        setGreeting(getFallbackGreeting());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { loading, greeting, timestamp, weather, weatherGreeting, systemInfo, news };
}
