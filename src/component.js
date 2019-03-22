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


  update() {}


  addElements() {}
  addListeners() {}

  bindComponent() {
    this.addElements();
    this.addListeners();
  }

  render() {
    this._element = createElement(this.template);
    this.bindComponent();

    return this._element;
  }


  removeListeners() {}
  removeElements() {}

  unbindComponent() {
    this.removeListeners();
    this.removeElements();
  }

  unrender() {
    this.unbindComponent();
    this._element.remove();
    this._element = null;
  }
}
