import MovieCard from './movie-card';
import MoviePopup from './movie-popup';


const mainFilmsContainer = document.querySelector(`.films-list .films-list__container`);


const updateMovieData = (data, currentMovie, newData) => {
  const index = data.findIndex((movie) => movie === currentMovie);

  data[index] = Object.assign({}, currentMovie, newData);

  return data[index];
};


export default (data, isFull = true, container = mainFilmsContainer) => {
  const fragment = document.createDocumentFragment();

  container.innerHTML = ``;

  for (const movieData of data) {
    const movieCardComponent = new MovieCard(movieData);
    const moviePopupComponent = new MoviePopup(movieData);


    movieCardComponent.isFull = isFull;

    movieCardComponent.onPopupOpen = (newData) => {
      const updatedData = updateMovieData(data, movieData, newData);

      moviePopupComponent.update(updatedData);
      moviePopupComponent.render();
      document.body.appendChild(moviePopupComponent.element);
    };

    movieCardComponent.onAddToWatchList = (newData) => {
      movieData.isInWatchlist = newData;
    };

    movieCardComponent.onMarkAsWatched = (newData) => {
      movieData.isWatched = newData;
    };

    movieCardComponent.onAddToFavorites = (newData) => {
      movieData.isFavorite = newData;
    };


    moviePopupComponent.onPopupClose = (newData) => {
      const updatedData = updateMovieData(data, movieData, newData);

      movieCardComponent.update(updatedData);
      moviePopupComponent.unrender();
    };

    moviePopupComponent.onRatingChange = (newData) => {
      movieData.userRating = newData;
    };

    moviePopupComponent.onCommentSend = (newData) => {
      movieData.comments.push(newData);
    };

    moviePopupComponent.onAddToWatchList = (newData) => {
      movieData.isInWatchlist = newData;
    };

    moviePopupComponent.onMarkAsWatched = (newData) => {
      movieData.isWatched = newData;
    };

    moviePopupComponent.onAddToFavorites = (newData) => {
      movieData.isFavorite = newData;
    };


    fragment.appendChild(movieCardComponent.render());
  }

  container.appendChild(fragment);
};
