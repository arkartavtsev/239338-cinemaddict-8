const mainFilmsContainer = document.querySelector(`.films-list .films-list__container`);


const addDuration = (duration) => {
  const hours = Math.trunc(duration / 60);
  const minutes = duration - hours * 60;

  return `${hours}h&nbsp;${minutes}m`;
};

const addDescription = (description) => `
  <p class="film-card__description">${description}</p>
`;

const addControls = () => `
  <form class="film-card__controls">
    <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
    <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
    <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
  </form>
`;


const createMovieCard = (movieData, isFull) => `
  <article class="film-card  ${isFull ? `` : `film-card--no-controls`}">
    <h3 class="film-card__title">${movieData.title}</h3>
    <p class="film-card__rating">${movieData.rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${movieData.year}</span>
      <span class="film-card__duration">${addDuration(movieData.duration)}</span>
      <span class="film-card__genre">${movieData.genre}</span>
    </p>
    <img src="${movieData.posterUrl}" alt="${movieData.title} movie poster" class="film-card__poster">

    ${isFull ? addDescription(movieData.description) : ``}

    <button class="film-card__comments">${movieData.commentsCount} ${movieData.commentsCount === 1 ? `comment` : `comments`}</button>

    ${isFull ? addControls() : ``}
  </article>
`;


export default (data, isFull = true, container = mainFilmsContainer) => {
  container.innerHTML = data.map((movieData) => createMovieCard(movieData, isFull)).join(``);
};
