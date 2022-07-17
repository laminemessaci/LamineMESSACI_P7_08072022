import { sortAlphabetically } from "../utils/formatString.js";

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
    return this.recipes.sort((r1, r2) => {
      const name1 = r1.name.toLowerCase();
      const name2 = r2.name.toLowerCase();

      const [sortedName1, sortedName2] = sortAlphabetically([name1, name2]);

      if (sortedName1 === name2) return 1;
      if (sortedName1 === name1) return -1;
      return 0;
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
  search(userRequest) {}
}
