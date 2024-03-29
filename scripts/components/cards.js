export class RecipeCard {
  /**
   * @constructs
   * @param {Recipe} recipe
   * @param {number} cardNumber
   */
  constructor(recipe, cardNumber) {
    this._recipe = recipe;
    this._cardNumber = cardNumber;
  }

  /**
   * @returns {string}
   */
  _ingredientsHtml() {
    let htmlContent = "";

    for (let ingredient of this._recipe.ingredients) {
      let ingredientQuantity = ingredient.quantity
        ? ingredient.unit
          ? `&nbsp;: ${ingredient.quantity}&nbsp;${ingredient.unit}`
          : `&nbsp;: ${ingredient.quantity}`
        : "";

      htmlContent += `<p><strong> ${ingredient.ingredient} </strong> ${ingredientQuantity} </p>`;
    }

    return htmlContent;
  }

  /**
   * @returns {HTMLElement} article
   */
  get html() {
    let photo = "";
    photo = this._recipe.name.toLowerCase().replace(/\s/g, "");

    return `<article class="card lg4 md6 sm12" data-card-id="${
      this._cardNumber
    }">
        <div><img class="card__img" src="assets/images/${photo}.jpg" alt="${
      this._recipe.name
    }"></div> </div>
        <div class="card__body">
          <h2 class="card__title">
            <span class="name">${this._recipe.name}</span>
            <span class="duration">
              <i class="far fa-clock"></i>
              ${this._recipe.time} min
            </span>
          </h2>

          <div class="card__recipe row-12 has-gutter-lg">
            <div class="card__ingredients lg6 md6 sm6">
              ${this._ingredientsHtml()}
            </div>

            <div class="card__description lg6 md6 sm6">
              <p>${this._recipe.description}</p>
            </div>
          </div>
        </div>
      </article>`;
  }
}
