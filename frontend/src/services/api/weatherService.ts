import type { WeatherData } from '@/types/index';
export async function fetchWeather(location: string): Promise<WeatherData> {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

  if (!apiKey) {
    console.warn('OpenWeather API key is missing');
    return {
      city: location.split(',')[0],
      temperature: 'N/A',
      description: 'Weather data unavailable',
      fullDescription: 'Please check your API configuration.',
    };
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      location
    )}&appid=${apiKey}&units=metric`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Weather API error: ${res.status}`);

    const data = await res.json();

    return {
      city: data.name,
      temperature: `${Math.round(data.main.temp)}°C`,
      description: data.weather[0].description,
      fullDescription: `The current weather in ${data.name} is ${data.weather[0].description} with a temperature of ${Math.round(data.main.temp)}°C.`,
    };
  } catch (error) {
    console.error('Weather API error:', error);
    return {
      city: location.split(',')[0],
      temperature: 'N/A',
      description: 'Failed to load weather data',
    };
  }
}