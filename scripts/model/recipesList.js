import {
  capitalizeFirstChar,
  sortAlphabetically,
  toNormalForm,
} from "../utils/formatString.js";

export class RecipesList {
  /**
   * @constructs
   * @param {Array.Recipe} recipes
   */
  constructor(recipes) {
    this.recipes = recipes;
    this._sortByName();
  }

  /**
   * @returns {Array.string}
   */
  get sortedAppliances() {
    return sortAlphabetically(this._collectAppliances());
  }

  /**
   * @returns {Array.string}
   */
  get sortedIngredients() {
    return sortAlphabetically(this._collectIngredients());
  }

  /**
   * @returns {Array.string}
   */
  get sortedUstensils() {
    return sortAlphabetically(this._collectUstensils());
  }

  /**
   * Name sorting adapted to french language (accents handling)
   * @returns {Array.string}
   */
  _sortByName() {
    return this.recipes.sort((a, b) => {
      return a.name.toLowerCase()?.localeCompare(b.name.toLowerCase());
    });
  }

  /**
   * @returns {Array.string}
   */
  _collectAppliances() {
    const appliances = new Set();

    for (let recipe of this.recipes) {
      appliances.add(capitalizeFirstChar(recipe.appliance));
    }

    return [...appliances];
  }

  /**
   * @returns {Array.string}
   */
  _collectIngredients() {
    const ingredients = new Set();

    for (let recipe of this.recipes) {
      for (let item of recipe.ingredients) {
        ingredients.add(capitalizeFirstChar(item.ingredient));
      }
    }

    return [...ingredients];
  }

  /**
   * @returns {Array.string}
   */
  _collectUstensils() {
    const ustensils = new Set();

    for (let recipe of this.recipes) {
      for (let ustensil of recipe.ustensils) {
        ustensils.add(capitalizeFirstChar(ustensil));
      }
    }

    return [...ustensils];
  }

  search(userRequest) {
    const searchBarInput = userRequest.userInput;
    const searchByTag = userRequest.joinedBadges;

    userRequest = `${userRequest.userInput} ${userRequest.joinedBadges}`;

    const keywords = userRequest.split(" ");
    // const keywords = removeFrenchWords(words);

    let filteredRecipes = new Set(this.recipes);

    for (let keyword of keywords) {
      const recipesHasKeyWord = new Set();

      keyword = toNormalForm(keyword);

      if (searchByTag.length > 0 && searchBarInput == "") {
        // console.log("Search badges   ", searchByTag);

        for (let recipe of this.recipes) {
          if (
            recipe.joinedIngredientsWithoutAccent.includes(keyword) ||
            recipe.applianceNameWithoutAccent.includes(keyword) ||
            recipe.joinedUstensilsWithoutAccent.includes(keyword)
          ) {
            recipesHasKeyWord.add(recipe);
          }
        }
      } else {
        for (let recipe of this.recipes) {
          // console.log("search bar", searchBarInput);
          if (
            recipe.nameWithoutAccent.includes(keyword) ||
            recipe.joinedIngredientsWithoutAccent.includes(keyword) ||
            recipe.applianceNameWithoutAccent.includes(keyword) ||
            recipe.joinedUstensilsWithoutAccent.includes(keyword) ||
            recipe.descriptionWithoutAccent.includes(keyword)
          ) {
            recipesHasKeyWord.add(recipe);
          }
        }
      }

      let intersectRecipes = new Set();
      for (let recipe of recipesHasKeyWord) {
        if (filteredRecipes.has(recipe)) intersectRecipes.add(recipe);
      }

      // intersect recipesHasKeyWord with actual filteredRecipes:
      filteredRecipes = new Set([...intersectRecipes]);
    }

    return new RecipesList([...filteredRecipes]);
  }
}
