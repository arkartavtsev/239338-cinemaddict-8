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

    this.userRating = data[`user_details`][`personal_rating`];

    this.isInWatchlist = Boolean(data[`user_details`][`watchlist`]);
    this.isWatched = Boolean(data[`user_details`][`already_watched`]);
    this.isFavorite = Boolean(data[`user_details`][`favorite`]);

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
