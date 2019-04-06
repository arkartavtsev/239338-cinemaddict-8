import {objectToArray} from './util';

import ModelMovie from './model-movie';


export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;

    this._isNeedSync = false;
  }


  _isOnline() {
    return window.navigator.onLine;
  }


  getMovies() {
    if (this._isOnline()) {
      return this._api.getMovies()
        .then((movies) => {
          movies.map((item) => this._store.setItem({
            key: item.id,
            item: item.toRAW()
          }));

          return movies;
        });
    } else {
      const rawMoviesMap = this._store.getAll();
      const rawMovies = objectToArray(rawMoviesMap);
      const movies = ModelMovie.parseMovies(rawMovies);

      return Promise.resolve(movies);
    }
  }

  updateMovie(id, data) {
    if (this._isOnline()) {
      return this._api.updateMovie(id, data)
        .then((movie) => {
          this._store.setItem({
            key: movie.id,
            item: movie.toRAW()
          });

          return movie;
        });
    } else {
      const movie = data;

      this._isNeedSync = true;
      this._store.setItem({
        key: movie.id,
        item: movie
      });

      return Promise.resolve(ModelMovie.parseMovie(movie));
    }
  }

  syncMovies() {
    return this._api.syncMovies(objectToArray(this._store.getAll()));
  }
}
