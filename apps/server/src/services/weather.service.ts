import axios from 'axios';

const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

interface GetCurrentWeatherInput {
  latitude: number;
  longitude: number;
}

export async function getCurrentWeather({
  latitude,
  longitude,
}: GetCurrentWeatherInput): Promise<any> {
  const url = `${WEATHER_API_URL}?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
  const response = await axios.get(url);
  return response.data.current_weather;
}
