
// Weather Data Interface
export interface WeatherData {
  city: string;
  temperature: string;
  description: string;
  fullDescription?: string;
}

export interface NewsItem {
  title: string;
  link: string;
}

// Lookup Options Interface
export interface LookupOptions {
  [key: string]: string[];
}
