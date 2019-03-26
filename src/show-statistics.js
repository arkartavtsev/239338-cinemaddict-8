import * as moment from 'moment';
import renderChart from './render-chart';

const statistic = document.querySelector(`.statistic`);
const summary = statistic.querySelector(`.statistic__text-list`);
const chartCanvas = statistic.querySelector(`.statistic__chart`);


const renderStatisticSummary = (stats) => `
  <li class="statistic__text-item">
    <h4 class="statistic__item-title">You watched</h4>
    <p class="statistic__item-text">
      ${stats.watchedCount}
      <span class="statistic__item-description">movies</span>
    </p>
  </li>
  <li class="statistic__text-item">
    <h4 class="statistic__item-title">Total duration</h4>
    <p class="statistic__item-text">
      ${moment.duration(stats.totalDuration, `minutes`).hours()}
      <span class="statistic__item-description">h</span>
      ${moment.duration(stats.totalDuration, `minutes`).minutes()}
      <span class="statistic__item-description">m</span></p>
  </li>
  <li class="statistic__text-item">
    <h4 class="statistic__item-title">Top genre</h4>
    <p class="statistic__item-text">${stats.countedGenres.sort((left, right) => right[1] - left[1])[0][0]}</p>
  </li>
`;


export default (data) => {
  const watchedMovies = data.filter((item) => item.isWatched);

  const genres = watchedMovies.reduce((acc, item) => {
    acc.push(...item.genres);
    return acc;
  }, []);


  const stats = {
    watchedCount: watchedMovies.length,

    totalDuration: watchedMovies.reduce((acc, item) => acc + item.duration, 0),

    countedGenres: Object.entries(genres.reduce((acc, item) => {
      acc[item] = acc[item] + 1 || 1;
      return acc;
    }, {}))
  };


  summary.innerHTML = renderStatisticSummary(stats);
  renderChart(chartCanvas, stats.countedGenres);
};
