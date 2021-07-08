const API_KEY = '4f34d1cc4cadf343456a32f0c8ddadfb';

export const applicationData = {
  curWeather: {},
  weather: {}
};

const createCurrentWeatherData = function(data) {
  return applicationData.curWeather = {
    curDay: data.current.dt,
    curTemp: data.current.temp,
    curRain: Object.values(data.current.rain)[0],
    curWind: data.current.wind_speed,
    curHumidity: data.current.humidity
  }
}

const createDailyWeatherData = function(data) {
  return applicationData.weather = {

  }
}


export const loadWeatherData = async function (lat, lon) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=49.946311&lon=21.6632955&exclude=hourly,minutely&appid=${API_KEY}`
  );
  const data = await res.json();
  console.log(data);
  applicationData.curWeather = createCurrentWeatherData(data);

};

