// import { sortAlphabetically, toNormalForm } from "../utils/formatString.js";

import { URL_DATA } from "../constants/index.js";
import { algorithmPerformance } from "../utils/performancesTest.js";
import HomePage from "./pages/homePage.js";
import { DataManager } from "./services/dataManager.js";
import { getData } from "./services/getData.js";

const rawRecipesList = await getData(URL_DATA);

const dataManager = new DataManager(rawRecipesList.recipes);
const recipesList = dataManager.getRecipesList();

// Display RcipesList cards
new HomePage(recipesList).render();

// Test algorithm Performances
//algorithmPerformance();
