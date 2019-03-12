export const getRandomNum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const getUniqueRandomItems = (minAmount, maxAmount, array) => {
  const items = new Set();

  for (let i = 0; i < getRandomNum(minAmount, maxAmount); i++) {
    items.add(getRandomItem(array));
  }

  return Array.from(items);
};


export const createElement = (template) => {
  const newElement = document.createElement(`div`);

  newElement.innerHTML = template;

  return newElement.firstChild;
};
