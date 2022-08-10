import { BREAKPOINTS, ITEMS_HEIGHT } from "../../constants/index.js";

/**
 * Display ingredients, appliances or ustensils list on 1, 2 or 3 columns depending of window width.
 * @param {string} filter
 */
export const filterListSizer = (filter) => {
  const itemsList = document.getElementById(`${filter}-list`);
  const itemsLines = document.querySelectorAll(`#${filter}-list li`);

  const windowWidth = window.innerWidth;
  // console.log("windowWidth", windowWidth);
  const columnsInList =
    windowWidth < BREAKPOINTS.small
      ? 1
      : windowWidth < BREAKPOINTS.medium
      ? 2
      : 3;

  const itemsQuantity = itemsLines.length;

  itemsList.style.height = `${
    Math.ceil(itemsQuantity / columnsInList) * ITEMS_HEIGHT
  }px`;
};

/**
 * Resize opened ingredients, appliances or ustensils list.
 */
export const resizeOpenedFilter = () => {
  const openedItemsList = document.querySelector("ul:not(.closed)");

  // console.log("openedItemsList: ", openedItemsList);

  if (openedItemsList) {
    const filter = openedItemsList.getAttribute("data-filter");
    // console.log("filter => ", filter);
    filterListSizer(filter);
  }
};
