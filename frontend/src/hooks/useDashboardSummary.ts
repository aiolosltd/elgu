// src/hooks/useDashboardSummary.ts
import { useState, useEffect } from 'react';
import { fetchWeather } from '@/services/api/weatherService';
import { fetchNews } from '@/services/api/newsService';
import { fetchOpenAIResponse } from '@/services/api/openaiService';
import { formatTimestamp } from '@/lib/formatters';
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
    let isMounted = true;

    (async () => {
      setLoading(true);
      try {
        // Set immediate fallback data
        if (isMounted) {
          setTimestamp(formatTimestamp());
          setSystemInfo([
            '3 businesses have expiring DTI permits.',
            '2 branches have unverified documents.',
          ]);
          setGreeting(getFallbackGreeting()); // Set fallback immediately
        }

        // Try AI greeting with timeout
        try {
          const aiGreeting = await Promise.race([
            fetchOpenAIResponse(
              "Generate a short friendly greeting like 'Good Morning! Here's your daily update.'",
              40
            ),
            new Promise<string>((resolve) => 
              setTimeout(() => resolve(getFallbackGreeting()), 5000)
            )
          ]);
          
          if (isMounted && aiGreeting && !aiGreeting.includes('Error')) {
            setGreeting(aiGreeting);
          }
        } catch (aiError) {
          console.warn('AI greeting failed:', aiError);
          // Keep the fallback greeting that was already set
        }

        // Fetch weather and news in parallel
        const [weatherResult, newsResult] = await Promise.allSettled([
          fetchWeather('Leganes,PH'),
          fetchNews('Leganes Iloilo')
        ]);

        if (isMounted) {
          // Handle weather data
          if (weatherResult.status === 'fulfilled' && weatherResult.value) {
            const weatherData = weatherResult.value;
            setWeather(weatherData);
            
            // Generate weather greeting
            try {
              const weatherGreetingText = await generateWeatherGreeting(weatherData);
              setWeatherGreeting(weatherGreetingText);
            } catch (greetingError) {
              console.warn('Weather greeting generation failed:', greetingError);
              setWeatherGreeting(`Current weather: ${weatherData.description}`);
            }
          }

          // Handle news data
          if (newsResult.status === 'fulfilled' && newsResult.value) {
            setNews(newsResult.value);
          }
        }

      } catch (err) {
        console.error('Dashboard initialization error:', err);
        if (isMounted) {
          setGreeting(getFallbackGreeting());
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return { 
    loading, 
    greeting, 
    timestamp, 
    weather, 
    weatherGreeting, 
    systemInfo, 
    news 
  };
}