const CACHE_NAME = `MOOWLE`;


self.addEventListener(`install`, (evt) => {
  // const openCache = caches.open(CACHE_NAME)
  //   .then((cache) => {
  //     return cache.addAll([
  //       `/,`,
  //       `index.html`,
  //       `bundle.js`,
  //       `./css/normalize.css`,
  //       `./css/main.css`,
  //       `images/.`
  //     ]);
  //   });
  //
  // evt.waitUntil(openCache);
  console.log(`install`);

  evt.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => {
          return cache.addAll([
            `./`,
            `./index.html`,
            `./bundle.js`,
            `./css/normalize.css`,
            `./css/main.css`,

            `./images/background.png`,

            `./images/icon-favorite.svg`,
            `./images/icon-favorite-active.svg`,
            `./images/icon-favorite-error.svg`,

            `./images/icon-watched.svg`,
            `./images/icon-watched-active.svg`,
            `./images/icon-watched-error.svg`,

            `./images/icon-watchlist.svg`,
            `./images/icon-watchlist-active.svg`,
            `./images/icon-watchlist-error.svg`,

            `./images/posters/accused.jpg`,
            `./images/posters/blackmail.jpg`,
            `./images/posters/blue-blazes.jpg`,
            `./images/posters/fuga-da-new-york.jpg`,
            `./images/posters/moonrise.jpg`,
            `./images/posters/three-friends.jpg`
          ]);
        })
        .catch((err) => {
          throw err;
        })
  );
});

self.addEventListener(`activate`, (evt) => {
  console.log(`sw`, `activate`, {evt});
});

self.addEventListener(`fetch`, (evt) => {
  evt.respondWith(
    caches.match(evt.request)
      .then((response) => {
        console.log(`Find in cache`, {response});
        return response ? response : fetch(evt.request);
      })
      .catch((err) => {
        console.error({err});
        throw err;
      })
  );
});
