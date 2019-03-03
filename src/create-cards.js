const FilmParamenters = {
  title: `Accused`,
  rating: `9.8`,
  year: `2018`,
  duration: `1h&nbsp;13m`,
  genre: `Comedy`,
  poster: `accused`,
  description: `A priests Romania and confront a malevolent force in the form of a demonic nun.`,
  commentsCount: 13
};


const mainFilmsContainer = document.querySelector(`.films-list .films-list__container`);


const createCardDescription = (filmParamenters) => `
  <h3 class="film-card__title">${filmParamenters.title}</h3>
  <p class="film-card__rating">${filmParamenters.rating}</p>
  <p class="film-card__info">
    <span class="film-card__year">${filmParamenters.year}</span>
    <span class="film-card__duration">${filmParamenters.duration}</span>
    <span class="film-card__genre">${filmParamenters.genre}</span>
  </p>
  <img src="./images/posters/${filmParamenters.poster}.jpg" alt="${filmParamenters.title} movie poster" class="film-card__poster">
  <p class="film-card__description">${filmParamenters.description}</p>
`;

const createCardCommentsBtn = (commentsCount) => `
  <button class="film-card__comments">${commentsCount} comments</button>
`;

const createCardControls = () => `
  <form class="film-card__controls">
    <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
    <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
    <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
  </form>
`;


const createCard = (filmParamenters, hasControls) => {
  const card = document.createElement(`article`);

  card.classList.add(`film-card`);

  card.insertAdjacentHTML(`beforeend`, createCardDescription(filmParamenters));
  card.insertAdjacentHTML(`beforeend`, createCardCommentsBtn(filmParamenters.commentsCount));

  if (hasControls) {
    card.insertAdjacentHTML(`beforeend`, createCardControls());
  } else {
    card.classList.add(`film-card--no-controls`);
  }

  return card;
};


export default (count, hasControls = true, container = mainFilmsContainer) => {
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    fragment.append(createCard(FilmParamenters, hasControls));
  }

  container.innerHTML = ``;
  container.append(fragment);
};
