import {EXTRA_MOVIES_COUNT} from './const';
import {showMessage} from './util';
import {provider} from './backend';

import {showUserRank} from './show-statistics';

import MovieCard from './movie-card';
import MoviePopup from './movie-popup';


const mainFilmsList = document.querySelector(`.films-list .films-list__container`);
const topRatedFilmsList = document.querySelector(`.films-list--top-rated .films-list__container`);
const mostCommentedFilmsList = document.querySelector(`.films-list--most-commented .films-list__container`);

const profileRankOutput = document.querySelector(`.profile__rating`);
const totalMoviesCounter = document.querySelector(`.footer__statistics p`);


let filtersCounters;

let moviesStore = [];


const selectMovies = (movies, criterion) => {
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


const createCards = (data, container, isExtra) => {
  const fragment = document.createDocumentFragment();

  container.innerHTML = ``;

  if (!data.length) {
    showMessage(`There are no suitable movies to show.`, container);

    return;
  }

  for (const movieData of data) {
    const movieCardComponent = new MovieCard(movieData);
    const moviePopupComponent = new MoviePopup(movieData);


    movieCardComponent.isFull = !isExtra;


    movieCardComponent.onPopupOpen = () => {
      moviePopupComponent.update(movieData);
      moviePopupComponent.render();

      document.body.appendChild(moviePopupComponent.element);
    };

    movieCardComponent.onListControlToggle = (evt, stateName, stateValue) => {
      movieData[stateName] = stateValue;

      movieCardComponent.blockCard();

      provider.updateMovie(movieData.id, movieData.toRAW())
      .then(() => {
        const activeFilterType = document.querySelector(`.main-navigation__item--active`).dataset.type;
        updateMoviesList(moviesStore, activeFilterType);

        const watchedMovies = selectMovies(moviesStore, `history`);
        showUserRank(watchedMovies.length, profileRankOutput);
      })
      .catch(() => {
        movieData[stateName] = !stateValue;
        movieCardComponent.showError(evt);
      });
    };


    moviePopupComponent.onPopupClose = () => {
      const activeFilterType = document.querySelector(`.main-navigation__item--active`).dataset.type;

      updateMoviesList(moviesStore, activeFilterType);
      updateMoviesList(moviesStore, `top-rated`, topRatedFilmsList, true);
      updateMoviesList(moviesStore, `most-commented`, mostCommentedFilmsList, true);

      const watchedMovies = selectMovies(moviesStore, `history`);
      showUserRank(watchedMovies.length, profileRankOutput);

      moviePopupComponent.unrender();
    };

    moviePopupComponent.onCommentSend = (newData) => {
      movieData.comments.push(newData);

      moviePopupComponent.blockCommentField();

      provider.updateMovie(movieData.id, movieData.toRAW())
      .then(() => {
        moviePopupComponent.unblockCommentField();
        moviePopupComponent.addNewComment(newData);
      })
      .catch(() => {
        movieData.comments.pop();
        moviePopupComponent.showCommentSendError();
      });
    };

    moviePopupComponent.onCommentUndo = () => {
      const commentToRemove = movieData.comments.pop();

      moviePopupComponent.blockCommentUndoBtn();

      provider.updateMovie(movieData.id, movieData.toRAW())
      .then(() => {
        moviePopupComponent.unblockCommentUndoBtn();
        moviePopupComponent.deleteComment();
      })
      .catch(() => {
        movieData.comments.push(commentToRemove);
        moviePopupComponent.showCommentUndoError();
      });
    };

    moviePopupComponent.onRatingChange = (evt, newData) => {
      const currentValue = movieData.userRating;

      movieData.userRating = newData;

      moviePopupComponent.blockRatingPickers();

      provider.updateMovie(movieData.id, movieData.toRAW())
      .then(() => {
        moviePopupComponent.unblockRatingPickers();
        moviePopupComponent.changeUserRating(evt);
      })
      .catch(() => {
        movieData.userRating = currentValue;
        moviePopupComponent.showChangeRatingError(evt);
      });
    };

    moviePopupComponent.onListControlToggle = (evt, stateName, stateValue) => {
      movieData[stateName] = stateValue;

      moviePopupComponent.blockControls();

      provider.updateMovie(movieData.id, movieData.toRAW())
      .then(() => {
        moviePopupComponent.unblockControls();
        moviePopupComponent.toggleState(stateName);

        evt.target.checked = !evt.target.checked;
      })
      .catch(() => {
        movieData[stateName] = !stateValue;
        moviePopupComponent.showControlsError(evt);
      });
    };


    fragment.appendChild(movieCardComponent.render());
  }

  container.appendChild(fragment);
};


const updateMoviesList = (movies, criterion, moviesList = mainFilmsList, isExtra = false) => {
  if (!isExtra && !filtersCounters) {
    filtersCounters = document.querySelectorAll(`.main-navigation__item-count`);
  }

  if (!isExtra) {
    for (const counter of filtersCounters) {
      counter.textContent = selectMovies(movies, counter.parentElement.dataset.type).length;
    }
  }

  if (movies.length) {
    const moviesToShow = selectMovies(movies, criterion);

    createCards(moviesToShow, moviesList, isExtra);
  }
};


const loadMovies = () => {
  showMessage(`Loading movies...`, mainFilmsList);

  return provider.getMovies()
    .catch(() => {
      showMessage(`Something went wrong while loading movies. Check your connection or try again later.`, mainFilmsList);

      return [];
    });
};


loadMovies()
  .then((movies) => {
    if (movies.length) {
      totalMoviesCounter.textContent = `${movies.length} ${movies.length === 1 ? `movie` : `movies`} inside`;

      const watchedMovies = selectMovies(movies, `history`);
      showUserRank(watchedMovies.length, profileRankOutput);

      moviesStore = movies.slice();
    }

    updateMoviesList(moviesStore, `all`, mainFilmsList);
    updateMoviesList(moviesStore, `top-rated`, topRatedFilmsList, true);
    updateMoviesList(moviesStore, `most-commented`, mostCommentedFilmsList, true);
  });


export {moviesStore, updateMoviesList};
