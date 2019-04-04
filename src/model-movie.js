import {getRandomNum} from './util';


const WATCH_HISTORY_YEARS = 2;


const getRandomPastDateWithinYears = (years) => Date.now() + (getRandomNum(-years, 0) * 365 + getRandomNum(-365, 0)) * 24 * 60 * 60 * 1000;


export default class ModelMovie {
  constructor(data) {
    this.id = data[`id`];

    this.title = data[`film_info`][`title`] || ``;
    this.originalTitle = data[`film_info`][`alternative_title`] || ``;

    this.rating = data[`film_info`][`total_rating`];
    this.ageRating = data[`film_info`][`age_rating`];

    this.duration = data[`film_info`][`runtime`] || 0;
    this.genres = data[`film_info`][`genre`] || [];
    this.description = data[`film_info`][`description`] || ``;
    this.posterUrl = data[`film_info`][`poster`] || ``;

    this.director = data[`film_info`][`director`] || ``;
    this.writers = data[`film_info`][`writers`] || [];
    this.actors = data[`film_info`][`actors`] || [];

    this.country = data[`film_info`][`release`][`release_country`] || ``;
    this.releaseDate = data[`film_info`][`release`][`date`];

    this.isInWatchlist = Boolean(data[`user_details`][`watchlist`]);
    this.isWatched = Boolean(data[`user_details`][`already_watched`]);
    this.isFavorite = Boolean(data[`user_details`][`favorite`]);

    this.userRating = data[`user_details`][`personal_rating`];

    if (this.isWatched) {
      this.watchDate = getRandomPastDateWithinYears(WATCH_HISTORY_YEARS);
    }

    this.comments = data[`comments`].map((comment) => ({
      author: comment[`author`] || ``,
      date: comment[`date`],
      text: comment[`comment`] || ``,
      emotion: comment[`emotion`] || ``
    })) || [];
  }


  toRAW() {
    return {
      'id': this.id,

      'film_info': {
        'title': this.title,
        'alternative_title': this.originalTitle,
        'total_rating': this.rating,
        'age_rating': this.ageRating,
        'runtime': this.duration,
        'genre': this.genres,
        'description': this.description,
        'poster': this.posterUrl,

        'director': this.director,
        'writers': this.writers,
        'actors': this.actors,

        'release': {
          'release_country': this.country,
          'date': this.releaseDate
        }
      },

      'user_details': {
        'personal_rating': this.userRating,

        'watchlist': this.isInWatchlist,
        'already_watched': this.isWatched,
        'favorite': this.isFavorite
      },

      'comments': this.comments.map((comment) => ({
        'author': comment.author,
        'date': comment.date,
        'comment': comment.text,
        'emotion': comment.emotion
      }))
    };
  }


  static parseMovie(data) {
    return new ModelMovie(data);
  }

  static parseMovies(data) {
    return data.map(ModelMovie.parseMovie);
  }
}
