import {getRandomNum} from './util';


const Filters = {
  NAMES: [
    `Watchlist`,
    `History`,
    `Favorites`
  ],
  Count: {
    MIN: 1,
    MAX: 5
  }
};


const createFilterCounter = (count) => `
  <span class="main-navigation__item-count">${count}</span>
`;

const createFilter = (name, count, isActive = false, hasCounter = true) => `
  <a class="main-navigation__item ${isActive ? `main-navigation__item--active` : ``}" data-count="${count}" href="#${name.slice(0, name.indexOf(` `)).toLowerCase()}">
    ${name}
    ${hasCounter ? createFilterCounter(count) : ``}
  </a>
`;


export default (container) => {
  let allFiltersCounterValue = 0;
  let allFiltersMarkup = ``;

  for (const filterName of Filters.NAMES) {
    const filterCount = getRandomNum(Filters.Count.MIN, Filters.Count.MAX);

    allFiltersCounterValue += filterCount;
    allFiltersMarkup += createFilter(filterName, filterCount);
  }

  const mainFilterMarkup = createFilter(`All movies`, allFiltersCounterValue, true, false);

  container.insertAdjacentHTML(`afterbegin`, mainFilterMarkup + allFiltersMarkup);
};
