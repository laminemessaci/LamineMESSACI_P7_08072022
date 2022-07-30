import { FILTERS } from "../../constants/index.js";
import { toNormalForm } from "../../utils/formatString.js";
import { filterListSizer, resizeOpenedFilter } from "../../utils/resizer.js";
import { RecipeCard } from "../components/cards.js";

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
    this.searchWithSearchBar();
    this._renderFiltersOptions(this._filterItems);
    this._renderCards(this._recipesList.recipes);
    this._addOpenFiltersEvents();
    this._addAutoSizingFilterListsEvent();
    this._addCloseAllFiltersEvent();
  }

  _renderCards(list) {
    // console.log("list=========", list);
    const cardsWrapper = document.getElementById("cards-wrapper");

    let htmlContent = "";

    for (let i = 0; i < list.length; i++) {
      htmlContent += new RecipeCard(list[i], i).html;
    }

    cardsWrapper.innerHTML = htmlContent;
  }

  /**
   *  Build ingredients, appliances and ustensils lists
   * @param {Array.string} itemsLists
   */
  _renderFiltersOptions(itemsLists) {
    // console.log("items  ", itemsLists);

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

  /**
   * Manage filters options togglers
   *
   * @param {string} clickedFilter
   */
  _closeAllOthersFilters(clickedFilter) {
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
   * Event for Opening  the list of ingredients, ustensils and appliances
   */
  _addOpenFiltersEvents() {
    for (let filter of FILTERS) {
      const filterLabel = document.getElementById(`${filter}-filter-label`);
      const filterIcon = document.getElementById(`${filter}-filter-icon`);
      const filterInput = document.getElementById(`${filter}`);
      const itemsList = document.getElementById(`${filter}-list`);

      filterLabel.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();

        this._closeAllOthersFilters(filter);

        filterLabel.classList.toggle("clicked");
        filterIcon.classList.toggle("fa-chevton-down");
        filterIcon.classList.toggle("fa-chevron-up");
        itemsList.classList.toggle("closed");

        // resize items height depending on window width
        filterListSizer(filter);

        filterInput.focus();
      };

      filterInput.onclick = (e) => {
        e.stopPropagation();
      };
    }
  }

  /**
   * Resize opened ingredients/appliances/ustensils list when window is resized.
   */
  _addAutoSizingFilterListsEvent() {
    window.onresize = () => {
      resizeOpenedFilter();
    };
  }

  /**
   * Close all ingredients/appliances/ustensils lists.
   */
  _addCloseAllFiltersEvent() {
    const body = document.querySelector("body");

    body.onclick = () => {
      this._closeAllOthersFilters();
    };
  }

  /**
   * @param {RecipesList} recipesList
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
   * Add tag badge
   * @param {string} filter
   * @param {string} textContent
   */
  _createFilterBadge(filter, textContent) {
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
      } else {
        recipesListToDisplay = this._recipesList.search(this._userRequest);
      }

      // console.log("recipesListToDisplay", recipesListToDisplay);

      this._renderFiltersOptions(
        this.getItemsListsToDisplay(recipesListToDisplay)
      );
      this._renderCards(recipesListToDisplay.recipes);

      this._renderFiltersOptions(
        this.getItemsListsToDisplay(recipesListToDisplay)
      );
      this._renderCards(recipesListToDisplay.recipes);
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
        console.log(`User input for ${filter} >`, filterInput.value);

        let itemsListsToDisplay = {};
        Object.assign(itemsListsToDisplay, this._filterItems);
        console.log("items filter====", itemsListsToDisplay);

        itemsListsToDisplay[filter] = itemsListsToDisplay[filter].filter(
          (item) =>
            toNormalForm(item).startsWith(toNormalForm(filterInput.value))
        );

        this._renderFiltersOptions(itemsListsToDisplay);
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
            this._createFilterBadge(filter, itemLine.textContent);

            const recipesListToDisplay = this._recipesList.search(
              this._userRequest
            );

            this._renderFiltersOptions(
              this.getItemsListsToDisplay(recipesListToDisplay)
            );

            this._renderCards(recipesListToDisplay.recipes);

            window.scrollTo(0, 0);
          }
        };
      }
    }
  }

  searchWithSearchBar() {
    const searchBarForm = document.getElementById("search-bar-form");
    const searchBarInput = document.getElementById("search-bar-input");

    searchBarForm.onclick = (e) => e.preventDefault();
    searchBarForm.onclick = (e) => e.stopPropagation();

    // Close all others filters
    searchBarInput.onfocus = () => {
      this._closeAllOthersFilters();
    };

    searchBarInput.oninput = (e) => {
      let recipesListToDisplay;

      if (searchBarInput.value.length >= 3) {
        recipesListToDisplay = this.getRecipesListToDisplay();
      } else if (this._badgesList.length > 0) {
        recipesListToDisplay = this._recipesList.search({
          userInput: "",
          joinedBadges: this._userRequest.joinedBadges,
        });
      } else {
        recipesListToDisplay = this._recipesList;
      }

      this._renderFiltersOptions(
        this.getItemsListsToDisplay(recipesListToDisplay)
      );
      this._renderCards(recipesListToDisplay.recipes);
    };

    searchBarForm.onsubmit = (e) => {
      e.preventDefault();
      searchBarInput.blur();
    };
  }
}
