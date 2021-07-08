import { applicationData } from './outsideData';
import { loadWeatherData } from './outsideData';

const recentlySearched = document.querySelector('.recently-searched__list');
const recentlySearchedBtn = document.querySelector(
  '.recently-searched__button'
);


class App {

  constructor() {
    this._generateWeather();
    
    recentlySearchedBtn.addEventListener('click', this._showRecentlySearchedLoc);
  }

  async _generateWeather() {
    await loadWeatherData();
    const { curWeather } = applicationData;
    console.log(curWeather);
  }

  _showRecentlySearchedLoc() {
    recentlySearched.classList.toggle('hidden');
    recentlySearched.classList.toggle('recently-searched__list--moved');
  }

}

const app = new App();