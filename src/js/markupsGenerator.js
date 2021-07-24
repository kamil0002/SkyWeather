import { applicationData } from "./outsideData";
import icons from './iconsGenerator';

export const generateMarkup = {};

generateMarkup.highlightedWeather = function (curWeather) {
  
  return ` <h1 class="location">${applicationData.location}</h1>
<div class="today-forecast">
  <div class="today-forecast__date">${curWeather.curDay.dayFullName}, ${
    curWeather.curDay.numericDate
  }</div>
  <div class="today-forecast__clock">23:33:06</div>
  <div class="weather-highlighted-group">
    <div class="weather-highlighted">
      <div>
        <img
          class="weather-highlighted__weather-icon"
          src="${icons.weatherIcon[curWeather.icon]}"
          alt="weather icon"
        />
        <span class="cur-temp">${curWeather.curTemp}°C</span>
      </div>

      <div class="weather-highlighted__weather-rain">
        <img
          class="weather-highlighted__weather-icon-drop"
          src="${icons.drop}"
          alt="drop prediction"
        />
        <span class="cur-rain">${curWeather.curRain}mm</span>
      </div>

      <div class="weather-highlighted__weather-wind">
        <img
          class="weather-highlighted__weather-icon-wind"
          src="${icons.wind}"
          alt="wind-icon"
        />
        <span class="cur-wind">${curWeather.curWind}km/h</span>
      </div>

      <div class="weather-highlighted__weather-humidity">
        <img
          class="weather-highlighted__weather-icon-humidity"
          src="${icons.humidity}"
          alt="humidity-icon"
        />
        <span class="cur-humidity">${curWeather.curHumidity}%</span>
      </div>
    </div>
  </div>
</div>
`;
};

generateMarkup.hourlyWeahter= function(data) {
  return data
    .map((hour) => {
      return `
    <li class="hourly-weather__list__item">
    <span class="hourly-weather__list__item__time">${hour.h}:00</span>
    <img class="hourly-weather__list__item__weather-icon" src="${
      icons.weatherIcon[hour.icon]
    }"" alt="">
    <span class="hourly-weather__list__item__degree">${hour.temp}°C</span>
    <span class="hourly-weather__list__item__drop">
      <img class="hourly-weather__list__item__drop-icon" src="${
        icons.drop
      }" alt="Drop">
      ${hour.rainPOP}%
    </span>
  </li>
    `;
    })
    .join('');
}

generateMarkup.desktopDailyWeather = function (data) {
  return data
    .map((day) => {
      return `<div class="grid-container__day">
  <span class="overlay ${day.today ? 'overlay--highlighted' : ''} hidden">
    <ul class="overlay__data">
      <li class="overlay__data__humidity">
        <img
          src="${icons.humidity}"
          alt="humidity-icon"
        />${day.humidity}%
      </li>
      <li class="overlay__data__wind">
        <img
          src="${icons.wind}"
          alt="wind-icon"
        />${day.wind}km/h
      </li>
      <li class="overlay__data__drop">
        <img
          src="${icons.drop}"
          alt="wind-icon"
        />${day.rainPOP}%
      </li>
    </ul>
  </span>
  <div class="grid-container__day__weather">
    <h3 class="grid-container__day__weather__date">
      ${day.day.dayShortName} ${day.day.numericDate}
    </h3>
    <div>
      <img class="grid-container__day__weather__icon" src="${
        icons.weatherIcon[day.icon]
      }" alt="Weather icon">
    </div>
    <span class="grid-container__day__weather__data">Dzień - ${
      day.tempD
    }°C</span>
    <span class="grid-container__day__weather__data">Noc - ${day.tempN}°C</span>
  </div>
</div>`;
    })
    .join('');
};

generateMarkup.mobileDailyWeather = function (data) {
  return data
    .map((day) => {
      return `<div class="forecast__mobile__day">
    <span class="forecast__mobile__day__data ${
      day.today ? 'forecast__mobile__day__data--highlighted' : ''
    }">
      <ul>
      <li class="forecast__mobile__weather forecast__mobile__weather--small">
        <img
          class="forecast__mobile__weather-icon"
          src="${icons.weatherIcon[day.icon]}"
          alt="weather icon"
        />
      </li> 
        <li>
          <div class="forecast__mobile__weather-pred">
            <img
              class="forecast__mobile__weather-pred-icon"
              src="${icons.drop}"
              alt="drop prediction"
            />
            <span>${day.rainPOP}%</span>
          </div>
        </li>
        <li>
          <div class="forecast__mobile__weather-pred">
            <img
              class="forecast__mobile__weather-pred-icon"
              src="${icons.wind}"
              alt="wind"
            />
            <span>${day.wind}km/h</span>
          </div>
        </li>
        <li>
          <div class="forecast__mobile__weather-pred">
            <img
              class="forecast__mobile__weather-pred-icon"
              src="${icons.humidity}"
              alt="humidity"
            />
            <span>${day.humidity}%</span>
          </div>
        </li>
      </ul>
    </span>
    <div class="forecast__mobile__date">${day.day.dayShortName} ${
        day.day.numericDate
      }</div>
   
    <div class="forecast__mobile__weather">
      <img
        class="forecast__mobile__weather-icon"
        src="${icons.weatherIcon[day.icon]}"
        alt="weather icon"
      />
    </div> 
    <div class="forecast__mobile__period">
      <span>Dzień</span>
      <span class="forecast__mobile__separator"></span>
      <span>Noc</span>
    </div>
  <div class="forecast__mobile__degree-container">
    <span class="forecast__mobile__degree">${day.tempD}°C</span>
    <span class="forecast__mobile__separator"></span>
    <span class="forecast__mobile__degree">${day.tempN}°C</span>
  </div>
  </div>`;
    })
    .join('');
};
