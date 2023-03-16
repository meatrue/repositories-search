import { loader } from './loader.js';

const SERVER_URL = 'https://api.github.com/search/';
const SERVICE = 'repositories';
const PARAMS = ' in:name';

async function getData(request, onSuccess, onFail) {
  const queryString = '?q=' + encodeURIComponent(`${request}${PARAMS}`);
  const url = `${SERVER_URL}${SERVICE}${queryString}`;

  try {
    loader.on();
    const response = await fetch(url);

    const result = await response.json();

    if (result.errors || !result.items) {
      onFail();
      loader.off();
      return;
    }

    onSuccess(result.items);
    loader.off();
  } catch (err) {
    onFail();
  }
}

export { getData };
