import {EXTRA_FILMS_COUNT} from './const';

import removeDebounce from './remove-debounce';
import getData from './data';

import createFilters from './create-filters';
import createCards from './create-cards';


const filtersContainer = document.querySelector(`.main-navigation`);
const extraFilmsContainers = document.querySelectorAll(`.films-list--extra .films-list__container`);


// создание фильтров

const deleteExistingFilters = () => {
  const existingFilters = filtersContainer.querySelectorAll(`.main-navigation__item:not(.main-navigation__item--additional)`);

  for (const filter of existingFilters) {
    filter.remove();
  }
};


const toggleFilter = (filter) => {
  const currentActive = filter.parentElement.querySelector(`.main-navigation__item--active`);

  if (currentActive && currentActive !== filter) {
    currentActive.classList.remove(`main-navigation__item--active`);
    filter.classList.add(`main-navigation__item--active`);

    createCards(getData(filter.dataset.count));
  }
};

const onFilterClick = (evt) => {
  evt.preventDefault();

  removeDebounce(() => {
    let target = evt.target;

    while (!target.parentElement.classList.contains(`main-navigation`)) {
      target = target.parentElement;
    }

    toggleFilter(target);
  });
};


deleteExistingFilters();
createFilters(filtersContainer);

const filters = filtersContainer.querySelectorAll(`.main-navigation__item:not(.main-navigation__item--additional`);

for (const filter of filters) {
  filter.addEventListener(`click`, onFilterClick);
}


// создание карточек

const activeFilter = filtersContainer.querySelector(`.main-navigation__item--active`);

createCards(getData(activeFilter.dataset.count));

for (const container of extraFilmsContainers) {
  createCards(getData(EXTRA_FILMS_COUNT), false, container);
}
