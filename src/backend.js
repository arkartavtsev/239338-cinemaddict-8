import {showMessage} from './util';
import API from './api';


const END_POINT = `https://es8-demo-srv.appspot.com/moowle`;
const AUTHORIZATION = `Basic eo00w5900ik29889ak`;


const api = new API(END_POINT, AUTHORIZATION);

const loadMovies = (container) => {
  showMessage(`Loading movies...`, container);

  return api.getMovies()
    .catch(() => {
      showMessage(`Something went wrong while loading movies. Check your connection or try again later.`, container);

      return [];
    });
};


export {
  api,
  loadMovies
};
