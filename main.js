
const loadData = (url, callBackFunc) => {

  // Request object
  const xhr = new XMLHttpRequest();

  // Set async request
  xhr.open('GET', url, true);

  // Load jokes
  xhr.onload = function () {
    if (this.status === 200) {
      const jsonResponse = JSON.parse(this.responseText).value;
      callBackFunc(jsonResponse);
    }
  };

  // Send request
  xhr.send();
};

const setCategories = (categories) => {

  let categoriesInput = document.querySelector('#categories');
  jokesObj.categories = categories;

  for (const category of categories) {
    const optionInput = document.createElement('option');
    optionInput.value = category;
    optionInput.innerText = category;
    categoriesInput.appendChild(optionInput);
  }

}

const setJokes = (jokes) => {
  jokesObj.jokes = jokes;
  filterJokes(jokes);
};

const getCurrentPage = () => {

  if (localStorage.getItem('currentPage') === null) {
    localStorage.setItem('currentPage', '1');
  }
  return parseInt(localStorage.getItem('currentPage'));

}

const displayJokes = (jokes) => {

  const jokesSection = document.getElementById('jokes');
  const cardTemplate = document.getElementById('card-joke');

  jokesSection.innerHTML = '';

  for (const jokeObj of jokes) {
    let card = cardTemplate.content.cloneNode(true).children[0];
    card.querySelector('.card-text').textContent = jokeObj.joke;
    if (jokeObj.categories.length === 0) {
      card.querySelector('.badge').textContent = 'Uncategorized';
    } else {
      card.querySelector('.badge').textContent = jokeObj.categories[0];
    }
    jokesSection.appendChild(card);
  }

};

const filterJokes = (jokes) => {

  const category = document.querySelector('#categories').value;
  const content = document.querySelector('#content').value;
  const numJokes = document.querySelector('#numberJokes').value;

  /* Filter jokes's category */
  let filterCategoryJokes = [];
  if (category != 'all') {
    jokes.forEach(
      (joke, index) => {
        if (joke.categories.indexOf(category) != -1) {
          filterCategoryJokes.push(joke);
        }
      }
    );
  } else {
    filterCategoryJokes = jokes;
  }

  /* Filter jokes's content */
  let filterContentJokes = [];
  if (content.trim().length > 0) {
    console.log(content);
    filterCategoryJokes.forEach(
      (joke, index) => {
        if (joke.joke.includes(content)) {
          filterContentJokes.push(joke);
        }
      }
    );
  } else {
    filterContentJokes = [...filterCategoryJokes];
  }

  /* Filter jokes's number */
  let filterNumJokes = [];
  filterNumJokes = filterContentJokes.slice(0, numJokes);

  /* Display jokes */
  displayJokes(filterNumJokes);
};


document.querySelector('#filterForm > button[type="submit"]').addEventListener('click',
  (e) => {
    /* Call filter jokes function */
    filterJokes(jokesObj.jokes);
    e.preventDefault();
  }
);

var jokesObj = {};
loadData('http://api.icndb.com/categories', setCategories);
loadData('http://api.icndb.com/jokes', setJokes);
