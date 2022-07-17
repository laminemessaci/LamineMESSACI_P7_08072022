export class AdaptedRecipe {
  /**
   * @constructs
   * @param {number} id
   * @param {string} name
   * @param {number} servings
   * @param {Array.Object} ingredients
   * @param {number} time
   * @param {string} description
   * @param {string} appliance
   * @param {Array.string} ustensils
   */
  constructor(
    id,
    name,
    servings,
    ingredients,
    time,
    description,
    appliance,
    ustensils
  ) {
    this.id = id;
    this.name = name;
    this.servings = servings;
    this.ingredients = ingredients;
    this.time = time;
    this.description = description;
    this.appliance = appliance;
    this.ustensils = ustensils;
  }

  /**
   * @return {string}
   */
  get applianceNameWithoutAccent() {
    return toNormalForm(this.appliance);
  }

  /**
   * @returns {string}
   */
  get descriptionWithoutAccent() {
    return toNormalForm(this.description);
  }

  /**
   * @returns {string}
   */
  get joinedIngredientsWithoutAccent() {
    const ingredientsList = [];

    for (let item of this.ingredients) {
      ingredientsList.push(toNormalForm(item.ingredient));
    }

    return ingredientsList.join(" ");
  }

  /**
   * @returns {string}
   */
  get nameWithoutAccent() {
    return toNormalForm(this.name);
  }

  /**
   * @returns {string}
   */
  get joinedUstensilsWithoutAccent() {
    const ustensilsList = [];

    for (let ustensil of this.ustensils) {
      ustensilsList.push(toNormalForm(ustensil));
    }

    return ustensilsList.join(" ");
  }
}
