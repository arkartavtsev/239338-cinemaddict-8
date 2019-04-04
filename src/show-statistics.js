import * as moment from 'moment';

import {hideMessage, showMessage} from './util';
import renderChart from './render-chart';


const BAR_HEIGHT = 50;


let watchedMovies;
let chart;


const statistic = document.querySelector(`.statistic`);
const summary = statistic.querySelector(`.statistic__text-list`);
const chartCanvas = statistic.querySelector(`.statistic__chart`);

const rankOutput = statistic.querySelector(`.statistic__rank-label`);

const periodFilters = statistic.querySelectorAll(`.statistic__filters-input`);


const getUserRank = (watchedMoviesCount) => {
  if (watchedMoviesCount > 20) {
    return `Movie Buff`;
  }

  if (watchedMoviesCount <= 20 && watchedMoviesCount > 10) {
    return `Fan`;
  }

  return `Novice`;
};

const showUserRank = (watchedMoviesCount, output) => {
  output.textContent = getUserRank(watchedMoviesCount);
};


const isMovieWatchDateInPeriod = (movie, period) => {
  const movieWatchDate = moment(movie.watchDate).startOf(`day`);

  return movieWatchDate >= period.startOf(`day`).valueOf();
};

const getWatchedMoviesFromPeriod = (movies, period) => {
  switch (period) {
    case `statistic-today`:
      return movies.filter((item) => isMovieWatchDateInPeriod(item, moment()));

    case `statistic-week`:
      return movies.filter((item) => isMovieWatchDateInPeriod(item, moment().subtract(1, `week`)));

    case `statistic-month`:
      return movies.filter((item) => isMovieWatchDateInPeriod(item, moment().subtract(1, `month`)));

    case `statistic-year`:
      return movies.filter((item) => isMovieWatchDateInPeriod(item, moment().subtract(1, `year`)));

    default:
      return movies;
  }
};


const restoreStatisticView = () => {
  hideMessage(statistic);
  summary.innerHTML = ``;

  if (chart) {
    chart.destroy();
  }
};


const renderStatisticSummary = (stats) => `
  <li class="statistic__text-item">
    <h4 class="statistic__item-title">You watched</h4>
    <p class="statistic__item-text">
      ${stats.watchedCount}
      <span class="statistic__item-description">${stats.watchedCount === 1 ? `movie` : `movies`}</span>
    </p>
  </li>
  <li class="statistic__text-item">
    <h4 class="statistic__item-title">Total duration</h4>
    <p class="statistic__item-text">
      ${Math.trunc(moment.duration(stats.totalDuration, `minutes`).asHours())}
      <span class="statistic__item-description">h</span>
      ${moment.duration(stats.totalDuration, `minutes`).minutes()}
      <span class="statistic__item-description">m</span></p>
  </li>
  <li class="statistic__text-item">
    <h4 class="statistic__item-title">Top genre</h4>
    <p class="statistic__item-text">${stats.countedGenres.length ? stats.countedGenres.sort((left, right) => right[1] - left[1])[0][0] : `&#8212;`}</p>
  </li>
`;


const prepareStatistic = (data) => {
  const genres = data.reduce((acc, item) => {
    acc.push(...item.genres);
    return acc;
  }, []);

  return {
    watchedCount: data.length,

    totalDuration: data.reduce((acc, item) => acc + item.duration, 0),

    countedGenres: Object.entries(genres.reduce((acc, item) => {
      acc[item] = acc[item] + 1 || 1;
      return acc;
    }, {}))
  };
};

const showStatistic = (data) => {
  const stats = prepareStatistic(data);

  restoreStatisticView();

  summary.innerHTML = renderStatisticSummary(stats);

  if (stats.countedGenres.length) {
    chartCanvas.height = BAR_HEIGHT * stats.countedGenres.length;
    chart = renderChart(chartCanvas, stats.countedGenres);
  }
};


const showStatisticFromPeriod = () => {
  const period = Array.from(periodFilters).find((filter) => filter.checked === true).id;

  const moviesToShow = getWatchedMoviesFromPeriod(watchedMovies, period);

  showStatistic(moviesToShow);
};


const getStatistic = (data) => {
  watchedMovies = data.filter((item) => item.isWatched);

  if (!watchedMovies.length) {
    restoreStatisticView();
    rankOutput.parentElement.classList.add(`visually-hidden`);

    showMessage(`There is a lack of data to show statistic. Mark some movies as watched.`, statistic);

    return;
  }


  showStatisticFromPeriod();

  rankOutput.parentElement.classList.remove(`visually-hidden`);
  showUserRank(watchedMovies.length, rankOutput);
};


for (const filter of periodFilters) {
  filter.addEventListener(`click`, showStatisticFromPeriod);
}


export {
  showUserRank,
  getStatistic
};
