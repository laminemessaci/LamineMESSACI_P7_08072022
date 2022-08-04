import { FILTERS } from "../../constants/index.js";
import { filterListSizer, resizeOpenedFilter } from "../utils/resizer.js";

/**
 * Event for Opening  the list of ingredients, ustensils and appliances
 */
export function addOpenFiltersEvents() {
  for (let filter of FILTERS) {
    const filterLabel = document.getElementById(`${filter}-filter-label`);
    const filterIcon = document.getElementById(`${filter}-filter-icon`);
    const filterInput = document.getElementById(`${filter}`);
    const itemsList = document.getElementById(`${filter}-list`);

    filterLabel.onclick = (e) => {
      e.stopPropagation();
      e.preventDefault();

      closeAllOthersFilters(filter);

      filterLabel.classList.toggle("clicked");
      filterIcon.classList.toggle("fa-chevton-down");
      filterIcon.classList.toggle("fa-chevron-up");
      itemsList.classList.toggle("closed");

      // resize itemsfilterListSizer height depending on window width
      filterListSizer(filter);

      filterInput.focus();
    };

    filterInput.onclick = (e) => {
      e.stopPropagation();
    };
  }
}

/**
 * Close all ingredients/appliances/ustensils lists.
 */
export function addCloseAllFiltersEvent() {
  const body = document.querySelector("body");

  body.onclick = () => {
    closeAllOthersFilters();
  };
}

/**
 * Resize opened ingredients/appliances/ustensils list when window is resized.
 */
export function addAutoSizingFilterListsEvent() {
  window.onresize = () => {
    resizeOpenedFilter();
  };
}

/**
 * Manage filters options togglers
 *
 * @param {string} clickedFilter
 */
export function closeAllOthersFilters(clickedFilter) {
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
