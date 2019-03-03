import createFilters from './create-filters';
import createCards from './create-cards';


const EXTRA_FILMS_COUNT = 2;


const filtersContainer = document.querySelector(`.main-navigation`);
const extraFilmsContainers = document.querySelectorAll(`.films-list--extra .films-list__container`);


// создание фильтров

const deleteExistingFilters = () => {
  const existingFilters = filtersContainer.querySelectorAll(`.main-navigation__item:not(.main-navigation__item--additional)`);

  for (const filter of existingFilters) {
    filter.remove();
  }
};

deleteExistingFilters();
createFilters(filtersContainer);


// создание карточек

const activeFilter = filtersContainer.querySelector(`.main-navigation__item--active`);

createCards(activeFilter.dataset.count);

for (const container of extraFilmsContainers) {
  createCards(EXTRA_FILMS_COUNT, false, container);
}
