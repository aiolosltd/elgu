import type { WeatherData } from '@/types/index';
import { fetchOpenAIResponse } from '@/services/api/openaiService';

export function getFallbackGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning! Here's your daily update.";
  if (hour < 18) return "Good Afternoon! Here's your daily update.";
  return "Good Evening! Here's your daily update.";
}

export async function generateWeatherGreeting(weather: WeatherData): Promise<string> {
  if (weather.temperature === 'N/A') return 'Weather info unavailable.';
  
  const prompt = `Create a friendly, concise weather greeting (1-2 sentences) for ${weather.city}:
- Temperature: ${weather.temperature}
- Conditions: ${weather.description}
- Make it warm and natural
- Don't mention you're an AI`;

  try {
    return await fetchOpenAIResponse(prompt, 80);
  } catch (error) {
    console.error('Failed to generate weather greeting:', error);
    return `Current weather in ${weather.city}: ${weather.temperature} and ${weather.description}.`;
  }
}
