const LOADER_CLASS_NAME = 'loader';

const loader = {
  _loader: null,

  on() {
    this._loader = document.createElement('div');
    this._loader.classList.add(LOADER_CLASS_NAME);

    document.body.append(this._loader);
  },

  off() {
    if (!this._loader) return;

    this._loader.remove();
    this._loader = null;
  }
}

export { loader };
