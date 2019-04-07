import {objectToArray} from './util';

import ModelMovie from './model-movie';


export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;

    this._isNeedSync = false;
  }


  set isNeedSync(state) {
    this._isNeedSync = state;
  }

  get isNeedSync() {
    return this._isNeedSync;
  }


  getMovies() {
    if (Provider.isOnline()) {
      return this._api.getMovies()
        .then((movies) => {
          movies.map((item) => this._store.setItem({
            key: item.id,
            item: item.toRAW()
          }));

          return movies;
        });
    }

    const rawMoviesMap = this._store.getAll();
    const rawMovies = objectToArray(rawMoviesMap);
    const movies = ModelMovie.parseMovies(rawMovies);

    return Promise.resolve(movies);
  }

  updateMovie(id, data) {
    if (Provider.isOnline()) {
      return this._api.updateMovie(id, data)
        .then((movie) => {
          this._store.setItem({
            key: movie.id,
            item: movie.toRAW()
          });

          return movie;
        });
    }

    const movie = data;

    this._isNeedSync = true;
    this._store.setItem({
      key: movie.id,
      item: movie
    });

    return Promise.resolve(ModelMovie.parseMovie(movie));
  }

  syncMovies() {
    return this._api.syncMovies(objectToArray(this._store.getAll()));
  }


  static isOnline() {
    return window.navigator.onLine;
  }
}
