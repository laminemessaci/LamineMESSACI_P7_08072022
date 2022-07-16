"use strict";

import { FRENCH_WORDS } from "../data/frenchWords.js";

const STOP_WORDS = [];

for (let word of FRENCH_WORDS) {
  STOP_WORDS.push(toNormalForm(word));
}

/**
 * @param {string} str
 * @returns {string}
 */
export function capitalizeFirstChar(str) {
  return str[0].toUpperCase() + str.slice(1);
}

/**
 *
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
 * @param {Array.string} words
 * @returns {Array.string}
 */
export function removeFrenchWords(words) {
  const trimmedWords = words.trim();
  const filteredWords = [];

  for (let word of trimmedWords) {
    let wordWithoutAccent = toNormalForm(word);

    if (word.length > 1 && !STOP_WORDS.includes(wordWithoutAccent)) {
      filteredWords.push(word);
    }
  }

  return filteredWords;
}

/**
 * @param {Array.string} strings
 * @returns {Array.string}
 */
export function sortAlphabetically(strings) {
  const nonAccentuatedStrings = [];

  for (let str of strings) {
    let nonAccentuatedStr = toNormalForm(str);

    nonAccentuatedStrings.push([str, nonAccentuatedStr]);
  }

  nonAccentuatedStrings.sort((arr1, arr2) => {
    return arr1[1]?.localeCompare(arr2[1]);
  });

  const sortedStrings = [];

  for (let arr of nonAccentuatedStrings) {
    sortedStrings.push(arr[0]);
  }

  return sortedStrings;
}
