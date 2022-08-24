import { URL_DATA } from "../../constants/index.js";
import { DataManager } from "../services/dataManager.js";
import { getData } from "../services/getData.js";

const rawRecipesList = await getData(URL_DATA);

const dataManager = new DataManager(rawRecipesList.recipes);
const recipesList = dataManager.getRecipesList();

export const algorithmPerformance = () => {
  let RESULT_1, RESULT_2;

  const USER_REQUEST_ONE = {
    userInput: "tarte",
    joinedBadges: ["Beurre", "Casserole"],
  };
  const USER_REQUEST_TOW = {
    userInput: "coco",
    joinedBadges: "mais Basilic",
  };

  const RECIPES_COUNT = 2000;
  const STARTING_TIME = Date.now();

  for (let i = 0; i < RECIPES_COUNT; i++) {
    RESULT_1 = recipesList.search(USER_REQUEST_ONE);
    RESULT_2 = recipesList.search(USER_REQUEST_TOW);
  }

  const ENDING_TIME = Date.now();

  const DURATION = ENDING_TIME - STARTING_TIME;

  console.log(
    `\n=== > ${2 * RECIPES_COUNT} recherches réalisées en ${DURATION} ms`
  );
};
