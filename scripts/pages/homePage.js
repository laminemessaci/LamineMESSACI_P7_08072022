import { resizeOpenedFilter } from "../utils/resizer.js";
import { Search } from "../utils/search.js";

import {
  addCloseAllFiltersEvent,
  addOpenFiltersEvents,
} from "../events/filterEvents.js";

export default class HomePage {
  constructor(recipesList) {
    this._recipesList = recipesList;
    this._badgesList = [];
    this._filterItems = {
      ingredient: this._recipesList.sortedIngredients,
      appliance: this._recipesList.sortedAppliances,
      ustensil: this._recipesList.sortedUstensils,
    };
  }

  /**
   * @returns {Object}
   */
  get _userRequest() {
    const searchBarInput = document.getElementById("search-bar-input");

    return {
      userInput: searchBarInput.value.trim(),
      joinedBadges: this._badgesList.join(" ").trim(),
    };
  }

  /**
   * @returns {RecipesList}
   */
  getRecipesListToDisplay() {
    return this._recipesList.search(this._userRequest);
  }

  render() {
    new Search().searchWithSearchBar();
    new Search().renderFiltersOptions(this._filterItems);
    addOpenFiltersEvents();
    this.addAutoSizingFilterListsEvent();
    addCloseAllFiltersEvent();
    this.addUpButtonEvent();
  }

  /**
   * Resize opened ingredients/appliances/ustensils list when window is resized.
   */
  addAutoSizingFilterListsEvent() {
    window.onresize = () => {
      resizeOpenedFilter();
    };
  }

  /**
   * Make "up-button" appears after some scrolling and move to the top of the page when clicking on this "up-button".
   */
  addUpButtonEvent() {
    const upButton = document.getElementById("up-button");
    const main = document.querySelector("main");

    window.addEventListener("scroll", () => {
      const mainRect = main.getBoundingClientRect();

      if (mainRect.top < 0) {
        upButton.classList.add("displayed");
      } else {
        upButton.classList.remove("displayed");
      }
    });

    upButton.onclick = () => {
      window.scroll(0, 0);
    };
  }
}
