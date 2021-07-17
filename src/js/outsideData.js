import { WEATHER_API_KEY } from './config';
import { timeout } from './helpers.js';
import { TIMEOUT_TIME } from './config.js';

export const applicationData = {
  curWeather: {},
  dailyWeather: {},
};

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
    applicationData.curWeather = createCurrentWeatherData(data);
    applicationData.weather = createDailyWeatherData(data);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const createCurrentWeatherData = function (data) {
  return (applicationData.curWeather = {
    icon: data.current.weather[0].icon,
    curDay: convertToDate(data.current.dt),
    curTemp: convertToCelsius(data.current.temp),
    // curRain: Object.values(data.current.rain)[0],
    curRain: data.daily[0].rain ? data.daily[0].rain.toFixed(1) : 0,
    curWind: data.current.wind_speed ? data.current.wind_speed.toFixed(1) : 0,
    curHumidity: data.current.humidity,
  });
};

const createDailyWeatherData = function (data) {
  const formattedData = data.daily.map((day) => ({
    icon: day.weather[0].icon,
    day: convertToDate(day.dt),
    tempD: convertToCelsius(day.feels_like.day),
    tempN: convertToCelsius(day.feels_like.night),
    // rain: day.rain ? day.rain : 0,
    rainPOP: day.pop ? (day.pop * 100).toFixed(0) : 0,
    wind: day.wind_speed,
    humidity: day.humidity,
  }));
  return (applicationData.dailyWeather = formattedData);
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
