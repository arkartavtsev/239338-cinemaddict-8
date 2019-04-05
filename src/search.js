import {KeyCode} from './const';

import Component from './component';


export default class Search extends Component {
  constructor() {
    super();

    this._field = null;

    this._onSearch = null;

    this._onFieldInput = this._onFieldInput.bind(this);
    this._onFieldKeydown = this._onFieldKeydown.bind(this);
  }


  get template() {
    return `
      <form class="header__search search">
        <input type="text" name="search" class="search__field" placeholder="Search">
        <button type="submit" class="visually-hidden">Search</button>
      </form>
    `.trim();
  }

  get field() {
    return this._field;
  }


  set onSearch(fn) {
    this._onSearch = fn;
  }


  _onFieldInput(evt) {
    if (typeof this._onSearch === `function`) {
      this._onSearch(evt);
    }
  }

  _onFieldKeydown(evt) {
    if (evt.keyCode === KeyCode.ENTER) {
      evt.preventDefault();
    }
  }


  addElements() {
    this._field = this._element.querySelector(`.search__field`);
  }

  addListeners() {
    this._field.addEventListener(`input`, this._onFieldInput);
    this._field.addEventListener(`keydown`, this._onFieldKeydown);
  }


  removeElements() {
    this._field = null;
  }

  removeListeners() {
    this._field.removeEventListener(`input`, this._onFieldInput);
    this._field.removeEventListener(`keydown`, this._onFieldKeydown);
  }
}
