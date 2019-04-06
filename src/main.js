import {FILTERS} from './const';

import {loadedMovies, showFilteredMovies, showSearchedMovies} from './movies';
import {getStatistic} from './statistic';

import Search from './search';
import Filter from './filter';


const pageHeader = document.querySelector(`.header`);

const mainNav = document.querySelector(`.main-navigation`);
let activeNavItem;

const films = document.querySelector(`.films`);
const statistic = document.querySelector(`.statistic`);


// переключение между блоками


const toggleActiveNavItem = (evt) => {
  if (activeNavItem) {
    activeNavItem.classList.remove(`main-navigation__item--active`);
  }

  evt.currentTarget.classList.add(`main-navigation__item--active`);

  activeNavItem = evt.currentTarget;
};


const showMoviesBoard = () => {
  films.classList.remove(`visually-hidden`);
  statistic.classList.add(`visually-hidden`);
};

const showStatisticBoard = () => {
  films.classList.add(`visually-hidden`);
  statistic.classList.remove(`visually-hidden`);
};


// поиск


const searchComponent = new Search();

searchComponent.onSearch = () => {
  if (activeNavItem) {
    activeNavItem.classList.remove(`main-navigation__item--active`);

    if (activeNavItem.classList.contains(`main-navigation__item--additional`)) {
      showMoviesBoard();
    }
  }

  const searchRequest = searchComponent.field.value.trim().toLowerCase();

  showSearchedMovies(searchRequest);

  if (!searchRequest.length) {
    activeNavItem.classList.add(`main-navigation__item--active`);

    if (activeNavItem.classList.contains(`main-navigation__item--additional`)) {
      showStatisticBoard();
    } else {
      showFilteredMovies(activeNavItem.dataset.type);
    }
  }
};

const searchElement = searchComponent.render();

pageHeader.prepend(searchElement);
pageHeader.insertBefore(searchElement, pageHeader.lastElementChild);


// фильтры


const createFilters = (container) => {
  const fragment = document.createDocumentFragment();

  for (const filterName of FILTERS) {
    const filterComponent = new Filter(filterName);

    filterComponent.isMain = filterName === `All movies`;

    filterComponent.onFilter = (evt, filterType) => {
      evt.preventDefault();

      if (!evt.currentTarget.classList.contains(`main-navigation__item--active`)) {
        toggleActiveNavItem(evt);
        searchComponent.field.value = ``;

        showFilteredMovies(filterType);
      }

      if (films.classList.contains(`visually-hidden`)) {
        showMoviesBoard();
      }
    };

    fragment.append(filterComponent.render());
  }

  container.prepend(fragment);
};

createFilters(mainNav);

activeNavItem = mainNav.querySelector(`.main-navigation__item--active`);


// показ статистики


const statsBtn = mainNav.querySelector(`.main-navigation__item--additional`);

const onStatsBtnClick = (evt) => {
  evt.preventDefault();

  if (!evt.currentTarget.classList.contains(`main-navigation__item--active`)) {
    toggleActiveNavItem(evt);
    searchComponent.field.value = ``;

    getStatistic(loadedMovies);
  }

  if (statistic.classList.contains(`visually-hidden`)) {
    showStatisticBoard();
  }
};

statsBtn.addEventListener(`click`, onStatsBtnClick);
