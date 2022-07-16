import { sortAlphabetically, toNormalForm } from "../utils/formatString.js";

const originalText = "éàçèñ A blabla méléçondre ";
const result = toNormalForm(originalText);
console.log(result);

const strings = ["toi", "moi", "loui ", "farida", "naima", "yoco", "aya"];

console.log("sorted string ", sortAlphabetically(strings));
