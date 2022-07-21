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
    this._renderCard(this._recipesList.recipes);
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
}
