import { AUTOCOMPLETE_API_KEY } from './config';
import { GeocoderAutocomplete } from '@geoapify/geocoder-autocomplete';
import { applicationData } from './outsideData';
import { loadWeatherData } from './outsideData';
import { generateCurrentLocation } from './outsideData';
import { generateMarkup } from './markupsGenerator';

const searchBtn = document.querySelector('.search');
const recentlySearched = document.querySelector('.recently-searched__list');
const changeLocationBtn = document.querySelector('.forecast__change-location');
const recentlySearchedBtn = document.querySelector(
  '.recently-searched__button'
);

const body = document.querySelector('body');
const yourLoc = document.querySelector('.your-location');
const searchSite = document.querySelector('header');
const error = document.querySelector('.error');

const recentlySearchedList = document.querySelector('.recently-searched__list');
const recentlySerachedContainer = document.querySelector('.recently-searched');
const desktopDailyWeatherContainer = document.querySelector('.grid-container');
const mobileDailyWeatherContainer = document.querySelector('.forecast__mobile');
const highlightedWeatherContainer = document.querySelector(
  '.forecast__highlighted'
);
const hourlyWeatherContainer = document.querySelector('.hourly-weather__list');
const weatherContainer = document.querySelector('.forecast');

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
  #errorMsg = `Błąd w ładowaniu strony, odśwież stronę i spróbuj ponownie! 🙁`;

  constructor() {
    this._getEnteredLocationData();
    this._getLocalStorage();
    this._eventHandlers();
  }

  _eventHandlers() {
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
    yourLoc.addEventListener('click', this._getCurrentLocation.bind(this));
  }

  // Local storage
  _setLocalStorage(location) {
    localStorage.setItem('locations', JSON.stringify(location));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('locations'));
    if (!data) return;
    this.#recentlySearchedData = data;
    this._generateRecentlySearchedMarkups();
  }

  // Change location
  _changeLocation() {
    recentlySerachedContainer.classList.remove('hide-recently-searched');
    weatherContainer.style.display = 'none';
    searchSite.style.display = 'block';
    this._clearWeatherContainers();
    this._generateRecentlySearchedMarkups();
    locationInput?.focus();
  }

  _saveRecentLocation() {
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
      ) ||
      !recentLocation.cityName
    )
      return;

    if (this.#recentlySearchedData.length > 3) this.#recentlySearchedData.pop();
    this.#recentlySearchedData.unshift(recentLocation);
    this._setLocalStorage(this.#recentlySearchedData);
  }


  // Display weather
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
    if (!lat && !lon) return;
    this._generateHiglightedWeather(lat, lon);
    this._generateDailyWeather(lat, lon);
    this._generateHourlyWeahter(lat, lon);
    if (locationInput) locationInput.value = '';
    this._saveRecentLocation();
  }

  // Curr location
  _getCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      async (loc) => {
        try {
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
        } catch (err) {
          // Add error msg
          weatherContainer.style.display = 'none';
          error.classList.remove('hide-and-display');
          error.textContent = this.#errorMsg;
        }
      },
      () => {
        alert(`Nie udało się załadować lokalizacji! 🧨🧨`);
      }
    );
    locationInput.focus();
  }

  // Recently searched funcitonality
  _generateRecentlySearchedMarkups() {
    recentlySearchedList.innerHTML = '';
    const location = this.#recentlySearchedData
      .map(
        (loc) =>
          `<li data-id='${loc.id}'>${loc.cityName ? loc.cityName : 'Nieznane'
          } </li>`
      )
      .join('');
    recentlySearchedList.insertAdjacentHTML('beforeend', location);
  }

  _genarateRecentlySearchedWeather(e) {
    this._clearWeatherContainers();
    const location = e.target;
    const locationID = location.dataset.id;
    const locationData = this.#recentlySearchedData.find(
      (loc) => loc.id === locationID
    );
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
        applicationData.location = location?.properties.formatted;
        this.#locationData = {
          city: location?.properties.name,
          lat: location?.properties.lat,
          lon: location?.properties.lon,
        };

        yourLoc.classList.add('hide-and-display');
        locationInput.classList.remove('flat-border');
        closeAutocompleteBtn.classList.remove('visible');
        locationInput.focus();
      });

      autocomplete.on('suggestions', (suggestions) => {

        closeAutocompleteBtn = document.querySelector('.geoapify-close-button');
        locationInput = document.querySelector('.geoapify-autocomplete-input');
        locationInput.classList.add('flat-border');
        yourLoc.classList.remove('hide-and-display');
      });
    } catch (err) {
      // Add error msg
      weatherContainer.style.display = 'none';
      error.classList.remove('hide-and-display');
      error.textContent = this.#errorMsg;
    }
  }

  async _generateHiglightedWeather(lat, lon) {
    try {
      await loadWeatherData(lat, lon);
      this.#curWeather = { ...applicationData.curWeather };

      const markup = generateMarkup.highlightedWeather(
        this.#curWeather
      );

      this._removeSpinner();
      highlightedWeatherContainer.insertAdjacentHTML('afterbegin', markup);

      clock = document.querySelector('.today-forecast__clock');
      this._generateClock();
    } catch (err) {
      console.error(err.message);
      // Add error msg
      weatherContainer.style.display = 'none';
      error.classList.remove('hide-and-display');
      error.textContent = this.#errorMsg;
      
    }
  }

  async _generateHourlyWeahter(lat, lon) {
    try {
      await loadWeatherData(lat, lon);
      hourlyWeatherContainer.classList.remove('hidden');
      this.#hourlyWeather = applicationData.hourlyWeather;
      const markupH = generateMarkup.hourlyWeahter(this.#hourlyWeather);
      hourlyWeatherContainer.insertAdjacentHTML('afterbegin', markupH);
    } catch (err) {
      console.error(err.message);
      // Add error msg
      weatherContainer.style.display = 'none';
      error.classList.remove('hide-and-display');
      error.textContent = this.#errorMsg;
    }
  }

  async _generateDailyWeather(lat, lon) {
    try {
      await loadWeatherData(lat, lon);
      desktopDailyWeatherContainer.classList.remove('hidden');
      mobileDailyWeatherContainer.classList.remove('hidden');

      this.#dailyWeather = applicationData.dailyWeather;
      this.#dailyWeather[0].today = true;
      const markupDesktop = generateMarkup.desktopDailyWeather(
        this.#dailyWeather
      );
      const markupMobile = generateMarkup.mobileDailyWeather(this.#dailyWeather);
      desktopDailyWeatherContainer.insertAdjacentHTML(
        'afterbegin',
        markupDesktop
      );

      mobileDailyWeatherContainer.insertAdjacentHTML(
        'afterbegin',
        markupMobile
      );
    } catch (err) {
      console.error(err.message);
      // Add error msg
      weatherContainer.style.display = 'none';
      error.classList.remove('hide-and-display');
      error.textContent = this.#errorMsg;
    }
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
    recentlySearched.style.display = 'block';
    setTimeout(() => {
      recentlySearched.classList.toggle('hidden');
      recentlySearched.classList.toggle('recently-searched__list--moved');
    });
  }

  _generateSpinner() {
    searchSite.style.display = 'none';
    const markup = `
    <div class="spinner">
    <svg>
    <use href="${icons.spinner}#icon-loader"></use>
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
