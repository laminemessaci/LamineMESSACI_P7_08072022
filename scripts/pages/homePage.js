import { resizeOpenedFilter } from "../../utils/resizer.js";
import { Search } from "../../utils/search.js";
import { RecipeCard } from "../components/cards.js";
import {
  addCloseAllFiltersEvent,
  addOpenFiltersEvents,
} from "../filterEvents.js";

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
    new Search()._renderFiltersOptions(this._filterItems);
    addOpenFiltersEvents();
    this.addAutoSizingFilterListsEvent();
    addCloseAllFiltersEvent();
  }

  /**
   * Resize opened ingredients/appliances/ustensils list when window is resized.
   */
  addAutoSizingFilterListsEvent() {
    window.onresize = () => {
      resizeOpenedFilter();
    };
  }
}
