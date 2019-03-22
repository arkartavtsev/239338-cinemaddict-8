import {KeyCode, EMOJI_LIST, MOVIE_MAX_SCORE} from './const';

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

    this._comments = data.comments.slice();


    this._closeBtn = null;
    this._form = null;

    this._userRatingOutput = null;
    this._ratingBtns = null;

    this._commentsCount = null;
    this._commentsList = null;
    this._commentField = null;


    this._onPopupClose = null;
    this._onRatingChange = null;
    this._onCommentSend = null;


    this._onCloseBtnClick = this._onCloseBtnClick.bind(this);
    this._onRatingBtnClick = this._onRatingBtnClick.bind(this);
    this._onCommentFieldKeydown = this._onCommentFieldKeydown.bind(this);
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

  _getCommentMarkup(comment) {
    return `
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
    `;
  }

  _addComments() {
    const sortedComments = this._comments.sort((left, right) => left.date - right.date);

    return sortedComments.map((commentData) => this._getCommentMarkup(commentData)).join(` `);
  }

  _addEmojiPickers() {
    return Object.keys(EMOJI_LIST).map((emojiName) => `
      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emojiName}" value="${emojiName}"
      ${emojiName === `neutral-face` ? `checked` : ``}
      >
      <label class="film-details__emoji-label" for="emoji-${emojiName}">${EMOJI_LIST[emojiName]}</label>
    `).join(` `);
  }

  _addScorePickers() {
    let scorePickersMarkup = ``;

    for (let i = 1; i <= MOVIE_MAX_SCORE; i++) {
      scorePickersMarkup += `
        <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${i}" id="rating-${i}" ${i === this._userRating ? `checked` : ``}>
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
                  <p class="film-details__user-rating">Your rate ${this._userRating}</p>
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
            <h3 class="film-details__comments-title">
              Comments
              <span class="film-details__comments-count">${this._comments.length}</span>
            </h3>

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

  set onRatingChange(fn) {
    this._onRatingChange = fn;
  }

  set onCommentSend(fn) {
    this._onCommentSend = fn;
  }


  _onCloseBtnClick() {
    if (typeof this._onPopupClose === `function`) {
      this._onPopupClose();
    }
  }


  static createCommentMapper(target) {
    return {
      'comment': (value) => {
        target.text = value;
      },

      'comment-emoji': (value) => {
        target.emoji = EMOJI_LIST[value];
      }
    };
  }

  _processCommentData(formData) {
    const entry = {
      author: `You`,
      date: Date.now(),
      text: ``,
      emoji: ``
    };

    const commentMapper = MoviePopup.createCommentMapper(entry);

    for (const pair of formData.entries()) {
      const [property, value] = pair;

      if (commentMapper[property]) {
        commentMapper[property](value);
      }
    }

    return entry;
  }

  _addNewComment(newCommentData) {
    const commentMarkup = this._getCommentMarkup(newCommentData);

    this._comments.push(newCommentData);

    this._commentsList.insertAdjacentHTML(`beforeend`, commentMarkup);
    this._commentsCount.textContent = this._comments.length;
  }

  _onCommentFieldKeydown(evt) {
    if ((evt.ctrlKey || evt.metaKey) && evt.keyCode === KeyCode.ENTER) {
      const newCommentData = this._processCommentData(new FormData(this._form));

      this._addNewComment(newCommentData);
      evt.target.value = ``;

      if (typeof this._onPopupClose === `function`) {
        this._onCommentSend(newCommentData);
      }
    }
  }


  _onRatingBtnClick(evt) {
    this._userRating = +evt.target.value;
    this._userRatingOutput.textContent = `Your rate ${this._userRating}`;

    if (typeof this._onPopupClose === `function`) {
      this._onRatingChange(this._userRating);
    }
  }


  addElements() {
    this._closeBtn = this._element.querySelector(`.film-details__close-btn`);
    this._form = this._element.querySelector(`.film-details__inner`);

    this._userRatingOutput = this._element.querySelector(`.film-details__user-rating`);
    this._ratingBtns = this._element.querySelectorAll(`.film-details__user-rating-input`);

    this._commentsCount = this._element.querySelector(`.film-details__comments-count`);
    this._commentsList = this._element.querySelector(`.film-details__comments-list`);
    this._commentField = this._element.querySelector(`.film-details__comment-input`);
  }

  addListeners() {
    this._closeBtn.addEventListener(`click`, this._onCloseBtnClick);
    this._commentField.addEventListener(`keydown`, this._onCommentFieldKeydown);

    for (const btn of this._ratingBtns) {
      btn.addEventListener(`click`, this._onRatingBtnClick);
    }
  }


  removeElements() {
    this._closeBtn = null;
    this._form = null;

    this._userRatingOutput = null;
    this._ratingBtns = null;

    this._commentsCount = null;
    this._commentsList = null;
    this._commentField = null;
  }

  removeListeners() {
    this._closeBtn.removeEventListener(`click`, this._onCloseBtnClick);
    this._commentField.removeEventListener(`keydown`, this._onCommentFieldKeydown);

    for (const btn of this._ratingBtns) {
      btn.removeEventListener(`click`, this._onRatingBtnClick);
    }
  }
}
