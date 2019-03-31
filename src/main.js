import {FILTERS} from './const';
import {hideMessage} from './util';
import {loadMovies} from './backend';

import Filter from './filter';

import {updateMoviesList} from './update-movies-list';
import showStatistics from './show-statistics';


const mainNav = document.querySelector(`.main-navigation`);
let activeNavItem;

const films = document.querySelector(`.films`);
const mainFilmsList = films.querySelector(`.films-list .films-list__container`);
const topRatedFilmsList = films.querySelector(`.films-list--top-rated .films-list__container`);
const mostCommentedFilmsList = films.querySelector(`.films-list--most-commented .films-list__container`);

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

        updateMoviesList(filterType, mainFilmsList);
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


updateMoviesList(`all`, mainFilmsList);
updateMoviesList(`top-rated`, topRatedFilmsList, true);
updateMoviesList(`most-commented`, mostCommentedFilmsList, true);


// показ статистики


const statsBtn = mainNav.querySelector(`.main-navigation__item--additional`);

const onStatsBtnClick = (evt) => {
  evt.preventDefault();

  if (evt.currentTarget !== activeNavItem) {
    toggleActiveNavItem(evt);

    loadMovies(statistic)
      .then((movies) => {
        hideMessage(statistic);
        showStatistics(movies);
      });
  }

  if (statistic.classList.contains(`visually-hidden`)) {
    statistic.classList.remove(`visually-hidden`);
    films.classList.add(`visually-hidden`);
  }
};

statsBtn.addEventListener(`click`, onStatsBtnClick);
