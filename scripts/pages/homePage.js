import { BREAKPOINTS, FILTERS } from "../../constants/index.js";
import { filterListSizer } from "../../utils/resizer.js";
import { RecipeCard } from "../components/cards.js";

export default class HomePage {
  constructor(recipesList) {
    this._recipesList = recipesList;
    this._badgesList = new Array();
    this._filterItems = {
      ingredient: this._recipesList.sortedIngredients,
      appliance: this._recipesList.sortedAppliances,
      ustensil: this._recipesList.sortedUstensils,
    };
  }

  render() {
    this._renderFiltersOptions(this._filterItems);
    this._renderCard(this._recipesList.recipes);
    this._addOpenFiltersEvents();
  }

  _renderCard(list) {
    const cardsWrapper = document.getElementById("cards-wrapper");
    console.log("list :", list);

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
    for (let filter of FILTERS) {
      const itemsList = document.getElementById(`${filter}-list`);

      let htmlContent = "";

      for (let item of itemsLists[filter]) {
        htmlContent += `<li>${item}</li>`;
      }

      itemsList.innerHTML = htmlContent;
    }
  }

  /**
   * Manage filters options togglers
   *
   * @param {string} clickedFilter
   */
  _closeAllFiltersExceptClicked(clickedFilter) {
    for (let filter of FILTERS) {
      if (filter !== clickedFilter) {
        const filterLabel = document.getElementById(`${filter}-filter-label`);
        const filterIcon = document.getElementById(`${filter}-filter-icon`);
        const itemsList = document.getElementById(`${filter}-list`);

        filterLabel.classList.remove("clicked");
        filterIcon.classList.add("fa-chevron-down");
        filterIcon.classList.remove("fa-chevron-up");
        itemsList.classList.add("closed");

        itemsList.style.height = 0;
      }
    }
  }


  /**
   * 
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

        this._closeAllFiltersExceptClicked(filter);

        filterLabel.classList.toggle("clicked");
        filterIcon.classList.toggle("fa-chevton-down");
        filterIcon.classList.toggle("fa-chevron-up");
        itemsList.classList.toggle("closed");

        filterListSizer(filter);

        filterInput.focus();
      };

      filterInput.onclick = (e) => {
        e.stopPropagation();
      };
    }
  }
}
