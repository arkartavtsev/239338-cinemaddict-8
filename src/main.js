import {EXTRA_FILMS_COUNT} from './const';

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


const onFilterClick = (evt) => {
  evt.preventDefault();

  const currentActive = evt.currentTarget.parentElement.querySelector(`.main-navigation__item--active`);

  if (currentActive && currentActive !== evt.currentTarget) {
    currentActive.classList.remove(`main-navigation__item--active`);
    evt.currentTarget.classList.add(`main-navigation__item--active`);

    createCards(getData(evt.currentTarget.dataset.count));
  }
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
