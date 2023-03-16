import { Repository } from './repository-class.js';

const REPOSITORIES_TEMPLATE_ID = 'repository-template';
const REPOSITORY_ITEM_CLASS_NAME = 'repository';
const REPOSITORIES_LIST_CLASS_NAME = 'repositories__list';
const REPOSITORY_FIELD_CLASS_NAME = 'repository__info-item';
const REPOSITORY_INFO_CLASS_NAME = 'repository__info-text';
const REPOSITORY_LINK_CLASS_NAME = 'repository__link';
const LIST_IS_EMPTY_MESSAGE = 'Ничего не найдено';
const REPOSITORIES_TO_UPLOAD_COUNT = 5;
const COORD_TO_UPLOAD_NEW_ITEMS = 50;


const repositoryTemplate = document.querySelector(`#${REPOSITORIES_TEMPLATE_ID}`)
  .content
  .querySelector(`.${REPOSITORY_ITEM_CLASS_NAME}`);

function renderRepositoriesList(repositories) {
  const repositoriesListElement = document.querySelector(`.${REPOSITORIES_LIST_CLASS_NAME}`);

  if (!repositoriesListElement) return;

  const itemsCount = repositories.length;

  if (!itemsCount) {
    const message = createEmptyMessage();
    updateRepositoriesListElement(repositoriesListElement, message);
    return;
  }

  const startItemIndex = 0;
  let endItemIndex = REPOSITORIES_TO_UPLOAD_COUNT;

  uploadRepositories(repositories, startItemIndex, endItemIndex);

  if (itemsCount <= endItemIndex) return;

  window.onscroll = () => {
    const documentBottom = document.documentElement.getBoundingClientRect().bottom;
    const documentHeight = document.documentElement.clientHeight;

    if (endItemIndex === itemsCount) return false;

    if (documentBottom < documentHeight + COORD_TO_UPLOAD_NEW_ITEMS) {
      endItemIndex = Math.min(endItemIndex + REPOSITORIES_TO_UPLOAD_COUNT, itemsCount);
      uploadRepositories(repositories, startItemIndex, endItemIndex);
    }
  };
}

function createEmptyMessage() {
  const messageElement = document.createElement('h2');
  messageElement.textContent = LIST_IS_EMPTY_MESSAGE;

  return messageElement;
}

function updateRepositoriesListElement(element, newContent) {
  const elementClone = element.cloneNode();
  elementClone.append(newContent);
  element.replaceWith(elementClone);
}

function uploadRepositories(repositories, startIndex, endIndex) {
  const repositoriesListElement = document.querySelector(`.${REPOSITORIES_LIST_CLASS_NAME}`);
  const uploadedRepositories = repositories.slice(startIndex, endIndex);
  const newContent = getRepositoriesListContent(uploadedRepositories);
  updateRepositoriesListElement(repositoriesListElement, newContent);
}

function getRepositoriesListContent(repositories) {
  if (!repositories.length) {
    const messageElement = document.createElement('h2');
    messageElement.textContent = LIST_IS_EMPTY_MESSAGE;

    return messageElement;
  }

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
