import {getRandomNum} from './util';
import removeDebounce from './remove-debounce';
import createCards from './create-cards';


const Filters = {
  NAMES: [
    `Watchlist`,
    `History`,
    `Favorites`
  ],
  MIN_COUNT: 1,
  MAX_COUNT: 5
};


const toggleFilter = (filter) => {
  filter.parentElement.querySelector(`.main-navigation__item--active`).classList.remove(`main-navigation__item--active`);
  filter.classList.add(`main-navigation__item--active`);

  createCards(filter.dataset.count);
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


const createFilterCounter = (count) => `
  <span class="main-navigation__item-count">${count}</span>
`;

const createFilter = (name, count, hasCounter = true) => {
  const filter = document.createElement(`a`);

  filter.classList.add(`main-navigation__item`);
  filter.href = `#${name.slice(0, name.indexOf(` `)).toLowerCase()}`;
  filter.dataset.count = count;

  filter.innerHTML = hasCounter ?
    `${name} ${createFilterCounter(count)}` :
    `${name}`;

  filter.addEventListener(`click`, onFilterClick);

  return filter;
};


export default (container) => {
  let allFiltersCountValue = 0;
  const fragment = document.createDocumentFragment();

  for (const filterName of Filters.NAMES) {
    const filterCount = getRandomNum(Filters.MIN_COUNT, Filters.MAX_COUNT);

    allFiltersCountValue += filterCount;
    fragment.append(createFilter(filterName, filterCount));
  }

  const mainFilter = createFilter(`All movies`, allFiltersCountValue, false);
  mainFilter.classList.add(`main-navigation__item--active`);

  fragment.prepend(mainFilter);
  container.prepend(fragment);
};
