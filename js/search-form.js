import { getData } from './data-api.js';
import { renderRepositoriesList } from './repositories-list.js';

const SEARCH_INPUT_NAME = 'request';
const ERROR_LABEL_CLASS_NAME = 'error-label';
const ERROR_MESSAGE = 'Ошибка получения данных';
const IS_ACTIVE_CLASS = 'isActive';
let request = '';
let errorMessageElement;

function initForm(form) {
  form.addEventListener('submit', onFormSubmit);
  form.addEventListener('input', onFormInput);
  errorMessageElement = form.querySelector(`.${ERROR_LABEL_CLASS_NAME}`);
}

function onFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const searchInput = form[SEARCH_INPUT_NAME];
  request = searchInput.value;

  form.reset();
  getData(
    1,
    request,
    renderRepositoriesList,
    () => toggleError(errorMessageElement, true)
  );
}

function onFormInput(e) {
  const form = e.currentTarget;
  const errorMessageElement = form.querySelector(`.${ERROR_LABEL_CLASS_NAME}`);
  toggleError(errorMessageElement, false);
}

function toggleError(errorMessageElement, isError) {
  if (!errorMessageElement) return;

  let text = '';
  let method = 'remove';

  if (isError) {
    text = ERROR_MESSAGE;
    method = 'add';
  }

  errorMessageElement.textContent = text;
  errorMessageElement.classList[method](IS_ACTIVE_CLASS);
}

export {
  initForm,
  toggleError,
  errorMessageElement,
  request
};
