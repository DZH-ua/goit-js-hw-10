import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('input#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener(
  'input',
  debounce(getCountryByName, DEBOUNCE_DELAY)
);

function getCountryByName() {
  const country = refs.input.value.trim();
  console.log(country);

  if (country !== '') {
    fetchCountries(country)
      .then(countries => {
        if (countries.length === 1) {
          renderCountryInfo(countries);
        } else if (countries.length >= 10) {
          infoTooManyMatches();
          updateInterface('', '');
        } else {
          renderCountrList(countries);
        }
      })
      .catch(failureCountryMissing);
  } else {
    updateInterface('', '');
  }
}

function renderCountryInfo(countries) {
  console.log(`Rendering...`);
  const markup = countries
    .map(country => {
      return `
            <div class="country-info__container">
                <img src="${country.flags.svg}" alt="country flag" width = 40px>
                <h1 class="country-info__title">${country.name.official}</h1>
            </div>

            <p><b>Capital: </b>${country.capital}</p>
            <p><b>Population: </b>${country.population}</p>
            <p><b>Languages: </b>${Object.values(country.languages).join(
              ', '
            )}</p>       
        `;
    })
    .join('');
  updateInterface('', markup);
}

function renderCountrList(countries) {
  console.log(`${countries.length} found...`);
  console.log(`Rendering...`);
  const markup = countries
    .map(country => {
      return `
            <li class="country-list__item">
              <img src="${country.flags.svg}" alt="country flag" width = 30px>
              <p class="country-list__name">${country.name.official}</p>
            </li>
          `;
    })
    .join('');
  updateInterface(markup, '');
}

function failureCountryMissing() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function infoTooManyMatches() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}

function updateInterface(arg1, arg2) {
  refs.countryList.innerHTML = arg1;
  refs.countryInfo.innerHTML = arg2;
}
