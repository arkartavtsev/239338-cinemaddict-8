import {createElement} from './util';


export default class Component {
  constructor() {
    if (new.target === Component) {
      throw new Error(`Can't instantiate Component, only concrete one.`);
    }

    this._element = null;
  }


  get element() {
    return this._element;
  }

  get template() {
    throw new Error(`You have to define template.`);
  }


  addListeners() {}

  removeListeners() {}


  render() {
    this._element = createElement(this.template);
    this.addListeners();

    return this._element;
  }

  unrender() {
    this.removeListeners();
    this._element.remove();
    this._element = null;
  }
}
