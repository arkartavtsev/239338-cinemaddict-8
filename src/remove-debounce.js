const DEBOUNCE_INTERVAL = 500;

let lastTimeout;


export default (callback) => {
  if (lastTimeout) {
    clearTimeout(lastTimeout);
  }

  lastTimeout = setTimeout(callback, DEBOUNCE_INTERVAL);
};
