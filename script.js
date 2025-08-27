import {recipes} from './recipes.js';

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchButton');

const message = document.getElementById('message');

const recipeDetails = document.getElementById('recipeDetails');
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


function generateRecipeHTML() {
  message.innerHTML = 'Loading...';
  message.classList.remove('hidden');

  setTimeout( async () => {
    const title = searchInput.value.trim();
    
    const recipe = await fetchRecipe(title);

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
  }, 500);
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
  const randomNumber = Math.round(Math.random() * recipes.length);
  
  
  recipeDetails.classList.add('hidden');
  message.innerHTML = 'Loading...';
  message.classList.remove('hidden');

  setTimeout( async () => {
    const title = recipes[randomNumber].title;
    
    const recipe = await fetchRecipe(title);

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
  }, 500);
});