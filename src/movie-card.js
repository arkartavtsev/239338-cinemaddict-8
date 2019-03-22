import * as moment from 'moment';
import 'moment-duration-format';

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
      isFull: true
    };


    this._commentsBtn = null;


    this._onPopupOpen = null;
    this._onCommentsBtnClick = this._onCommentsBtnClick.bind(this);
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
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
      </form>
    `;
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


  update(data) {
    this._commentsCount = data.comments.length;
    this._commentsBtn.textContent = this._addCommentsCount();
  }


  _onCommentsBtnClick() {
    if (typeof this._onPopupOpen === `function`) {
      this._onPopupOpen();
    }
  }


  addElements() {
    this._commentsBtn = this._element.querySelector(`.film-card__comments`);
  }

  addListeners() {
    this._commentsBtn.addEventListener(`click`, this._onCommentsBtnClick);
  }


  removeElements() {
    this._commentsBtn = null;
  }

  removeListeners() {
    this._commentsBtn.removeEventListener(`click`, this._onCommentsBtnClick);
  }
}
