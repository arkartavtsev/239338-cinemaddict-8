import * as moment from 'moment';

import {KeyCode, EMOJI_LIST, MOVIE_MAX_SCORE, ERROR_ANIMATION_TIMEOUT} from './const';

import Component from './component';


export default class MoviePopup extends Component {
  constructor(data) {
    super();

    this._id = data.id;

    this._title = data.title;
    this._originalTitle = data.originalTitle;

    this._duration = data.duration;
    this._genres = data.genres;
    this._description = data.description;
    this._posterUrl = data.posterUrl;

    this._rating = data.rating;
    this._userRating = Math.round(data.userRating);

    this._ageRating = data.ageRating;

    this._releaseDate = data.releaseDate;
    this._country = data.country;

    this._director = data.director;
    this._writers = data.writers;
    this._actors = data.actors;

    this._comments = data.comments.slice();


    this._state = {
      isInWatchlist: data.isInWatchlist,
      isWatched: data.isWatched,
      isFavorite: data.isFavorite
    };


    this._closeBtn = null;
    this._form = null;

    this._userRatingOutput = null;
    this._ratingBtnsWrapper = null;
    this._ratingBtns = null;

    this._listsControls = null;
    this._addToWatchlistBtn = null;
    this._markAsWatchedBtn = null;
    this._addToFavoritesBtn = null;

    this._commentsCount = null;
    this._commentsList = null;
    this._commentField = null;
    this._addEmojiBtn = null;

    this._commentUndoBtnWrapper = null;
    this._commentUndoBtn = null;
    this._movieStatusOutput = null;


    this._onPopupClose = null;
    this._onRatingChange = null;
    this._onCommentSend = null;
    this._onCommentUndo = null;
    this._onListControlToggle = null;


    this._onCloseBtnClick = this._onCloseBtnClick.bind(this);
    this._onRatingBtnClick = this._onRatingBtnClick.bind(this);
    this._onCommentFieldKeydown = this._onCommentFieldKeydown.bind(this);
    this._onCommentUndoBtnClick = this._onCommentUndoBtnClick.bind(this);

    this._onAddToWatchlistBtnClick = this._onAddToWatchlistBtnClick.bind(this);
    this._onMarkAsWatchedBtnClick = this._onMarkAsWatchedBtnClick.bind(this);
    this._onAddToFavoritesBtnClick = this._onAddToFavoritesBtnClick.bind(this);
  }


  _addGenres() {
    return this._genres.length ?
      this._genres.map((genre) => `
      <span class="film-details__genre">${genre}</span>
      `).join(` `)
      :
      `&#8212;`;
  }

  _getCommentMarkup(comment) {
    return `
      <li class="film-details__comment">
        <span class="film-details__comment-emoji">${EMOJI_LIST[comment.emotion]}</span>
        <div>
          <p class="film-details__comment-text">${comment.text}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${comment.author}</span>
            <span class="film-details__comment-day">${moment(comment.date).toNow(true)} ago</span>
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

  _getMovieStatus() {
    if (this._state.isWatched) {
      return `Already watched`;
    } else if (this._state.isInWatchlist) {
      return `Will watch`;
    } else {
      return `Not watched`;
    }
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
                  <td class="film-details__cell">${this._writers.length ? this._writers.join(`, `) : `&#8212;`}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${this._actors.length ? this._actors.join(`, `) : `&#8212;`}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${moment(this._releaseDate).format(`D MMMM YYYY`)} (${this._country})</td>
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
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist"
            ${this._state.isInWatchlist ? `checked` : ``}
            >
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">
              ${this._state.isInWatchlist ? `Added to watchlist` : `Add to watchlist`}
            </label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched"
            ${this._state.isWatched ? `checked` : ``}
            >
            <label for="watched" class="film-details__control-label film-details__control-label--watched">
              ${this._state.isWatched ? `Already watched` : `Mark as watched`}
            </label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite"
            ${this._state.isFavorite ? `checked` : ``}
            >
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">
              ${this._state.isFavorite ? `Added to favorites` : `Add to favorites`}
            </label>
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
            <div class="film-details__user-rating-controls visually-hidden">
              <span class="film-details__watched-status ${this._state.isInWatchlist || this._state.isWatched ? `film-details__watched-status--active` : ``}">
                ${this._getMovieStatus()}
              </span>
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

  set onCommentUndo(fn) {
    this._onCommentUndo = fn;
  }

  set onListControlToggle(fn) {
    this._onListControlToggle = fn;
  }


  update(data) {
    this._state.isInWatchlist = data.isInWatchlist;
    this._state.isWatched = data.isWatched;
    this._state.isFavorite = data.isFavorite;
  }


  _onCloseBtnClick() {
    if (typeof this._onPopupClose === `function`) {
      this._onPopupClose();
    }
  }


  blockCommentField() {
    this._commentField.disabled = true;
  }

  unblockCommentField() {
    this._commentField.disabled = false;
  }

  showCommentSendError() {
    this._commentField.classList.add(`shake`);
    this._commentField.style.borderColor = `red`;

    setTimeout(() => {
      this._commentField.classList.remove(`shake`);

      this.unblockCommentField();
      this._commentField.focus();
    }, ERROR_ANIMATION_TIMEOUT);
  }

  _restoreCommentForm() {
    this._commentField.value = ``;
    this._addEmojiBtn.checked = false;
  }

  addNewComment(newCommentData) {
    const commentMarkup = this._getCommentMarkup(newCommentData);

    this._comments.push(newCommentData);

    this._commentsList.insertAdjacentHTML(`beforeend`, commentMarkup);
    this._commentsCount.textContent = this._comments.length;

    this._restoreCommentForm();
    this._commentUndoBtnWrapper.classList.remove(`visually-hidden`);
  }

  static createCommentMapper(target) {
    return {
      'comment': (value) => {
        target.text = value;
      },

      'comment-emoji': (value) => {
        target.emotion = value;
      }
    };
  }

  _processCommentData(formData) {
    const entry = {
      author: `You`,
      date: Date.now(),
      text: ``,
      emotion: ``
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

  _onCommentFieldKeydown(evt) {
    if ((evt.ctrlKey || evt.metaKey) && evt.keyCode === KeyCode.ENTER) {
      const newCommentData = this._processCommentData(new FormData(this._form));

      if (typeof this._onCommentSend === `function`) {
        this._onCommentSend(newCommentData);
      }
    }
  }


  blockCommentUndoBtn() {
    this._commentUndoBtn.disabled = true;
  }

  unblockCommentUndoBtn() {
    this._commentUndoBtn.disabled = false;
  }

  showCommentUndoError() {
    this._commentUndoBtn.classList.add(`shake`);
    this._commentUndoBtn.style.color = `red`;

    setTimeout(() => {
      this._commentUndoBtn.classList.remove(`shake`);
      this._commentUndoBtn.style.color = ``;

      this.unblockCommentUndoBtn();
      this._commentField.focus();
    }, ERROR_ANIMATION_TIMEOUT);
  }

  deleteComment() {
    this._comments.pop();

    this._commentsList.lastElementChild.remove();
    this._commentsCount.textContent = this._comments.length;

    this._commentUndoBtnWrapper.classList.add(`visually-hidden`);
  }

  _onCommentUndoBtnClick() {
    if (typeof this._onCommentUndo === `function`) {
      this._onCommentUndo();
    }
  }


  blockRatingPickers() {
    for (const btn of this._ratingBtns) {
      btn.disabled = true;
    }
  }

  unblockRatingPickers() {
    for (const btn of this._ratingBtns) {
      btn.disabled = false;
    }
  }

  showChangeRatingError(evt) {
    const currentBtn = this._ratingBtnsWrapper.querySelector(`[for="${evt.target.id}"]`);

    this._ratingBtnsWrapper.classList.add(`shake`);
    currentBtn.style.backgroundColor = `red`;

    setTimeout(() => {
      this._ratingBtnsWrapper.classList.remove(`shake`);
      currentBtn.style.backgroundColor = ``;

      this.unblockRatingPickers();
    }, ERROR_ANIMATION_TIMEOUT);
  }

  changeUserRating(evt) {
    evt.target.checked = true;
    this._userRating = +evt.target.value;

    this._userRatingOutput.textContent = `Your rate ${this._userRating}`;
  }

  _onRatingBtnClick(evt) {
    evt.preventDefault();

    if (typeof this._onPopupClose === `function`) {
      this._onRatingChange(evt, +evt.target.value);
    }
  }


  blockControls() {
    this._addToWatchlistBtn.disabled = true;
    this._markAsWatchedBtn.disabled = true;
    this._addToFavoritesBtn.disabled = true;
  }

  unblockControls() {
    this._addToWatchlistBtn.disabled = false;
    this._markAsWatchedBtn.disabled = false;
    this._addToFavoritesBtn.disabled = false;
  }

  showControlsError(evt) {
    const control = this._listsControls.querySelector(`[for="${evt.target.id}"]`);

    this._listsControls.classList.add(`shake`);
    control.style.color = `red`;

    setTimeout(() => {
      this._listsControls.classList.remove(`shake`);
      control.style.color = ``;

      this.unblockControls();
    }, ERROR_ANIMATION_TIMEOUT);
  }

  toggleState(stateName) {
    this._state[stateName] = !this._state[stateName];

    if (stateName === `isInWatchlist`) {
      this._listsControls.querySelector(`[for="${this._addToWatchlistBtn.id}"]`).textContent = this._state[stateName] ? `Added to watchlist` : `Add to watchlist`;
    }

    if (stateName === `isWatched`) {
      this._listsControls.querySelector(`[for="${this._markAsWatchedBtn.id}"]`).textContent = this._state[stateName] ? `Already watched` : `Mark as watched`;
    }

    if (stateName === `isFavorite`) {
      this._listsControls.querySelector(`[for="${this._addToFavoritesBtn.id}"]`).textContent = this._state[stateName] ? `Added to favorites` : `Add to favorites`;
    }

    this._movieStatusOutput.textContent = this._getMovieStatus();

    if (this._state.isInWatchlist || this._state.isWatched) {
      this._movieStatusOutput.classList.add(`film-details__watched-status--active`);
    } else {
      this._movieStatusOutput.classList.remove(`film-details__watched-status--active`);
    }
  }

  _onAddToWatchlistBtnClick(evt) {
    evt.preventDefault();

    if (typeof this._onListControlToggle === `function`) {
      this._onListControlToggle(evt, `isInWatchlist`, !this._state.isInWatchlist);
    }
  }

  _onMarkAsWatchedBtnClick(evt) {
    evt.preventDefault();

    if (typeof this._onListControlToggle === `function`) {
      this._onListControlToggle(evt, `isWatched`, !this._state.isWatched);
    }
  }

  _onAddToFavoritesBtnClick(evt) {
    evt.preventDefault();

    if (typeof this._onListControlToggle === `function`) {
      this._onListControlToggle(evt, `isFavorite`, !this._state.isFavorite);
    }
  }


  addElements() {
    this._closeBtn = this._element.querySelector(`.film-details__close-btn`);
    this._form = this._element.querySelector(`.film-details__inner`);

    this._userRatingOutput = this._element.querySelector(`.film-details__user-rating`);
    this._ratingBtnsWrapper = this._element.querySelector(`.film-details__user-rating-score`);
    this._ratingBtns = this._ratingBtnsWrapper.querySelectorAll(`.film-details__user-rating-input`);

    this._listsControls = this._element.querySelector(`.film-details__controls`);
    this._addToWatchlistBtn = this._listsControls.querySelector(`#watchlist`);
    this._markAsWatchedBtn = this._listsControls.querySelector(`#watched`);
    this._addToFavoritesBtn = this._listsControls.querySelector(`#favorite`);

    this._commentsCount = this._element.querySelector(`.film-details__comments-count`);
    this._commentsList = this._element.querySelector(`.film-details__comments-list`);
    this._commentField = this._element.querySelector(`.film-details__comment-input`);
    this._addEmojiBtn = this._element.querySelector(`.film-details__add-emoji`);

    this._commentUndoBtnWrapper = this._element.querySelector(`.film-details__user-rating-controls`);
    this._commentUndoBtn = this._commentUndoBtnWrapper.querySelector(`.film-details__watched-reset`);
    this._movieStatusOutput = this._commentUndoBtnWrapper.querySelector(`.film-details__watched-status`);
  }

  addListeners() {
    this._closeBtn.addEventListener(`click`, this._onCloseBtnClick);
    this._commentField.addEventListener(`keydown`, this._onCommentFieldKeydown);
    this._commentUndoBtn.addEventListener(`click`, this._onCommentUndoBtnClick);

    this._addToWatchlistBtn.addEventListener(`click`, this._onAddToWatchlistBtnClick);
    this._markAsWatchedBtn.addEventListener(`click`, this._onMarkAsWatchedBtnClick);
    this._addToFavoritesBtn.addEventListener(`click`, this._onAddToFavoritesBtnClick);

    for (const btn of this._ratingBtns) {
      btn.addEventListener(`click`, this._onRatingBtnClick);
    }
  }


  removeElements() {
    this._closeBtn = null;
    this._form = null;

    this._userRatingOutput = null;
    this._ratingBtnsWrapper = null;
    this._ratingBtns = null;

    this._listsControls = null;
    this._addToWatchlistBtn = null;
    this._markAsWatchedBtn = null;
    this._addToFavoritesBtn = null;

    this._commentsCount = null;
    this._commentsList = null;
    this._commentField = null;
    this._addEmojiBtn = null;

    this._commentUndoBtnWrapper = null;
    this._commentUndoBtn = null;
    this._movieStatusOutput = null;
  }

  removeListeners() {
    this._closeBtn.removeEventListener(`click`, this._onCloseBtnClick);
    this._commentField.removeEventListener(`keydown`, this._onCommentFieldKeydown);
    this._commentUndoBtn.removeEventListener(`click`, this._onCommentUndoBtnClick);

    this._addToWatchlistBtn.removeEventListener(`click`, this._onAddToWatchlistBtnClick);
    this._markAsWatchedBtn.removeEventListener(`click`, this._onMarkAsWatchedBtnClick);
    this._addToFavoritesBtn.removeEventListener(`click`, this._onAddToFavoritesBtnClick);

    for (const btn of this._ratingBtns) {
      btn.removeEventListener(`click`, this._onRatingBtnClick);
    }
  }
}
