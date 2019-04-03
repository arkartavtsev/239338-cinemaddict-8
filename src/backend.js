import API from './api';
import Store from './store';
import Provider from './provider';


const END_POINT = `https://es8-demo-srv.appspot.com/moowle`;
const AUTHORIZATION = `Basic eo00w5900ik29889ak`;

const MOVIES_STORE_KEY = `movies-store-key`;


const api = new API(END_POINT, AUTHORIZATION);
const store = new Store(MOVIES_STORE_KEY, localStorage);

const provider = new Provider(api, store);


window.addEventListener(`offline`, () => {
  document.title = `${document.title} [OFFLINE]`;
});

window.addEventListener(`online`, () => {
  document.title = document.title.split(`[OFFLINE]`)[0];

  provider.syncMovies();
});


export {provider};
