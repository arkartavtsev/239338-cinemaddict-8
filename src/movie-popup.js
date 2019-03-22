import {EMOJI_LIST, MOVIE_MAX_SCORE} from './const';

import Component from './component';


export default class MoviePopup extends Component {
  constructor(data) {
    super();

    this._title = data.title;
    this._originalTitle = data.originalTitle;

    this._duration = data.duration;
    this._genres = data.genres;
    this._description = data.description;
    this._posterUrl = data.posterUrl;

    this._rating = data.rating;
    this._userRating = data.userRating;

    this._ageRating = data.ageRating;

    this._releaseDate = data.releaseDate;
    this._country = data.country;

    this._director = data.director;
    this._writers = data.writers;
    this._actors = data.actors;

    this._comments = data.comments;

    this._onPopupClose = null;
    this._onCloseBtnClick = this._onCloseBtnClick.bind(this);
  }


  _addReleaseDate() {
    const options = {
      day: `numeric`,
      month: `long`,
      year: `numeric`
    };

    return new Date(this._releaseDate).toLocaleString(`en-GB`, options);
  }

  _addGenres() {
    return this._genres.map((genre) => `
      <span class="film-details__genre">${genre}</span>
    `).join(` `);
  }

  _addCommentAge(date) {
    const days = Math.trunc((Date.now() - date) / (24 * 60 * 60 * 1000));

    let months;
    let years;

    let result;

    if (days) {
      result = days === 1 ? `a day` : `${days} days`;
    } else {
      result = `less a day`;
    }

    if (days >= 30) {
      months = Math.trunc(days / 30);

      result = months === 1 ? `a month` : `${months} months`;
    }

    if (months >= 12) {
      years = Math.trunc(months / 12);

      result = years === 1 ? `a year` : `${years} years`;
    }

    return result;
  }

  _addComments() {
    const comments = this._comments.slice().sort((left, right) => right.date - left.date);

    return comments.map((comment) => `
      <li class="film-details__comment">
        <span class="film-details__comment-emoji">${comment.emoji}</span>
        <div>
          <p class="film-details__comment-text">${comment.text}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${comment.author}</span>
            <span class="film-details__comment-day">${this._addCommentAge(comment.date)} ago</span>
          </p>
        </div>
      </li>
    `).join(` `);
  }

  _addEmojiPickers() {
    return Object.keys(EMOJI_LIST).map((emojiName) => `
      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emojiName}" value="${emojiName}">
      <label class="film-details__emoji-label" for="emoji-${emojiName}">${EMOJI_LIST[emojiName]}</label>
    `).join(` `);
  }

  _addScorePickers() {
    let scorePickersMarkup = ``;

    for (let i = 1; i <= MOVIE_MAX_SCORE; i++) {
      scorePickersMarkup += `
        <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${i}" id="rating-${i}" ${i === Math.ceil(MOVIE_MAX_SCORE / 2) ? `checked` : ``}>
        <label class="film-details__user-rating-label" for="rating-${i}">${i}</label>
      `;
    }

    return scorePickersMarkup;
  }

  get template() {
    return `
      <section class="film-details">
        <form class="film-details__inner" action="" method="get">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${this._posterUrl}" alt="${this._title} movie poster">

              <p class="film-details__age">${this._ageRating}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${this._title}</h3>
                  <p class="film-details__title-original">Original: ${this._originalTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${this._rating}</p>
                  <p class="film-details__user-rating">Your rate 8</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${this._director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${this._writers.join(`, `)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${this._actors.join(`, `)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${this._addReleaseDate()} (${this._country})</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${this._duration} min</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${this._country}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Genres</td>
                  <td class="film-details__cell">
                    ${this._addGenres()}
                  </td>
                </tr>
              </table>

              <p class="film-details__film-description">${this._description}</p>
            </div>
          </div>

          <section class="film-details__controls">
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist">
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" checked>
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite">
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>

          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this._comments.length}</span></h3>

            <ul class="film-details__comments-list">
              ${this._addComments()}
            </ul>

            <div class="film-details__new-comment">
              <div>
                <label for="add-emoji" class="film-details__add-emoji-label">${EMOJI_LIST[`neutral-face`]}</label>
                <input type="checkbox" class="film-details__add-emoji visually-hidden" id="add-emoji">

                <div class="film-details__emoji-list">
                  ${this._addEmojiPickers()}
                </div>
              </div>
              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="← Select reaction, add comment here" name="comment"></textarea>
              </label>
            </div>
          </section>

          <section class="film-details__user-rating-wrap">
            <div class="film-details__user-rating-controls">
              <span class="film-details__watched-status film-details__watched-status--active">Already watched</span>
              <button class="film-details__watched-reset" type="button">undo</button>
            </div>

            <div class="film-details__user-score">
              <div class="film-details__user-rating-poster">
                <img src="${this._posterUrl}" alt="${this._title} movie poster" class="film-details__user-rating-img">
              </div>

              <section class="film-details__user-rating-inner">
                <h3 class="film-details__user-rating-title">${this._title}</h3>

                <p class="film-details__user-rating-feelings">How you feel it?</p>

                <div class="film-details__user-rating-score">
                  ${this._addScorePickers()}
                </div>
              </section>
            </div>
          </section>
        </form>
      </section>
    `.trim();
  }


  set onPopupClose(fn) {
    this._onPopupClose = fn;
  }

  _onCloseBtnClick() {
    if (typeof this._onPopupClose === `function`) {
      this._onPopupClose();
    }
  }


  addListeners() {
    this._element.querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, this._onCloseBtnClick);
  }

  removeListeners() {
    this._element.querySelector(`.film-details__close-btn`)
      .removeEventListener(`click`, this._onCloseBtnClick);
  }
}
