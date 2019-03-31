import {EXTRA_MOVIES_COUNT} from './const';
import {showMessage} from './util';
import {api, loadMovies} from './backend';

import MovieCard from './movie-card';
import MoviePopup from './movie-popup';


const mainFilmsList = document.querySelector(`.films-list .films-list__container`);
const topRatedFilmsList = document.querySelector(`.films-list--top-rated .films-list__container`);
const mostCommentedFilmsList = document.querySelector(`.films-list--most-commented .films-list__container`);


const selectMoviesByCriterion = (movies, criterion) => {
  switch (criterion) {
    case `watchlist`:
      return movies.filter((item) => item.isInWatchlist);

    case `history`:
      return movies.filter((item) => item.isWatched);

    case `favorites`:
      return movies.filter((item) => item.isFavorite);

    case `top-rated`:
      return movies.slice().sort((left, right) => right.rating - left.rating).splice(0, EXTRA_MOVIES_COUNT);

    case `most-commented`:
      return movies.filter((movie) => movie.comments.length).sort((left, right) => right.comments.length - left.comments.length).splice(0, EXTRA_MOVIES_COUNT);

    default:
      return movies;
  }
};


const createCards = (data, isExtra, container = mainFilmsList) => {
  const fragment = document.createDocumentFragment();

  container.innerHTML = ``;

  if (!data.length) {
    showMessage(`There are no suitable movies to show.`, container);

    return;
  }

  for (const movieData of data) {
    const movieCardComponent = new MovieCard(movieData);
    const moviePopupComponent = new MoviePopup(movieData);

    const activeFilterType = document.querySelector(`.main-navigation__item--active`).dataset.type;


    movieCardComponent.isFull = !isExtra;


    movieCardComponent.onPopupOpen = () => {
      moviePopupComponent.update(movieData);
      moviePopupComponent.render();

      document.body.appendChild(moviePopupComponent.element);
    };

    movieCardComponent.onListControlToggle = (evt, stateName, stateValue) => {
      movieData[stateName] = stateValue;

      movieCardComponent.blockCard();

      api.updateMovie(movieData.id, movieData.toRAW())
      .then(() => {
        updateMoviesList(activeFilterType, mainFilmsList);
      })
      .catch(() => {
        movieData[stateName] = !stateValue;
        movieCardComponent.showError(evt);
      });
    };


    moviePopupComponent.onPopupClose = () => {
      updateMoviesList(activeFilterType, mainFilmsList);
      updateMoviesList(`top-rated`, topRatedFilmsList, true);
      updateMoviesList(`most-commented`, mostCommentedFilmsList, true);

      moviePopupComponent.unrender();
    };

    moviePopupComponent.onCommentSend = (newData) => {
      movieData.comments.push(newData);

      moviePopupComponent.blockCommentField();

      api.updateMovie(movieData.id, movieData.toRAW())
      .then(() => {
        moviePopupComponent.showNewComment(newData);
        moviePopupComponent.unblockCommentField();
      })
      .catch(() => {
        moviePopupComponent.showCommentSendError();
      });
    };

    moviePopupComponent.onRatingChange = (evt, newData) => {
      movieData.userRating = newData;

      moviePopupComponent.blockRatingPickers();

      api.updateMovie(movieData.id, movieData.toRAW())
      .then(() => {
        moviePopupComponent.showUserRating(evt);
        moviePopupComponent.unblockRatingPickers();
      })
      .catch(() => {
        moviePopupComponent.showChangeRatingError(evt);
      });
    };

    moviePopupComponent.onListControlToggle = (evt, stateName, stateValue) => {
      movieData[stateName] = stateValue;

      moviePopupComponent.blockControls();

      api.updateMovie(movieData.id, movieData.toRAW())
      .then(() => {
        moviePopupComponent.unblockControls();

        evt.target.checked = !evt.target.checked;
      })
      .catch(() => {
        moviePopupComponent.showControlsError(evt);
      });
    };


    fragment.appendChild(movieCardComponent.render());
  }

  container.appendChild(fragment);
};


const updateMoviesList = (criterion, moviesList, isExtra = false) => {
  moviesList.innerHTML = ``;

  loadMovies(moviesList)
    .then((movies) => {
      const moviesToShow = selectMoviesByCriterion(movies, criterion);

      createCards(moviesToShow, isExtra, moviesList);
    });
};


export {updateMoviesList};
