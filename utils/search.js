import { FILTERS, URL_DATA } from "../constants/index.js";
import { RecipeCard } from "../scripts/components/cards.js";
import { SearchResultMessage } from "../scripts/components/message.js";
import { DataManager } from "../scripts/services/dataManager.js";
import { getData } from "../scripts/services/getData.js";
import { toNormalForm } from "./formatString.js";
import { filterListSizer, resizeOpenedFilter } from "./resizer.js";

const rawRecipesList = await getData(URL_DATA);

const dataManager = new DataManager(rawRecipesList.recipes);
const recipesList = dataManager.getRecipesList();

export class Search {
  constructor() {
    this._recipesList = recipesList;
    this._badgesList = [];
    this._filterItems = {
      ingredient: this._recipesList.sortedIngredients,
      appliance: this._recipesList.sortedAppliances,
      ustensil: this._recipesList.sortedUstensils,
    };
    this.renderCards(recipesList.recipes);
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

  /**
   * Add tag badge
   * @param {string} filter
   * @param {string} textContent
   */
  createFilterBadge(filter, textContent) {
    const filterBadgesWrapper = document.getElementById(
      `${filter}-badges-wrapper`
    );

    const badgeDiv = document.createElement("div");
    const badgeSpan = document.createElement("span");
    const badgeCloseIcon = document.createElement("i");

    badgeDiv.className = `badge badge--${filter}`;
    badgeSpan.textContent = textContent;
    badgeCloseIcon.className = "far fa-times-circle";

    badgeDiv.appendChild(badgeSpan);
    badgeDiv.appendChild(badgeCloseIcon);
    filterBadgesWrapper.appendChild(badgeDiv);

    this._badgesList.push(textContent);
    // console.log("badges list : ", this._badgesList);

    badgeCloseIcon.onclick = (e) => {
      e.stopPropagation();

      badgeDiv.remove();

      this._badgesList = this._badgesList.filter((elt) => elt != textContent);

      let recipesListToDisplay;

      if (
        this._userRequest.userInput.length < 3 &&
        this._userRequest.joinedBadges === ""
      ) {
        recipesListToDisplay = this._recipesList;
        const messageAside = document.getElementById("message");
        messageAside.classList.remove("opened");
      } else {
        recipesListToDisplay = this.getRecipesListToDisplay();

        new SearchResultMessage(recipesListToDisplay);
      }

      // console.log("recipesListToDisplay", recipesListToDisplay);

      this.renderFiltersOptions(
        this.getItemsListsToDisplay(recipesListToDisplay)
      );
      this.renderCards(recipesListToDisplay.recipes);

      this.renderFiltersOptions(
        this.getItemsListsToDisplay(recipesListToDisplay)
      );
    };
  }

  /**
   * Manage filters options togglers
   *
   * @param {string} clickedFilter
   */
  closeAllOthersFilters(clickedFilter) {
    for (let filter of FILTERS) {
      if (filter !== clickedFilter) {
        const filterLabel = document.getElementById(`${filter}-filter-label`);
        const filterIcon = document.getElementById(`${filter}-filter-icon`);
        const itemsList = document.getElementById(`${filter}-list`);

        filterLabel.classList.remove("clicked");
        filterIcon.classList.add("fa-chevron-down");
        filterIcon.classList.remove("fa-chevron-up");

        itemsList.classList.add("closed");

        // itemsList.style.height = 0;
      }
    }
  }

  /**
   * @param {Object.RecipesList} recipesList
   * @returns {Object}
   */
  getItemsListsToDisplay(recipesList) {
    return {
      ingredient: recipesList.sortedIngredients,
      appliance: recipesList.sortedAppliances,
      ustensil: recipesList.sortedUstensils,
    };
  }

  /**
   * Build Recipes Card list
   * @param {*Object} list
   */
  renderCards(list) {
    const cardsWrapper = document.getElementById("cards-wrapper");

    let htmlContent = "";

    for (let i = 0; i < list.length; i++) {
      htmlContent += new RecipeCard(list[i], i).html;
    }

    cardsWrapper.innerHTML = htmlContent;
  }
  searchWithSearchBar() {
    const searchBarForm = document.getElementById("search-bar-form");
    const searchBarInput = document.getElementById("search-bar-input");

    searchBarForm.onclick = (e) => e.stopPropagation();

    // Close all others filters
    searchBarInput.onfocus = () => {
      this.closeAllOthersFilters();
    };

    searchBarInput.oninput = (e) => {
      let recipesListToDisplay;

      if (searchBarInput.value.length >= 3) {
        recipesListToDisplay = this.getRecipesListToDisplay();
        new SearchResultMessage(recipesListToDisplay);
      } else if (this._badgesList.length > 0) {
        recipesListToDisplay = this._recipesList.search({
          userInput: "",
          joinedBadges: this._userRequest.joinedBadges,
        });
        new SearchResultMessage(recipesListToDisplay);
      } else {
        recipesListToDisplay = this._recipesList;
        const messageAside = document.getElementById("message");
        messageAside.classList.remove("opened");
      }

      this.renderFiltersOptions(
        this.getItemsListsToDisplay(recipesListToDisplay)
      );
      this.renderCards(recipesListToDisplay.recipes);
    };

    searchBarForm.onsubmit = (e) => {
      e.preventDefault();
      searchBarInput.blur();
    };
  }

  /**
   * Refresh ingredients/appliances/ustensils lists when user enter an input in filter or click on an item of the lists.
   */
  searchWithFilters() {
    for (let filter of FILTERS) {
      const filterInput = document.getElementById(`${filter}`);
      const itemsList = document.getElementById(`${filter}-list`);
      const itemsLines = document.querySelectorAll(`#${filter}-list li`);

      filterInput.oninput = () => {
        let itemsListsToDisplay = {};
        Object.assign(itemsListsToDisplay, this._filterItems);
        itemsListsToDisplay[filter] = itemsListsToDisplay[filter].filter(
          (item) =>
            toNormalForm(item).startsWith(toNormalForm(filterInput.value))
        );

        this.renderFiltersOptions(itemsListsToDisplay);
        filterListSizer(filter);
      };

      filterInput.onsubmit = () => {
        filterInput.blur();
      };

      filterInput.addEventListener("focusout", () => {
        filterInput.value = "";
      });

      itemsList.onclick = (e) => e.stopPropagation();

      for (let itemLine of itemsLines) {
        itemLine.onclick = () => {
          if (!this._badgesList.includes(itemLine.textContent)) {
            this.createFilterBadge(filter, itemLine.textContent);

            const recipesListToDisplay = this._recipesList.search(
              this._userRequest
            );

            this.renderFiltersOptions(
              this.getItemsListsToDisplay(recipesListToDisplay)
            );
            new SearchResultMessage(recipesListToDisplay);

            this.renderCards(recipesListToDisplay.recipes);

            window.scrollTo(0, 0);
          }
        };
      }
    }
  }

  /**
   *  Build ingredients, appliances and ustensils lists
   * @param {Array.string} itemsLists
   */
  renderFiltersOptions(itemsLists) {
    console.log("items  ", itemsLists);

    for (let filter of FILTERS) {
      const itemsList = document.getElementById(`${filter}-list`);

      let htmlContent = "";

      for (let item of itemsLists[filter]) {
        // console.log(this._badgesList);
        if (item != this._badgesList.filter((i) => i == item)) {
          htmlContent += `<li>${item}</li>`;
        }
      }

      itemsList.innerHTML = htmlContent;
    }

    resizeOpenedFilter();
    this.searchWithFilters();
  }
}
