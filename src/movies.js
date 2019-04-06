import {Movie} from './const';
import {showMessage} from './util';

import {provider} from './backend';
import {showUserRank} from './statistic';

import MovieCard from './movie-card';
import MoviePopup from './movie-popup';


const mainFilmsList = document.querySelector(`.films-list .films-list__container`);
const topRatedFilmsList = document.querySelector(`.films-list--top-rated .films-list__container`);
const mostCommentedFilmsList = document.querySelector(`.films-list--most-commented .films-list__container`);

const loadMorebtn = document.querySelector(`.films-list__show-more`);

const profileRankOutput = document.querySelector(`.profile__rating`);
const totalMoviesCounter = document.querySelector(`.footer__statistics p`);


let searchField;
let filtersCounters;
let openedPopup;

const loadedMovies = [];
let selectedMovies = [];


const showSearchedMovies = (searchRequest) => {
  const searchedMovies = loadedMovies.filter((item) => item.title.toLowerCase().indexOf(searchRequest) !== -1);

  mainFilmsList.innerHTML = ``;
  loadMorebtn.classList.add(`visually-hidden`);

  createCards(searchedMovies);
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
      return movies.slice().sort((left, right) => right.rating - left.rating).splice(0, Movie.EXTRA_COUNT);

    case `most-commented`:
      return movies.filter((movie) => movie.comments.length).sort((left, right) => right.comments.length - left.comments.length).splice(0, Movie.EXTRA_COUNT);

    default:
      return movies;
  }
};


const updateFiltersCounters = () => {
  if (!filtersCounters) {
    filtersCounters = document.querySelectorAll(`.main-navigation__item-count`);
  }

  for (const counter of filtersCounters) {
    counter.textContent = selectMovies(loadedMovies, counter.parentElement.dataset.type).length;
  }
};


const updateBoardAfterChange = () => {
  if (!searchField) {
    searchField = document.querySelector(`.search__field`);
  }

  if (searchField.value) {
    const searchRequest = searchField.value.trim().toLowerCase();

    showSearchedMovies(searchRequest);
  } else {
    const activeFilterType = document.querySelector(`.main-navigation__item--active`).dataset.type;

    selectedMovies = selectMovies(loadedMovies, activeFilterType);

    showMovies(mainFilmsList.children.length);
  }

  updateFiltersCounters();
};

const handleWatchedStateChange = (movieData, stateValue) => {
  const watchedMovies = selectMovies(loadedMovies, `history`);
  showUserRank(watchedMovies.length, profileRankOutput);

  movieData.watchDate = stateValue === true ? Date.now() : null;
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
      updateBoardAfterChange();

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
    updateBoardAfterChange();

    updateExtraMovies(`top-rated`, topRatedFilmsList);
    updateExtraMovies(`most-commented`, mostCommentedFilmsList);

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


const showMovies = (count) => {
  const moviesToShow = selectedMovies.slice(0, count);

  mainFilmsList.innerHTML = ``;
  createCards(moviesToShow);
};


const showFilteredMovies = (criterion) => {
  if (!loadedMovies.length) {
    return;
  }

  selectedMovies = selectMovies(loadedMovies, criterion);

  if (selectedMovies.length <= Movie.SHOW_PORTION) {
    loadMorebtn.classList.add(`visually-hidden`);
  } else {
    loadMorebtn.classList.remove(`visually-hidden`);
  }

  showMovies(Movie.SHOW_PORTION);
};


const updateExtraMovies = (type, moviesList) => {
  const extraMovies = selectMovies(loadedMovies, type);

  moviesList.innerHTML = ``;
  createCards(extraMovies, moviesList, false);
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

      for (const movie of movies) {
        loadedMovies.push(movie);
      }

      updateFiltersCounters();
      showFilteredMovies(`all`);
    }

    updateExtraMovies(`top-rated`, topRatedFilmsList);
    updateExtraMovies(`most-commented`, mostCommentedFilmsList);
  });


const onLoadMoreBtnClick = () => {
  const renderedCardsCount = mainFilmsList.children.length;
  const moviesToShow = selectedMovies.slice(renderedCardsCount, renderedCardsCount + Movie.SHOW_PORTION);

  if (renderedCardsCount + Movie.SHOW_PORTION >= selectedMovies.length) {
    loadMorebtn.classList.add(`visually-hidden`);
  }

  createCards(moviesToShow);
};

loadMorebtn.addEventListener(`click`, onLoadMoreBtnClick);


export {
  loadedMovies,
  showFilteredMovies,
  showSearchedMovies};
