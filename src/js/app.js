import { applicationData } from './outsideData';
import { loadWeatherData } from './outsideData';
import icons from './iconsGenerator';



const recentlySearched = document.querySelector('.recently-searched__list');
const recentlySearchedBtn = document.querySelector(
  '.recently-searched__button'
);

const weatherContainer = document.querySelector('.forecast')


class App {
  #curWeather;
  #dailyWeather;

  constructor() {
    this._generateCurrentWeather();
    this._generateDailyWeather();
    
    recentlySearchedBtn.addEventListener('click', this._showRecentlySearchedLoc);
  }

  _showRecentlySearchedLoc() {
    recentlySearched.classList.toggle('hidden');
    recentlySearched.classList.toggle('recently-searched__list--moved');
  }

  async _generateCurrentWeather() {
    await loadWeatherData();  
    this.#curWeather = applicationData.curWeather;

    const markup = `
    <h1 class="location">Rzeszów</h1>
    <div class="today-forecast">
      <div class="today-forecast__date">Sobota, 22.05</div>
      <div class="today-forecast__clock">23:33:06</div>
      <div class="weather-highlighted-group">
        <div class="weather-highlighted weather-highlighted--day">
          <div>
            <img
              class="weather-highlighted__weather-icon"
              src="${icons.weatherIcon[this.#curWeather.icon]}"
              alt="weather icon"
            />
            <span class="cur-temp">${this.#curWeather.curTemp}°C</span>
          </div>

          <div class="weather-highlighted__weather-rain">
            <img
              class="weather-highlighted__weather-icon-drop"
              src="${icons.drop}"
              alt="drop prediction"
            />
            <span class="cur-rain">${this.#curWeather.curRain}mm</span>
          </div>

          <div class="weather-highlighted__weather-wind">
            <img
              class="weather-highlighted__weather-icon-wind"
              src="${icons.wind}"
              alt="wind-icon"
            />
            <span class="cur-wind">${this.#curWeather.curWind}km/h</span>
          </div>

          <div class="weather-highlighted__weather-humidity">
            <img
              class="weather-highlighted__weather-icon-humidity"
              src="${icons.humidity}"
              alt="humidity-icon"
            />
            <span class="cur-humidity">${this.#curWeather.curHumidity}%</span>
          </div>
        </div>
      </div>
    </div>
    `
    weatherContainer.insertAdjacentHTML('afterbegin', markup);
  }

  async _generateDailyWeather() {
    await loadWeatherData();
    this.#dailyWeather = applicationData.dailyWeather;
    console.log(this.#dailyWeather);
  }

}


new App();