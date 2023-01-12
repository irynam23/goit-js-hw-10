import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('input#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(evt) {
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';
  const countryName = evt.target.value.trim();
  if (!countryName) {
    return
  }
  fetchCountries(countryName)
    .then(data => {
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      if (data.length < 2) {
        renderOne(data);
        return;
      }
      renderList(data);
      return;
    })
    .catch(() => {
      Notify.failure('Oops, there is no country with that name');
    });
}

function renderOne([country]) {
  const markup = `<div class="wrap-renderOne"><img src="${
    country.flags.svg
  }" alt="Flag of ${country.name.official}" width="40"height="20"><h1>${
    country.name.official
  }</h1></div>
  <ul><li><span>Capital: </span>${country.capital}</li>
  <li><span>Population: </span>${country.population}</li>
  <li><span>Languages: </span>${Object.values(country.languages)}</li></ul>
    `;
  countryInfo.insertAdjacentHTML('beforeend', markup);
}

function renderList(countries) {
  const markup = countries
    .map(({ name, flags }) => {
      return `
        <li class="wrap-renderList"><img src="${flags.svg}" alt="Flag of ${name.official}" width="40"height="20"><p>${name.official}</p></li>`;
    })
    .join('');
  countryList.insertAdjacentHTML('beforeend', markup);
}
