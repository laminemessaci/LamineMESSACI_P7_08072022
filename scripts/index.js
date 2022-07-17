// import { sortAlphabetically, toNormalForm } from "../utils/formatString.js";

import { URL_DATA } from "../constants/index.js";
import { AdaptedRecipe } from "../model/adaptedRecipe.js";
import { RecipesList } from "../model/recipesList.js";
import { DataManager } from "./services/dataManager.js";
import { getData } from "./services/getData.js";

// const originalText = "éàçèñ A blabla méléçondre ";
// const result = toNormalForm(originalText);
// console.log(result);

// const strings = ["toi", "moi", "loui ", "farida", "naima", "yoco", "aya"];

// console.log("sorted string ", sortAlphabetically(strings));

const rawRecipesList = await getData(URL_DATA);

const dataManager = new DataManager(rawRecipesList.recipes);
const recipesList = dataManager.getRecipesList();

console.log("data filtred == ", recipesList);
