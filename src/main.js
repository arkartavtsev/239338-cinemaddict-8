import {MoviesCount, FILTERS} from './const';
import {getRandomNum} from './util';

import getData from './data';

import Filter from './filter';

import createCards from './create-cards';
import showStatistics from './show-statistics';


const filtersContainer = document.querySelector(`.main-navigation`);
const statsBtn = document.querySelector(`.main-navigation__item--additional`);

const films = document.querySelector(`.films`);
const extraFilmsContainers = document.querySelectorAll(`.films-list--extra .films-list__container`);
const statistic = document.querySelector(`.statistic`);


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
  const existingFilters = filtersContainer.querySelectorAll(`.main-navigation__item:not(.main-navigation__item--additional)`);

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
      const currentActive = evt.currentTarget.parentElement.querySelector(`.main-navigation__item--active`);

      if (currentActive && currentActive !== evt.currentTarget) {
        currentActive.classList.remove(`main-navigation__item--active`);
        evt.currentTarget.classList.add(`main-navigation__item--active`);

        const filteredCards = filterMovies(moviesData, filterType);

        createCards(filteredCards);
      }

      films.classList.remove(`visually-hidden`);
      statistic.classList.add(`visually-hidden`);
    };

    fragment.append(filterComponent.render());
  }

  container.prepend(fragment);
};


deleteExistingFilters();
createFilters(filtersContainer);


// первоначальная отрисовка карточек


createCards(moviesData);

for (const container of extraFilmsContainers) {
  createCards(getData(MoviesCount.EXTRA), false, container);
}


// показ статистики


const onStatsBtnClick = (evt) => {
  evt.preventDefault();

  films.classList.add(`visually-hidden`);
  statistic.classList.remove(`visually-hidden`);

  const currentActive = evt.currentTarget.parentElement.querySelector(`.main-navigation__item--active`);

  if (currentActive && currentActive !== evt.currentTarget) {
    currentActive.classList.remove(`main-navigation__item--active`);
    evt.currentTarget.classList.add(`main-navigation__item--active`);

    showStatistics(moviesData);
  }
};


statsBtn.addEventListener(`click`, onStatsBtnClick);
