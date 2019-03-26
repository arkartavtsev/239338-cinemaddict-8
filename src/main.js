import {MoviesCount, FILTERS} from './const';
import {getRandomNum} from './util';

import getData from './data';

import Filter from './filter';

import createCards from './create-cards';
import showStatistics from './show-statistics';


const mainNav = document.querySelector(`.main-navigation`);
let activeNavItem;

const films = document.querySelector(`.films`);
const extraFilmsContainers = films.querySelectorAll(`.films-list--extra .films-list__container`);

const statistic = document.querySelector(`.statistic`);


const toggleActiveNavItem = (evt) => {
  if (activeNavItem) {
    activeNavItem.classList.remove(`main-navigation__item--active`);
  }

  evt.currentTarget.classList.add(`main-navigation__item--active`);

  activeNavItem = evt.currentTarget;
};


const moviesData = getData(getRandomNum(MoviesCount.Main.MIN, MoviesCount.Main.MAX));


// фильтры


const filterMovies = (movies, filtrationType) => {
  switch (filtrationType) {
    case `watchlist`:
      return movies.filter((item) => item.isInWatchlist);

    case `history`:
      return movies.filter((item) => item.isWatched);

    case `favorites`:
      return movies.filter((item) => item.isFavorite);

    default:
      return movies;
  }
};


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

        const filteredCards = filterMovies(moviesData, filterType);

        createCards(filteredCards);
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


// первоначальная отрисовка карточек


createCards(moviesData);

for (const container of extraFilmsContainers) {
  createCards(getData(MoviesCount.EXTRA), false, container);
}


// показ статистики


const statsBtn = mainNav.querySelector(`.main-navigation__item--additional`);

const onStatsBtnClick = (evt) => {
  evt.preventDefault();

  if (evt.currentTarget !== activeNavItem) {
    toggleActiveNavItem(evt);
    showStatistics(moviesData);
  }

  if (statistic.classList.contains(`visually-hidden`)) {
    statistic.classList.remove(`visually-hidden`);
    films.classList.add(`visually-hidden`);
  }
};

statsBtn.addEventListener(`click`, onStatsBtnClick);
