import {recipes} from './recipes.js';

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchButton');

const suggestionsBox = document.getElementById('suggestionsBox');

const message = document.getElementById('message');

const recipeDetails = document.getElementById('recipeDetails');
const recipeImg = document.getElementById('recipeImg');
const recipeTitle = document.getElementById('recipeTitle');
const recipeDescription = document.getElementById('recipeDescription');
const ingredientsList = document.getElementById('ingredientsList');
const instructionsList = document.getElementById('instructionsList');

const randomRecipe = document.getElementById('randomRecipe');

async function fetchRecipe(title) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!title) {
        recipeDetails.classList.add('hidden');
        message.classList.remove('hidden');
        message.innerHTML = `<p class="error-message">No dish entered.</p>`
        reject('No dish entered.');
        return;
      }

      const recipe = recipes.find((r) => {
        return r.title.toLowerCase().includes(title.toLowerCase());
      });

      if (!recipe) {
        recipeDetails.classList.add('hidden');
        message.classList.remove('hidden');
        message.innerHTML = `<p class="error-message">Recipe for ${title} not found.</p>`
        reject(`Recipe for ${title} not found.`);
      } else {
        resolve(recipe);
      }
    }, 500)
  });
}

async function generateRecipeHTML() {
  message.innerHTML = 'Loading...';
  message.classList.remove('hidden');
  
  const title = searchInput.value.trim();
  
  const recipe = await fetchRecipe(title);

  recipeImg.src = recipe.imageSrc;
  recipeTitle.textContent = recipe.title;
  recipeDescription.textContent = recipe.description;

  ingredientsList.innerHTML = "";
  recipe.ingredients.forEach((ingredient) => {
    ingredientsList.innerHTML += `<li class="ingredient-item">${ingredient}</li>`;
  });

  instructionsList.innerHTML = "";
  recipe.steps.forEach((step) => {
    instructionsList.innerHTML += `<li class="instruction-step">${step}</li>`;
  });
  
  message.classList.add('hidden');
  recipeDetails.classList.remove('hidden');
  
}

searchBtn.addEventListener('click', () => {
  recipeDetails.classList.add('hidden');
  generateRecipeHTML();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    recipeDetails.classList.add('hidden');
    generateRecipeHTML();
  }
});

randomRecipe.addEventListener('click', () => {
  const randomNumber = Math.floor(Math.random() * recipes.length);
  
  recipeDetails.classList.add('hidden');
  message.innerHTML = 'Loading...';
  message.classList.remove('hidden');
  suggestionsBox.classList.add('hidden');

  setTimeout( async () => {
    const title = recipes[randomNumber].title;
    
    const recipe = await fetchRecipe(title);
    
    recipeImg.src = recipe.imageSrc;
    recipeTitle.textContent = recipe.title;
    recipeDescription.textContent = recipe.description;

    ingredientsList.innerHTML = "";
    recipe.ingredients.forEach((ingredient) => {
      ingredientsList.innerHTML += `<li class="ingredient-item">${ingredient}</li>`;
    });

    instructionsList.innerHTML = "";
    recipe.steps.forEach((step) => {
      instructionsList.innerHTML += `<li class="instruction-step">${step}</li>`;
    });
    
    message.classList.add('hidden');
    recipeDetails.classList.remove('hidden');

    searchInput.value = recipe.title;
  }, 500);
});

async function fetchSuggestions(userInput) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const matches = recipes.filter((recipe) => {
        return recipe.title.toLowerCase().includes(userInput.toLowerCase());
      });

      if (!userInput) {
        suggestionsBox.classList.add('hidden');
        resolve([]);
      } else if (matches.length === 0) {
        suggestionsBox.classList.add('hidden');
        suggestionsBox.innerHTML = '';
        reject('No recipe found');
      } else {
        resolve(matches);
      }
    }, 200);
  });
}

async function generateSuggestionsHTML() {
  const userInput = searchInput.value.trim();

  let suggestions = '';
  suggestions = await fetchSuggestions(userInput);

  suggestionsBox.innerHTML = '';
  suggestions.forEach((suggestion) => {
    suggestionsBox.innerHTML += `<div id="suggestionItem" class="suggestion-item">${suggestion.title}</div>`;
  });

  document.querySelectorAll('#suggestionItem').forEach(item => {
    item.addEventListener('click', () => {
      searchInput.value = item.textContent;
      suggestionsBox.innerHTML = ''; 
      suggestionsBox.classList.add('hidden');
      generateRecipeHTML();
    });
  });

  
  document.querySelectorAll('#suggestionItem').forEach((item) => {
    item.addEventListener('mouseover', () => {
      searchInput.value = item.textContent;
    });
  });
}

searchInput.addEventListener('input', () => {
  const matches = recipes.filter((recipe) => {
    return recipe.title.toLowerCase().includes(searchInput.value.toLowerCase());
  });

  recipeDetails.classList.add('hidden');

  if (matches || searchInput.value === "") {
    setTimeout(() => {
      suggestionsBox.classList.remove('hidden');
    }, 200);
  }
  generateSuggestionsHTML();
});