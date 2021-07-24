import { WEATHER_API_KEY } from './config';
import { AUTOCOMPLETE_API_KEY } from './config';
import { timeout } from './helpers.js';
import { TIMEOUT_TIME } from './config.js';

export const applicationData = {};

export const generateCurrentLocation = async function(lat, lon) {
  try {
    const res = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&lang=de&limit=10&apiKey=${AUTOCOMPLETE_API_KEY}`);

    const data = await res.json();
  
    return data.features[0].properties.city;
  } catch(err) {
    throw err;
  }

}

export const loadWeatherData = async function (lat, lon) {
  try {
    const res = await Promise.race([
      fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${WEATHER_API_KEY}`
      ),
      timeout(TIMEOUT_TIME),
    ]);
    const data = await res.json();
    if (data.cod === 401) throw new Error('Problem z załadowaniem danych!');
    createCurrentWeatherData(data);
    createDailyWeatherData(data);
    createHourlyWeather(data.hourly.slice(0, 16));
  } catch (err) {
    throw err;
  }
};

const createCurrentWeatherData = function (data) {
  return (applicationData.curWeather = {
    icon: data.current.weather[0].icon,
    curDay: convertToDate(data.current.dt),
    curTemp: convertToCelsius(data.current.temp),
    curRain: data.daily[0].rain ? data.daily[0].rain.toFixed(1) : 0,
    curWind: data.current.wind_speed ? data.current.wind_speed.toFixed(1) : 0,
    curHumidity: data.current.humidity,
  });
};

const createHourlyWeather = function (data) {
  return applicationData.hourlyWeather = data.map(hour => ({

    h: (new Date(hour.dt * 1000).getHours()).toString().padStart(2, '0'),
    icon: hour.weather[0].icon,
    temp: convertToCelsius(hour.temp),
    rainPOP: hour.pop ? (hour.pop * 100).toFixed(0) : 0
    
  }))
}

const createDailyWeatherData = function (data) {
  return (applicationData.dailyWeather = data.daily.map((day) => ({
    icon: day.weather[0].icon,
    day: convertToDate(day.dt),
    tempD: convertToCelsius(day.feels_like.day),
    tempN: convertToCelsius(day.feels_like.night),
    rainPOP: day.pop ? (day.pop * 100).toFixed(0) : 0,
    wind: day.wind_speed,
    humidity: day.humidity,
  })));
};

const convertToCelsius = (K) => Math.round(K - 273.15);


const convertToDate = function (ts) {
  const date = new Date(ts * 1000);
  const numericDate = new Intl.DateTimeFormat(navigator.language)
    .format(date)
    .split('.')
    .slice(0, 2)
    .join('.');
  const dayFullName = new Intl.DateTimeFormat(navigator.language, {
    weekday: 'long',
  }).format(date);
  const formattedDayFullName =
    dayFullName[0].toUpperCase() + dayFullName.slice(1);
  const dayShortName = new Intl.DateTimeFormat(navigator.language, {
    weekday: 'short',
  }).format(date);
  const formattedDayShortName =
    dayShortName[0].toUpperCase() + dayShortName.slice(1);

  return {
    dayFullName: formattedDayFullName,
    dayShortName: formattedDayShortName,
    numericDate,
  };
};
