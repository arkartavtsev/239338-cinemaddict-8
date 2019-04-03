import * as moment from 'moment';

import {ERROR_ANIMATION_TIMEOUT, MOVIE_CARD_DESCRIPTION_MAX_LENGTH} from './const';

import Component from './component';


export default class MovieCard extends Component {
  constructor(data) {
    super();

    this._id = data.id;

    this._title = data.title;

    this._duration = data.duration;
    this._genre = data.genres[0] || ``;
    this._description = data.description;
    this._posterUrl = data.posterUrl;

    this._rating = data.rating;

    this._year = data.releaseDate;

    this._commentsCount = data.comments.length;


    this._state = {
      isInWatchlist: data.isInWatchlist,
      isWatched: data.isWatched,
      isFavorite: data.isFavorite,

      isFull: true
    };


    this._commentsBtn = null;

    this._controls = null;
    this._addToWatchlistBtn = null;
    this._markAsWatchedBtn = null;
    this._addToFavoritesBtn = null;


    this._onPopupOpen = null;
    this._onListControlToggle = null;


    this._onCommentsBtnClick = this._onCommentsBtnClick.bind(this);

    this._onAddToWatchlistBtnClick = this._onAddToWatchlistBtnClick.bind(this);
    this._onMarkAsWatchedBtnClick = this._onMarkAsWatchedBtnClick.bind(this);
    this._onAddToFavoritesBtnClick = this._onAddToFavoritesBtnClick.bind(this);
  }


  _addDescription() {
    return `
      <p class="film-card__description">
        ${this._description.length <= MOVIE_CARD_DESCRIPTION_MAX_LENGTH ? this._description : `${this._description.slice(0, MOVIE_CARD_DESCRIPTION_MAX_LENGTH)}...`}
      </p>
    `;
  }

  _addCommentsCount() {
    return `${this._commentsCount} ${this._commentsCount === 1 ? `comment` : `comments`}`;
  }

  _addControls() {
    return `
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${this._state.isInWatchlist ? `film-card__controls-item--active` : ``}" type="button">Add to watchlist</button>

        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${this._state.isWatched ? `film-card__controls-item--active` : ``}" type="button">Mark as watched</button>

        <button class="film-card__controls-item button film-card__controls-item--favorite ${this._state.isFavorite ? `film-card__controls-item--active` : ``}" type="button">Mark as favorite</button>
      </form>
    `.trim();
  }


  get template() {
    return `
      <article class="film-card ${this._state.isFull ? `` : `film-card--no-controls`}">
        <h3 class="film-card__title">${this._title}</h3>
        <p class="film-card__rating">${this._rating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${moment(this._year).format(`YYYY`)}</span>
          <span class="film-card__duration">
            ${moment.duration(this._duration, `minutes`).hours()}h&nbsp;
            ${moment.duration(this._duration, `minutes`).minutes()}m
          </span>
          <span class="film-card__genre">${this._genre}</span>
        </p>
        <img src="${this._posterUrl}" alt="${this._title} movie poster" class="film-card__poster">

        ${this._state.isFull ? this._addDescription() : ``}

        <button class="film-card__comments">${this._addCommentsCount()}</button>

        ${this._state.isFull ? this._addControls() : ``}
      </article>
    `.trim();
  }


  set isFull(state) {
    this._state.isFull = state;
  }


  set onPopupOpen(fn) {
    this._onPopupOpen = fn;
  }

  set onListControlToggle(fn) {
    this._onListControlToggle = fn;
  }


  blockCard() {
    this._addToWatchlistBtn.disabled = true;
    this._markAsWatchedBtn.disabled = true;
    this._addToFavoritesBtn.disabled = true;
  }

  unblockCard() {
    this._addToWatchlistBtn.disabled = false;
    this._markAsWatchedBtn.disabled = false;
    this._addToFavoritesBtn.disabled = false;
  }

  showError(evt) {
    this._controls.classList.add(`shake`);
    evt.target.classList.add(`film-card__controls-item--error`);

    setTimeout(() => {
      this._controls.classList.remove(`shake`);
      evt.target.classList.remove(`film-card__controls-item--error`);

      this.unblockCard();
    }, ERROR_ANIMATION_TIMEOUT);
  }


  _onCommentsBtnClick() {
    if (typeof this._onPopupOpen === `function`) {
      this._onPopupOpen();
    }
  }


  _onAddToWatchlistBtnClick(evt) {
    if (typeof this._onListControlToggle === `function`) {
      this._onListControlToggle(evt, `isInWatchlist`, !this._state.isInWatchlist);
    }
  }

  _onMarkAsWatchedBtnClick(evt) {
    if (typeof this._onListControlToggle === `function`) {
      this._onListControlToggle(evt, `isWatched`, !this._state.isWatched);
    }
  }

  _onAddToFavoritesBtnClick(evt) {
    if (typeof this._onListControlToggle === `function`) {
      this._onListControlToggle(evt, `isFavorite`, !this._state.isFavorite);
    }
  }


  addElements() {
    this._commentsBtn = this._element.querySelector(`.film-card__comments`);

    if (this._state.isFull) {
      this._controls = this._element.querySelector(`.film-card__controls`);
      this._addToWatchlistBtn = this._element.querySelector(`.film-card__controls-item--add-to-watchlist`);
      this._markAsWatchedBtn = this._element.querySelector(`.film-card__controls-item--mark-as-watched`);
      this._addToFavoritesBtn = this._element.querySelector(`.film-card__controls-item--favorite`);
    }
  }

  addListeners() {
    this._commentsBtn.addEventListener(`click`, this._onCommentsBtnClick);

    if (this._state.isFull) {
      this._addToWatchlistBtn.addEventListener(`click`, this._onAddToWatchlistBtnClick);
      this._markAsWatchedBtn.addEventListener(`click`, this._onMarkAsWatchedBtnClick);
      this._addToFavoritesBtn.addEventListener(`click`, this._onAddToFavoritesBtnClick);
    }
  }


  removeElements() {
    this._commentsBtn = null;

    if (this._state.isFull) {
      this._controls = null;
      this._addToWatchlistBtn = null;
      this._markAsWatchedBtn = null;
      this._addToFavoritesBtn = null;
    }
  }

  removeListeners() {
    this._commentsBtn.removeEventListener(`click`, this._onCommentsBtnClick);

    if (this._state.isFull) {
      this._addToWatchlistBtn.removeEventListener(`click`, this._onAddToWatchlistBtnClick);
      this._markAsWatchedBtn.removeEventListener(`click`, this._onMarkAsWatchedBtnClick);
      this._addToFavoritesBtn.removeEventListener(`click`, this._onAddToFavoritesBtnClick);
    }
  }
}
