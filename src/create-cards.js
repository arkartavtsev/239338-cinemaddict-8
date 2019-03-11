import MovieCard from './movie-card';


const mainFilmsContainer = document.querySelector(`.films-list .films-list__container`);


export default (data, isFull = true, container = mainFilmsContainer) => {
  const fragment = document.createDocumentFragment();

  container.innerHTML = ``;

  for (const movieData of data) {
    const movieCardComponent = new MovieCard(movieData);

    movieCardComponent.isFull = isFull;
    movieCardComponent.onClick = () => {
      console.log(movieCardComponent);
    }

    fragment.appendChild(movieCardComponent.render(isFull));
  }

  container.appendChild(fragment);
};
