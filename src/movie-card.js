import * as moment from 'moment';
import 'moment-duration-format';

import {createElement} from './util';

import Component from './component';


export default class MovieCard extends Component {
  constructor(data) {
    super();

    this._title = data.title;

    this._duration = data.duration;
    this._genre = data.genres[0];
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

    this._onAddToWatchList = null;
    this._onMarkAsWatched = null;
    this._onAddToFavorites = null;


    this._onCommentsBtnClick = this._onCommentsBtnClick.bind(this);

    this._onAddToWatchlistBtnClick = this._onAddToWatchlistBtnClick.bind(this);
    this._onMarkAsWatchedBtnClick = this._onMarkAsWatchedBtnClick.bind(this);
    this._onAddToFavoritesBtnClick = this._onAddToFavoritesBtnClick.bind(this);
  }


  _addDescription() {
    return `
      <p class="film-card__description">${this._description}</p>
    `;
  }

  _addCommentsCount() {
    return `${this._commentsCount} ${this._commentsCount === 1 ? `comment` : `comments`}`;
  }

  _addControls() {
    return `
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${this._state.isInWatchlist ? `film-card__controls-item--add-to-watchlist-active` : ``}" type="button">Add to watchlist</button>

        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${this._state.isWatched ? `film-card__controls-item--mark-as-watched-active` : ``}" type="button">Mark as watched</button>

        <button class="film-card__controls-item button film-card__controls-item--favorite ${this._state.isFavorite ? `film-card__controls-item--favorite-active` : ``}" type="button">Mark as favorite</button>
      </form>
    `.trim();
  }

  get template() {
    return `
      <article class="film-card  ${this._state.isFull ? `` : `film-card--no-controls`}">
        <h3 class="film-card__title">${this._title}</h3>
        <p class="film-card__rating">${this._rating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${moment(this._year).format(`YYYY`)}</span>
          <span class="film-card__duration">${moment.duration(this._duration, `minutes`).format(`h[h&nbsp;]m[m]`)}</span>
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

  set onAddToWatchList(fn) {
    this._onAddToWatchList = fn;
  }

  set onMarkAsWatched(fn) {
    this._onMarkAsWatched = fn;
  }

  set onAddToFavorites(fn) {
    this._onAddToFavorites = fn;
  }


  _partialRerender() {
    this._commentsBtn.textContent = this._addCommentsCount();

    if (this._state.isFull) {
      this.removeListeners();
      this._controls.remove();
      this.removeElements();

      this._controls = createElement(this._addControls());
      this._element.appendChild(this._controls);

      this.addElements();
      this.addListeners();
    }
  }

  update(data) {
    this._state.isInWatchlist = data.isInWatchlist;
    this._state.isWatched = data.isWatched;
    this._state.isFavorite = data.isFavorite;
    this._commentsCount = data.comments.length;

    if (this._element) {
      this._partialRerender();
    }
  }


  _onCommentsBtnClick() {
    const updatedData = {
      isInWatchlist: this._state.isInWatchlist,
      isWatched: this._state.isWatched,
      isFavorite: this._state.isFavorite
    };

    if (typeof this._onPopupOpen === `function`) {
      this._onPopupOpen(updatedData);
    }
  }


  _onAddToWatchlistBtnClick(evt) {
    evt.target.classList.toggle(`film-card__controls-item--add-to-watchlist-active`);
    this._state.isInWatchlist = !this._state.isInWatchlist;

    if (typeof this._onAddToWatchList === `function`) {
      this._onAddToWatchList(this._state.isInWatchlist);
    }
  }

  _onMarkAsWatchedBtnClick(evt) {
    evt.target.classList.toggle(`film-card__controls-item--mark-as-watched-active`);
    this._state.isWatched = !this._state.isWatched;

    if (typeof this._onMarkAsWatched === `function`) {
      this._onMarkAsWatched(this._state.isWatched);
    }
  }

  _onAddToFavoritesBtnClick(evt) {
    evt.target.classList.toggle(`film-card__controls-item--favorite-active`);
    this._state.isFavorite = !this._state.isFavorite;

    if (typeof this._onAddToFavorites === `function`) {
      this._onAddToFavorites(this._state.isFavorite);
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
