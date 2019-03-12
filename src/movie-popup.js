import {createElement} from './util';


export default class MoviePopup {
  constructor(data) {
    this._title = data.title;
    this._originalTitle = data.originalTitle;
    this._rating = data.rating;
    this._ageRating = data.ageRating;
    this._releaseDate = data.releaseDate;
    this._country = data.country;
    this._duration = data.duration;
    this._director = data.director;
    this._writers = data.writers;
    this._actors = data.actors;
    this._genres = data.genres;
    this._description = data.description;
    this._posterUrl = data.posterUrl;
    this._comments = data.comments;

    this._element = null;

    this._onClick = null;
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
                <label for="add-emoji" class="film-details__add-emoji-label">😐</label>
                <input type="checkbox" class="film-details__add-emoji visually-hidden" id="add-emoji">

                <div class="film-details__emoji-list">
                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                  <label class="film-details__emoji-label" for="emoji-sleeping">😴</label>

                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-neutral-face" value="neutral-face" checked>
                  <label class="film-details__emoji-label" for="emoji-neutral-face">😐</label>

                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-grinning" value="grinning">
                  <label class="film-details__emoji-label" for="emoji-grinning">😀</label>
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
                  <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="1" id="rating-1">
                  <label class="film-details__user-rating-label" for="rating-1">1</label>

                  <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="2" id="rating-2">
                  <label class="film-details__user-rating-label" for="rating-2">2</label>

                  <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="3" id="rating-3">
                  <label class="film-details__user-rating-label" for="rating-3">3</label>

                  <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="4" id="rating-4">
                  <label class="film-details__user-rating-label" for="rating-4">4</label>

                  <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="5" id="rating-5" checked>
                  <label class="film-details__user-rating-label" for="rating-5">5</label>

                  <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="6" id="rating-6">
                  <label class="film-details__user-rating-label" for="rating-6">6</label>

                  <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="7" id="rating-7">
                  <label class="film-details__user-rating-label" for="rating-7">7</label>

                  <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="8" id="rating-8">
                  <label class="film-details__user-rating-label" for="rating-8">8</label>

                  <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="9" id="rating-9">
                  <label class="film-details__user-rating-label" for="rating-9">9</label>
                </div>
              </section>
            </div>
          </section>
        </form>
      </section>
    `.trim();
  }


  get element() {
    return this._element;
  }


  set onClick(fn) {
    this._onClick = fn;
  }

  _onCloseBtnClick() {
    if (typeof this._onClick === `function`) {
      this._onClick();
    }
  }


  bind() {
    this._element.querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, this._onCloseBtnClick);
  }

  unbind() {
    this._element.querySelector(`.film-details__close-btn`)
      .removeEventListener(`click`, this._onCloseBtnClick);
  }


  render() {
    this._element = createElement(this.template);
    this.bind();

    return this._element;
  }

  unrender() {
    this.unbind();
    this._element = null;
  }
}
