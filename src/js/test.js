// import { GeocoderAutocomplete } from '@geoapify/geocoder-autocomplete';

// const autocomplete = new GeocoderAutocomplete(
//   document.getElementById('autocomplete'),
//   '75e563270ba84b0bb064a9f81034f08f',
//   {
//   limit: 7,
//    lang: 'pl',
//    placeholder: 'Wpisz miejscowość, np. Rzeszów, Strzyżów'
//   }
// );

// autocomplete.on('select', (location) => {
//   console.log(location);
//   document.querySelector('.geoapify-autocomplete-input').focus();
// });

// autocomplete.on('suggestions', (suggestions) => {});

// const header = document.querySelector('header');
// const forecast = document.querySelector('.forecast');
// const gridContainer = document.querySelector('.grid-container').classList.remove('hidden');

// header.classList.add('hidden');
// header.style.display = 'none';
// forecast.classList.remove('hidden');
// forecast.style.display = 'block';

const hourly = document.querySelector('.hourly-weather').style.display = 'none';
