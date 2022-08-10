import { FRENCH_WORDS } from "../../data/frenchWords.js";

const TRANSFORM_WORDS = [];

for (let word of FRENCH_WORDS) {
  TRANSFORM_WORDS.push(toNormalForm(word));
}

/**
 * *Capitalize First character
 * @param {string} str
 * @returns {string}
 */
export function capitalizeFirstChar(str) {
  return str[0].toUpperCase() + str.slice(1);
}

/**
 ** Keep only letters and remove accents
 * @param {string} str
 * @returns {string}
 */
export function toNormalForm(str) {
  return str
    .toLowerCase()
    .replace(/[.,;:!\?\*"()°]/g, "")
    .replace(/[']/g, " ")
    .replace(/[\d]/g, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 ** Remove French words from request User
 * @param {Array.string} words
 * @returns {Array.string}
 */
export function removeFrenchWords(words) {
  const filteredWords = [];

  for (let word of words) {
    let wordWithoutAccent = toNormalForm(word);

    if (word.length > 1 && !TRANSFORM_WORDS.includes(wordWithoutAccent)) {
      filteredWords.push(word);
    }
  }

  return filteredWords;
}

/**
 ** Transform Accented word and Sorts Alphabetically
 * @param {Array.string} strings
 * @returns {Array.string}
 */
export function sortAlphabetically(strings) {
  const nonAccentuatedStrings = [];

  for (let str of strings) {
    let nonAccentuatedStr = toNormalForm(str);

    nonAccentuatedStrings.push([str, nonAccentuatedStr]);
  }

  nonAccentuatedStrings.sort((a, b) => {
    return a[1]?.localeCompare(b[1]);
  });

  const sortedStrings = [];

  for (let arr of nonAccentuatedStrings) {
    sortedStrings.push(arr[0]);
  }

  return sortedStrings;
}
