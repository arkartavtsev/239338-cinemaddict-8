import {FILTERS} from './const';

import Filter from './filter';

import {moviesStore, updateMoviesList} from './movies';
import showStatistics from './show-statistics';


const mainNav = document.querySelector(`.main-navigation`);
let activeNavItem;

const films = document.querySelector(`.films`);
const statistic = document.querySelector(`.statistic`);


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

      if (evt.currentTarget !== activeNavItem) {
        toggleActiveNavItem(evt);

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

  if (evt.currentTarget !== activeNavItem) {
    toggleActiveNavItem(evt);

    showStatistics(moviesStore);
  }

  if (statistic.classList.contains(`visually-hidden`)) {
    statistic.classList.remove(`visually-hidden`);
    films.classList.add(`visually-hidden`);
  }
};

statsBtn.addEventListener(`click`, onStatsBtnClick);
