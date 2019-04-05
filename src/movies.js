import {EXTRA_MOVIES_COUNT} from './const';
import {showMessage} from './util';
import {provider} from './backend';

import {showUserRank} from './show-statistics';

import MovieCard from './movie-card';
import MoviePopup from './movie-popup';


const mainFilmsList = document.querySelector(`.films-list .films-list__container`);
const topRatedFilmsList = document.querySelector(`.films-list--top-rated .films-list__container`);
const mostCommentedFilmsList = document.querySelector(`.films-list--most-commented .films-list__container`);

const loadMorebtn = document.querySelector(`.films-list__show-more`);

const profileRankOutput = document.querySelector(`.profile__rating`);
const totalMoviesCounter = document.querySelector(`.footer__statistics p`);


let filtersCounters;
let openedPopup;

let moviesStore = [];
let moviesToShow = [];


const stateToFilterName = {
  isInWatchlist: `watchlist`,
  isWatched: `history`,
  isFavorite: `favorites`
};


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


const handleWatchedStateChange = (movieData, stateValue) => {
  const watchedMovies = selectMovies(moviesStore, `history`);
  showUserRank(watchedMovies.length, profileRankOutput);

  if (stateValue === true) {
    movieData.watchDate = Date.now();
  } else {
    delete movieData.watchDate;
  }
};

const updateFiltersCounters = () => {
  if (!filtersCounters) {
    filtersCounters = document.querySelectorAll(`.main-navigation__item-count`);
  }

  for (const counter of filtersCounters) {
    counter.textContent = selectMovies(moviesStore, counter.parentElement.dataset.type).length;
  }
};


const createMovie = (movieData, isFull) => {
  const movieCardComponent = new MovieCard(movieData);
  const moviePopupComponent = new MoviePopup(movieData);


  movieCardComponent.isFull = isFull;

  movieCardComponent.onPopupOpen = () => {
    if (openedPopup === moviePopupComponent) {
      return;
    }

    if (openedPopup) {
      openedPopup.unrender();
    }

    openedPopup = moviePopupComponent;
    moviePopupComponent.update(movieData);

    const popupElement = moviePopupComponent.render();
    document.body.appendChild(popupElement);
  };

  movieCardComponent.onListControlToggle = (evt, stateName, stateValue) => {
    movieData[stateName] = stateValue;

    movieCardComponent.blockCard();

    provider.updateMovie(movieData.id, movieData.toRAW())
    .then(() => {
      movieCardComponent.unblockCard();
      movieCardComponent.toggleState(evt, stateName);

      if (document.querySelector(`.main-navigation__item--active`).dataset.type === stateToFilterName[stateName]) {
        movieCardComponent.unrender();

        if (!mainFilmsList.children.length) {
          showMessage(`There are no suitable movies to show.`, mainFilmsList);
        }
      }

      updateFiltersCounters();

      if (stateName === `isWatched`) {
        handleWatchedStateChange(movieData, stateValue);
      }
    })
    .catch(() => {
      movieData[stateName] = !stateValue;
      movieCardComponent.showError(evt);
    });
  };


  moviePopupComponent.onPopupClose = () => {
    const oldCardElement = mainFilmsList.querySelector(`[data-id="${moviePopupComponent._id}"]`);

    const updatedMovieCardComponent = new MovieCard(movieData);
    const newCardElement = updatedMovieCardComponent.render();

    mainFilmsList.replaceChild(newCardElement, oldCardElement);

    updateExtraMovies(moviesStore, `top-rated`, topRatedFilmsList);
    updateExtraMovies(moviesStore, `most-commented`, mostCommentedFilmsList);

    updateFiltersCounters();

    moviePopupComponent.unrender();
    openedPopup = null;
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

      if (stateName === `isWatched`) {
        handleWatchedStateChange(movieData, stateValue);
      }

      evt.target.checked = !evt.target.checked;
    })
    .catch(() => {
      movieData[stateName] = !stateValue;
      moviePopupComponent.showControlsError(evt);
    });
  };


  return movieCardComponent.render();
};


const createCards = (data, container = mainFilmsList, isFull = true) => {
  const fragment = document.createDocumentFragment();

  if (!data.length) {
    showMessage(`There are no suitable movies to show.`, container);

    return;
  }

  for (const movieData of data) {
    const movieElement = createMovie(movieData, isFull);

    fragment.appendChild(movieElement);
  }

  container.appendChild(fragment);
};


const updateMoviesList = (movies, criterion) => {
  updateFiltersCounters();

  if (movies.length) {
    moviesToShow = selectMovies(movies, criterion);

    if (moviesToShow.length <= 5) {
      loadMorebtn.classList.add(`visually-hidden`);
    } else {
      loadMorebtn.classList.remove(`visually-hidden`);
    }

    mainFilmsList.innerHTML = ``;
    createCards(moviesToShow.slice(0, 5));
  }
};


const updateExtraMovies = (movies, criterion, moviesList) => {
  moviesList.innerHTML = ``;

  if (movies.length) {
    const extraMovies = selectMovies(movies, criterion);

    createCards(extraMovies, moviesList, false);
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

    updateExtraMovies(moviesStore, `top-rated`, topRatedFilmsList);
    updateExtraMovies(moviesStore, `most-commented`, mostCommentedFilmsList);
  });


const onLoadMoreBtnClick = () => {
  const renderedCardsCount = mainFilmsList.children.length;
  const toshow = moviesToShow.slice(renderedCardsCount, renderedCardsCount + 5);

  if (renderedCardsCount + 5 >= moviesToShow.length) {
    loadMorebtn.classList.add(`visually-hidden`);
  }

  createCards(toshow);
};

loadMorebtn.addEventListener(`click`, onLoadMoreBtnClick);


export {moviesStore, updateMoviesList, createCards};
