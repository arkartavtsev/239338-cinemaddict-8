import {FILTERS} from './const';

import Search from './search';
import Filter from './filter';

import {moviesStore, updateMoviesList, createCards} from './movies';
import {getStatistic} from './show-statistics';


const pageHeader = document.querySelector(`.header`);

const mainNav = document.querySelector(`.main-navigation`);
let activeNavItem;

const films = document.querySelector(`.films`);
const mainFilmsList = films.querySelector(`.films-list .films-list__container`);
const loadMorebtn = films.querySelector(`.films-list__show-more`);

const statistic = document.querySelector(`.statistic`);


const searchComponent = new Search();

searchComponent.onSearch = () => {
  if (activeNavItem) {
    activeNavItem.classList.remove(`main-navigation__item--active`);

    if (activeNavItem.classList.contains(`main-navigation__item--additional`)) {
      films.classList.remove(`visually-hidden`);
      statistic.classList.add(`visually-hidden`);
    }
  }

  const searchRequest = searchComponent.field.value.trim().toLowerCase();

  const searchedMovies = moviesStore.filter((item) => item.title.toLowerCase().indexOf(searchRequest) !== -1);

  mainFilmsList.innerHTML = ``;
  loadMorebtn.classList.add(`visually-hidden`);

  createCards(searchedMovies);

  if (!searchRequest.length) {
    activeNavItem.classList.add(`main-navigation__item--active`);

    if (activeNavItem.classList.contains(`main-navigation__item--additional`)) {
      films.classList.add(`visually-hidden`);
      statistic.classList.remove(`visually-hidden`);
    } else {
      updateMoviesList(moviesStore, activeNavItem.dataset.type);
    }
  }
};

const searchElement = searchComponent.render();

pageHeader.prepend(searchElement);
pageHeader.insertBefore(searchElement, pageHeader.lastElementChild);


const toggleActiveNavItem = (evt) => {
  if (activeNavItem) {
    activeNavItem.classList.remove(`main-navigation__item--active`);
  }

  evt.currentTarget.classList.add(`main-navigation__item--active`);

  activeNavItem = evt.currentTarget;
};


// фильтры


const deleteExistingFilters = () => {
  const existingFilters = mainNav.querySelectorAll(`.main-navigation__item:not(.main-navigation__item--additional)`);

  for (const filter of existingFilters) {
    filter.remove();
  }
};


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

        updateMoviesList(moviesStore, filterType);
      }

      if (films.classList.contains(`visually-hidden`)) {
        films.classList.remove(`visually-hidden`);
        statistic.classList.add(`visually-hidden`);
      }
    };

    fragment.append(filterComponent.render());
  }

  container.prepend(fragment);
};


deleteExistingFilters();
createFilters(mainNav);

activeNavItem = mainNav.querySelector(`.main-navigation__item--active`);


// показ статистики


const statsBtn = mainNav.querySelector(`.main-navigation__item--additional`);

const onStatsBtnClick = (evt) => {
  evt.preventDefault();

  if (!evt.currentTarget.classList.contains(`main-navigation__item--active`)) {
    toggleActiveNavItem(evt);
    searchComponent.field.value = ``;

    getStatistic(moviesStore);
  }

  if (statistic.classList.contains(`visually-hidden`)) {
    statistic.classList.remove(`visually-hidden`);
    films.classList.add(`visually-hidden`);
  }
};

statsBtn.addEventListener(`click`, onStatsBtnClick);
