import ModelMovie from './model-movie';


const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};


export default class API {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }


  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(API.checkStatus)
      .catch((err) => {
        throw err;
      });
  }


  getMovies() {
    return this._load({
      url: `movies`
    })
      .then(API.toJSON)
      .then(ModelMovie.parseMovies);
  }

  updateMovie(id, data) {
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(API.toJSON)
      .then(ModelMovie.parseMovie);
  }

  syncMovies(data) {
    return this._load({
      url: `movies/sync`,
      method: `POST`,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(API.toJSON);
  }


  static toJSON(response) {
    return response.json();
  }

  static checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }
}
