import { loader } from './loader.js';

const SERVER_URL = 'https://api.github.com/search/';
const SERVICE = 'repositories';
const PARAMS = ' in:name';
const ITEMS_TO_UPLOAD = 5;

async function getData(page, request, onSuccess, onFail) {
  const queryString = `?page=${page}&per_page=${ITEMS_TO_UPLOAD}&q=` + encodeURIComponent(`${request}${PARAMS}`);
  const url = `${SERVER_URL}${SERVICE}${queryString}`;

  try {
    loader.on();
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error();
    }

    const result = await response.json();
    loader.off();
    onSuccess({totalCount: result['total_count'], items: result.items});
  } catch (err) {
    loader.off();
    onFail();
  }
}

export { getData, ITEMS_TO_UPLOAD };
