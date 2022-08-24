import {
  capitalizeFirstChar,
  removeFrenchWords,
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

  /**
   * Search recipes corresponding to the input in search bar and active badges.
   * @param {Object} userRequest
   * @returns {RecipesList}
   */
  search(userRequest) {
    const searchBarInput = userRequest.userInput;
    const searchByTag = userRequest.joinedBadges;

    // all types of search
    userRequest = `${userRequest.userInput} ${userRequest.joinedBadges}`;

    const words = userRequest.split(" ");
    const keywords = removeFrenchWords(words);

    let filteredRecipes = new Set(this.recipes);
    //  console.log("key words : ", keywords.length);
    keywords.forEach((keyword) => {
      let keywordHasRecipes = new Set();
      keyword = toNormalForm(keyword);

      keywordHasRecipes = this.recipes.filter((recipe) => {
        // if user input is only searchBar
        if (searchByTag.length > 0 && searchBarInput == "") {
          // console.log("Search By Tag :  ", searchByTag);

          return (
            recipe.joinedIngredientsWithoutAccent.includes(keyword) ||
            recipe.applianceNameWithoutAccent.includes(keyword) ||
            recipe.joinedUstensilsWithoutAccent.includes(keyword)
          );
        } else {
          // console.log(" Search Bar: ", searchBarInput);
          return (
            recipe.nameWithoutAccent.includes(keyword) ||
            recipe.joinedIngredientsWithoutAccent.includes(keyword) ||
            recipe.applianceNameWithoutAccent.includes(keyword) ||
            recipe.joinedUstensilsWithoutAccent.includes(keyword) ||
            recipe.descriptionWithoutAccent.includes(keyword)
          );
        }
      });

      filteredRecipes = new Set(
        [...keywordHasRecipes].filter((recipe) => filteredRecipes.has(recipe))
      );
    });

    return new RecipesList([...filteredRecipes]);
  }
}
