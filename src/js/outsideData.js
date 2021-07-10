import { API_KEY } from "./config";

export const applicationData = {
  curWeather: {},
  dailyWeather: {}
};

const createCurrentWeatherData = function(data) {
  return applicationData.curWeather = {
    icon: data.current.weather[0].icon,
    curDay: convertToDate(data.current.dt),
    curTemp: convertToCelsius(data.current.temp),
    // curRain: Object.values(data.current.rain)[0],
    curRain: data.daily[0].rain.toFixed(1),
    curWind: data.current.wind_speed.toFixed(1),
    curHumidity: data.current.humidity
  }
}

const createDailyWeatherData = function(data) {
  const formattedData = data.daily.map(day => ({
    icon: day.weather[0].icon,
    day: convertToDate(day.dt),
    tempD: convertToCelsius(day.feels_like.day),
    tempN: convertToCelsius(day.feels_like.night),
    rain: day.rain ? day.rain : 0,
    wind: day.wind_speed,
    humidity: day.humidity,
    
  })
    
  )
  console.log(data);
  console.log(formattedData);
  return applicationData.dailyWeather = {
    daily: formattedData
  }
}


export const loadWeatherData = async function (lat, lon) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=49.946311&lon=21.6632955&exclude=hourly,minutely&appid=${API_KEY}`
  );
  const data = await res.json();
  console.log(data);
  applicationData.curWeather = createCurrentWeatherData(data);
  applicationData.weather = createDailyWeatherData(data);
};

const convertToCelsius = K => Math.round(K - 273.15);
const convertToDate = function(ts) {
  const date = new Date(ts * 1000)
  const day = date.getDate();
  const month = date.getMonth();

  return [{day, month}];
}

