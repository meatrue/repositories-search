import { Repository } from './repository-class.js';
import { getData, ITEMS_TO_UPLOAD } from './data-api.js';
import {
  request,
  toggleError,
  errorMessageElement
} from './search-form.js';
import { debounce } from './utils.js';

const REPOSITORIES_TEMPLATE_ID = 'repository-template';
const REPOSITORY_ITEM_CLASS_NAME = 'repository';
const REPOSITORIES_LIST_CLASS_NAME = 'repositories__list';
const REPOSITORY_FIELD_CLASS_NAME = 'repository__info-item';
const REPOSITORY_INFO_CLASS_NAME = 'repository__info-text';
const REPOSITORY_LINK_CLASS_NAME = 'repository__link';
const LIST_IS_EMPTY_MESSAGE = 'Ничего не найдено';
const FOUND_REPOSITORIES_TITLE = 'Найдено репозиториев: ';
const COORD_TO_UPLOAD_NEW_ITEMS = 100;
const SCROLL_DELAY = 100;


const repositoryTemplate = document.querySelector(`#${REPOSITORIES_TEMPLATE_ID}`)
  .content
  .querySelector(`.${REPOSITORY_ITEM_CLASS_NAME}`);

function renderRepositoriesList(data) {
  if (!getRepositoriesListElement()) return;

  resetRepositoriesListElement();

  const {totalCount} = data;
  const repositories = data.items;

  if (!totalCount) {
    setMessage(LIST_IS_EMPTY_MESSAGE);
    return;
  }

  setMessage(FOUND_REPOSITORIES_TITLE + totalCount);

  let prevPage = 1;
  let currentPage = 1;

  uploadRepositories(repositories);

  const scrollPageDebounced = debounce(
    () => {
      const documentBottom = document.documentElement.getBoundingClientRect().bottom;
      const documentHeight = document.documentElement.clientHeight;

      if (!request.trim() || currentPage * ITEMS_TO_UPLOAD >= totalCount) return false;

      if (documentBottom < documentHeight + COORD_TO_UPLOAD_NEW_ITEMS) {
        currentPage++;

        if (currentPage === prevPage) return false;
        prevPage = currentPage;

        getData(
          currentPage,
          request,
          (repositories) => uploadRepositories(repositories.items),
          () => toggleError(errorMessageElement, true)
        );
      }
    },
    SCROLL_DELAY
  );

  window.onscroll = () => {
    scrollPageDebounced();
  };
}

function resetRepositoriesListElement() {
  const element = getRepositoriesListElement();
  const elementClone = element.cloneNode();
  element.replaceWith(elementClone);
}

function getRepositoriesListElement() {
  return document.querySelector(`.${REPOSITORIES_LIST_CLASS_NAME}`);
}

function setMessage(message) {
  const repositoriesListElement = getRepositoriesListElement();
  const messageElement = document.createElement('h2');
  messageElement.textContent = message;
  repositoriesListElement.append(messageElement);
}

function uploadRepositories(repositories) {
  const repositoriesListElement = getRepositoriesListElement();
  const newContent = getRepositoriesListContent(repositories);
  repositoriesListElement.append(newContent);
}

function getRepositoriesListContent(repositories) {
  const repositoriesFragment = document.createDocumentFragment();

  repositories.forEach((repositoryItem) => {
    const repository = new Repository(repositoryItem);
    const repositoryElement = createRepositoryElement(repository);
    repositoriesFragment.append(repositoryElement);
  });

  return repositoriesFragment;
}

function createRepositoryElement(info) {
  const repositoryElement = repositoryTemplate.cloneNode(true);
  const repositoryFields = repositoryElement.querySelectorAll(`.${REPOSITORY_FIELD_CLASS_NAME}`);

  for (let field of repositoryFields) {
    const infoElement = field.querySelector(`.${REPOSITORY_INFO_CLASS_NAME}`);
    const infoText = info[field.dataset.name];

    infoElement.textContent = infoText;
    if (!infoText) {
      field.style.display = 'none';
    }
  }

  const repositoryLink = repositoryElement.querySelector(`.${REPOSITORY_LINK_CLASS_NAME}`);
  repositoryLink.href = info.url;

  return repositoryElement;
}

export { renderRepositoriesList };
