import { AUTOCOMPLETE_API_KEY } from './config';
import { GeocoderAutocomplete } from '@geoapify/geocoder-autocomplete';
import { applicationData } from './outsideData';
import { loadWeatherData } from './outsideData';
import { generateCurrentLocation } from './outsideData';
import icons from './iconsGenerator';
import spinner from 'url:../images/spinner.svg';

const recentlySearched = document.querySelector('.recently-searched__list');
const recentlySearchedBtn = document.querySelector(
  '.recently-searched__button'
);
const body = document.querySelector('body');
const yourLoc = document.querySelector('.your-location');
const recentlySerachedContainer = document.querySelector('.recently-searched');
const changeLocationBtn = document.querySelector('.forecast__change-location');
const recentlySearchedList = document.querySelector('.recently-searched__list');
const searchBtn = document.querySelector('.search');
const searchSite = document.querySelector('header');
const desktopDailyWeatherContainer = document.querySelector('.grid-container');
const mobileDailyWeatherContainer = document.querySelector('.forecast__mobile');
const highlightedWeatherContainer = document.querySelector(
  '.forecast__highlighted'
);
const hourlyWeatherContainer = document.querySelector('.hourly-weather__list');
const weatherContainer = document.querySelector('.forecast');

// let overlay;
let clock;
let spinnerEl;
let locationInput;
let closeAutocompleteBtn;

class App {
  #curWeather;
  #hourlyWeather;
  #dailyWeather;
  #locationData;
  #recentlySearchedData = [];

  constructor() {
    this._getEnteredLocationData();
    this._getLocalStorage();

    recentlySearchedBtn.addEventListener(
      'click',
      this._showRecentlySearchedLoc
    );
    desktopDailyWeatherContainer.addEventListener(
      'mouseover',
      this._showMoreWeatherData
    );
    desktopDailyWeatherContainer.addEventListener(
      'mouseout',
      this._hideMoreWeatherData
    );
    searchBtn.addEventListener('submit', this._generateWeather.bind(this));
    changeLocationBtn.addEventListener(
      'click',
      this._changeLocation.bind(this)
    );

    recentlySearchedList.addEventListener(
      'click',
      this._genarateRecentlySearchedWeather.bind(this)
    );

    body.addEventListener('click', (e) => {
      if (
        e.target.classList.contains('header') ||
        e.target.classList.contains('bg-overlay')
      ) {
        yourLoc.classList.add('hide-and-display');
        locationInput?.classList.remove('flat-border');
        closeAutocompleteBtn?.classList.remove('visible');
      }
    });
    // localStorage.clear();
    yourLoc.addEventListener('click', this._getCurrentLocation.bind(this));
  }

  // LOCAL STORAGE STOR
  _setLocalStorage(location) {
    localStorage.setItem('locations', JSON.stringify(location));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('locations'));
    if (!data) return;
    this.#recentlySearchedData = data;
    this._generateRecentlySearchedMarkups();
  }

  _changeLocation() {
    recentlySerachedContainer.classList.remove('hide-recently-searched');
    weatherContainer.style.display = 'none';
    searchSite.style.display = 'block';
    this._clearWeatherContainers();
    this._generateRecentlySearchedMarkups();
    // if (this.#recentlySearchedData.length > 3) this.#recentlySearchedData.pop();

    // const recentLocation = {
    //   cityName: this.#locationData?.city,
    //   cityDetail: applicationData.location,
    //   lat: this.#locationData?.lat,
    //   lon: this.#locationData?.lon,
    //   id: (Date.now() + '').slice(-10),
    // };

    // if (this.#recentlySearchedData.some((loc) => loc.cityName == recentLocation.cityName)) return;

    // this.#recentlySearchedData.unshift(recentLocation);
    // this._setLocalStorage(this.#recentlySearchedData);

    // this._generateRecentlySearchedMarkups();
    locationInput?.focus();
  }

  _saveRecentLocation() {
    if (this.#recentlySearchedData.length > 3) this.#recentlySearchedData.pop();

    const recentLocation = {
      cityName: this.#locationData?.city,
      cityDetail: applicationData.location,
      lat: this.#locationData?.lat,
      lon: this.#locationData?.lon,
      id: (Date.now() + '').slice(-10),
    };

    if (
      this.#recentlySearchedData.some(
        (loc) => loc.cityName == recentLocation.cityName
      )
    )
      return;

    this.#recentlySearchedData.unshift(recentLocation);
    this._setLocalStorage(this.#recentlySearchedData);

  }

  _generateWeather(
    e,
    lat = this.#locationData.lat,
    lon = this.#locationData.lon
  ) {
    recentlySerachedContainer.classList.add('hide-recently-searched');
    closeAutocompleteBtn?.classList?.remove('visible'); // IMP!
    weatherContainer.style.display = 'block';
    this._generateSpinner();
    if (e.target?.classList.contains('search')) e.preventDefault();
    console.log(this.#locationData);
    // if (!this.#locationData) return;
    if (!lat && !lon) return;
    this._generateHiglightedWeather(lat, lon);
    this._generateDailyWeather(lat, lon);
    this._generateHourlyWeahter(lat, lon);
    locationInput.value = '';
    // const recentLocation = {
    //   cityName: this.#locationData.city,
    //   cityDetail: applicationData.location,
    //   lat: this.#locationData.lat,
    //   lon: this.#locationData.lon,
    //   id: (Date.now() + '').slice(-10),
    // };

    // if (this.#recentlySearchedData.some((loc) => loc.cityName == recentLocation.cityName)) return

    // this.#recentlySearchedData.unshift(recentLocation);
    this._saveRecentLocation();
  }

  // Curr location
  _getCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      async (loc) => {
        console.log(loc);

        this.#locationData = {
          lat: loc.coords.latitude,
          lon: loc.coords.longitude,
        };
        this.#locationData.city = await generateCurrentLocation(
          this.#locationData.lat,
          this.#locationData.lon
        );
        locationInput.value = this.#locationData?.city;
        applicationData.location = this.#locationData.city;
        closeAutocompleteBtn.classList.remove('visible');
        yourLoc.classList.add('hide-and-display');
      },
      () => {
        alert(`Nie udało się załadować lokalizacji! 🧨🧨`);
      }
    );
    locationInput.focus();
  }

  // Recently searched funcitonality
  _generateRecentlySearchedMarkups() {
    console.log(this.#recentlySearchedData);
    recentlySearchedList.innerHTML = '';
    const location = this.#recentlySearchedData
      .map((loc) => `<li data-id='${loc.id}'>${loc.cityName} </li>`)
      .join('');
    recentlySearchedList.insertAdjacentHTML('afterbegin', location);
  }

  _genarateRecentlySearchedWeather(e) {
    this._clearWeatherContainers();
    const location = e.target;
    console.log(location);
    const locationID = location.dataset.id;
    const locationData = this.#recentlySearchedData.find(
      (loc) => loc.id === locationID
    );
    console.log(this.#recentlySearchedData);
    applicationData.location = locationData?.cityDetail;
    this._generateWeather(e, locationData.lat, locationData.lon);
  }

  _clearWeatherContainers() {
    desktopDailyWeatherContainer.innerHTML = '';
    mobileDailyWeatherContainer.innerHTML = '';
    highlightedWeatherContainer.innerHTML = '';
    hourlyWeatherContainer.innerHTML = '';
  }

  // Get location data functionality
  async _getEnteredLocationData() {
    try {
      const autocomplete = new GeocoderAutocomplete(
        document.getElementById('autocomplete'),
        AUTOCOMPLETE_API_KEY,
        {
          limit: 7,
          lang: 'pl',
          placeholder: 'Wpisz miejscowość, np. Rzeszów, Strzyżów',
        }
      );

      await autocomplete.on('select', (location) => {
        console.log(location);
        applicationData.location = location?.properties.formatted;
        this.#locationData = {
          city: location?.properties.name,
          lat: location?.properties.lat,
          lon: location?.properties.lon,
        };
        console.log(this.#locationData);
        // locationInput = document.querySelector('.geoapify-autocomplete-input');

        yourLoc.classList.add('hide-and-display');
        locationInput.classList.remove('flat-border');
        closeAutocompleteBtn.classList.remove('visible');
        locationInput.focus();
      });

      autocomplete.on('suggestions', (suggestions) => {
        console.log(suggestions);

        closeAutocompleteBtn = document.querySelector('.geoapify-close-button');
        locationInput = document.querySelector('.geoapify-autocomplete-input');
        locationInput.classList.add('flat-border');
        yourLoc.classList.remove('hide-and-display');
      });
    } catch (err) {
      throw err;
    }
  }

  async _generateHiglightedWeather(lat, lon) {
    try {
      await loadWeatherData(lat, lon);
      this.#curWeather = { ...applicationData.curWeather };
      console.log(this.#curWeather);
      console.log(spinnerEl);

      const markup = `
    <h1 class="location">${applicationData.location}</h1>
    <div class="today-forecast">
      <div class="today-forecast__date">${
        this.#curWeather.curDay.dayFullName
      }, ${this.#curWeather.curDay.numericDate}</div>
      <div class="today-forecast__clock">23:33:06</div>
      <div class="weather-highlighted-group">
        <div class="weather-highlighted">
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
    `;

      this._removeSpinner();
      highlightedWeatherContainer.insertAdjacentHTML('afterbegin', markup);

      clock = document.querySelector('.today-forecast__clock');
      this._generateClock();
    } catch (err) {
      console.error(err.message);
    }
  }

  async _generateHourlyWeahter(lat, lon) {
    try {
      await loadWeatherData(lat, lon);
      hourlyWeatherContainer.classList.remove('hidden');
      this.#hourlyWeather = applicationData.hourlyWeather;
      const markupH = this._generateHourlyWeahterMarkup(this.#hourlyWeather);
      hourlyWeatherContainer.insertAdjacentHTML('afterbegin', markupH);
    } catch (err) {
      console.error(err.message);
    }
  }

  async _generateDailyWeather(lat, lon) {
    try {
      await loadWeatherData(lat, lon);
      desktopDailyWeatherContainer.classList.remove('hidden');
      mobileDailyWeatherContainer.classList.remove('hidden');

      this.#dailyWeather = applicationData.dailyWeather;
      console.log(this.#dailyWeather);
      this.#dailyWeather[0].today = true;
      const markupDesktop = this._generateDesktopDailyWeatherMarkup(
        this.#dailyWeather
      );
      const markupMobile = this._generateMobileDailyWeatherMarkup(
        this.#dailyWeather
      );
      desktopDailyWeatherContainer.insertAdjacentHTML(
        'afterbegin',
        markupDesktop
      );
      // overlay = document.querySelector('.overlay');

      mobileDailyWeatherContainer.insertAdjacentHTML(
        'afterbegin',
        markupMobile
      );
    } catch (err) {
      console.error(err.message);
    }
  }

  _generateHourlyWeahterMarkup(data) {
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

  _generateDesktopDailyWeatherMarkup(data) {
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
      <span class="grid-container__day__weather__data">Noc - ${
        day.tempN
      }°C</span>
    </div>
  </div>`;
      })
      .join('');
  }

  _generateMobileDailyWeatherMarkup(data) {
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
  }

  _showMoreWeatherData(e) {
    const daySquare = e.target.closest('.overlay');
    if (!daySquare) return;
    daySquare.classList.remove('hidden');
  }

  _hideMoreWeatherData(e) {
    const daySquare = e.target.closest('.overlay');
    if (!daySquare) return;
    daySquare.classList.add('hidden');
  }

  _generateClock() {
    const curDate = new Date();
    const hours = curDate.getHours().toString().padStart(2, 0);
    const minutes = curDate.getMinutes().toString().padStart(2, 0);
    const seconds = curDate.getSeconds().toString().padStart(2, 0);

    clock.textContent = `${hours}:${minutes}:${seconds}`;
    setInterval(this._generateClock, 1000);
  }

  _showRecentlySearchedLoc() {
    recentlySearched.classList.toggle('hidden');
    recentlySearched.classList.toggle('recently-searched__list--moved');
  }

  _generateSpinner() {
    searchSite.style.display = 'none';
    const markup = `
    <div class="spinner">
    <svg>
    <use href="${spinner}#icon-loader"></use>
    </svg>
    </div>
    `;
    weatherContainer.insertAdjacentHTML('afterbegin', markup);
    spinnerEl = document.querySelector('.spinner');
  }

  _removeSpinner() {
    weatherContainer.removeChild(spinnerEl);
  }
}

new App();
