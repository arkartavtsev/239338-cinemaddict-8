export default class Store {
  constructor(key, storage) {
    this._key = key;
    this._storage = storage;
  }


  getAll() {
    const emptyItems = {};
    const items = this._storage.getItem(this._key);

    if (!items) {
      return emptyItems;
    }

    try {
      return JSON.parse(items);
    } catch (error) {
      return emptyItems;
    }
  }

  getItem(key) {
    const items = this.getAll();

    return items[key];
  }


  setItem({key, item}) {
    const items = this.getAll();

    items[key] = item;
    this._storage.setItem(this._key, JSON.stringify(items));
  }
}
