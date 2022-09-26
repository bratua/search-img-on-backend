import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
// const MAIN_API_URL = 'https://pixabay.com/api/';
// const API_KEY = '29459770-8893fd985768567c1d8693203';

//*
const apiOptions = {
  MAIN_URL: 'https://pixabay.com/api/',
  KEY: '29459770-8893fd985768567c1d8693203',
  imageType: 'photo',
  imageOrientation: 'horizontal',
  safeSearch: true,
  searchQuery: '',
  perPage: 20,
  page: 1,
};

const refs = {
  searchForm: document.querySelector('#search-form'),
  nexBtn: document.querySelector('#next-button'),
  gallery: document.querySelector('.gallery'),
};

const searchField = refs.searchForm.elements.searchQuery;

// console.log(refs.searchForm.elements.searchQuery.value);

refs.searchForm.addEventListener('submit', onClick);
refs.nexBtn.addEventListener('click', onPressNextBtn);

function onClick(e) {
  e.preventDefault();
  apiOptions.page = 1;
  refs.gallery.innerHTML = '';

  if (searchField.value === '') {
    Notiflix.Notify.failure(`Enter your serch query!`);
    return;
  }

  apiOptions.searchQuery = searchField.value;
  renderCards(getQueryData());

  //   console.log();
}

function onPressNextBtn() {
  console.log(apiOptions.page);
  apiOptions.page += 1;
  console.log(apiOptions.page);

  renderCards(getQueryData());
}

function createSearchUrl({
  MAIN_URL,
  KEY,
  imageType,
  imageOrientation,
  safeSearch,
  searchQuery,
  perPage,
  page,
}) {
  return `${MAIN_URL}?key=${KEY}&q=${searchQuery}&image_type=${imageType}&orientation=${imageOrientation}&safesearch=${safeSearch}&per_page=${perPage}&page=${page}`;
}

// function getQueryData() {
//   return axios
//     .get(createSearchUrl(apiOptions))
//     .then(resp => resp.data.hits.map(r => console.log(r)));
// }

async function getQueryData() {
  try {
    const response = await axios.get(createSearchUrl(apiOptions));
    Notiflix.Notify.success(`Total cards: ${response.data.total}`);
    Notiflix.Notify.warning(
      `Total pages: ${Math.ceil(response.data.total / apiOptions.perPage)}`
    );
    Notiflix.Notify.info(`Cards per page: ${apiOptions.perPage}`);
    const hits = await response.data.hits.map(r => r);
    // console.log(response.data.total / apiOptions.perPage);
    // console.log(Math.ceil(response.data.total / apiOptions.perPage));
    return hits;
  } catch (error) {
    console.log(error);
  }
}

async function renderCards(data) {
  const queryData = await data;
  // console.log('incoming obj ===', queryData);
  const renderBlock = queryData.map(queryElement => {
    return `<div class="photo-card">
  <div class="img-thumb no-gap">
    <img class="card-img"
      src="${queryElement.webformatURL}"
      alt="${queryElement.tags}"
      loading="lazy"
    />
  </div>
  <ul class="info">
    <li class="info-item">
      <p class="info-name"><b>Likes:</b></p>
      <p class="info-value">${queryElement.likes}</p>
    </li>
    <li class="info-item">
      <p class="info-name"><b>Views:</b></p>
      <p class="info-value">${queryElement.views}</p>
    </li>
    <li class="info-item">
      <p class="info-name"><b>Comments:</b></p>
      <p class="info-value">${queryElement.comments}</p>
    </li>
    <li class="info-item">
      <p class="info-name"><b>Downloads:</b></p>
      <p class="info-value">${queryElement.downloads}</p>
    </li>
  </ul>
</div>`;
  });
  // console.log(renderBlock.join(''));
  refs.gallery.insertAdjacentHTML('beforeend', `${renderBlock.join('')}`);
}
