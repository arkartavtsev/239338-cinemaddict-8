import Component from './component';


export default class Filter extends Component {
  constructor(title) {
    super();

    this._title = title;
    this._type = (title.indexOf(` `) !== -1 ?
      title.slice(0, title.indexOf(` `))
      :
      title).toLowerCase();

    this._state = {
      isMain: false
    };

    this._onFilter = null;

    this._onFilterClick = this._onFilterClick.bind(this);
  }


  set isMain(state) {
    this._state.isMain = state;
  }

  set onFilter(fn) {
    this._onFilter = fn;
  }


  get template() {
    return `
      <a class="main-navigation__item ${this._state.isMain ? `main-navigation__item--active` : ``}" data-type="${this._type}" href="#${this._type}">
        ${this._title}
        ${!this._state.isMain ? Filter.addFilterCounter() : ``}
      </a>
    `.trim();
  }


  addListeners() {
    this._element.addEventListener(`click`, this._onFilterClick);
  }

  removeListeners() {
    this._element.removeEventListener(`click`, this._onFilterClick);
  }


  _onFilterClick(evt) {
    if (typeof this._onFilter === `function`) {
      this._onFilter(evt, this._type);
    }
  }


  static addFilterCounter() {
    return `
      <span class="main-navigation__item-count">0</span>
    `;
  }
}
