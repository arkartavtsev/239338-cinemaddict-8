import MovieCard from './movie-card';
import MoviePopup from './movie-popup';


const mainFilmsContainer = document.querySelector(`.films-list .films-list__container`);


export default (data, isFull = true, container = mainFilmsContainer) => {
  const fragment = document.createDocumentFragment();

  container.innerHTML = ``;

  for (const movieData of data) {
    const movieCardComponent = new MovieCard(movieData);
    const moviePopupComponent = new MoviePopup(movieData);

    movieCardComponent.isFull = isFull;
    movieCardComponent.onClick = () => {
      moviePopupComponent.render();
      document.body.appendChild(moviePopupComponent.element);
    };

    moviePopupComponent.onClick = () => {
      document.body.removeChild(moviePopupComponent.element);
      moviePopupComponent.unrender();
    };

    fragment.appendChild(movieCardComponent.render());
  }

  container.appendChild(fragment);
};
