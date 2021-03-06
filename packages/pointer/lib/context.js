"use strict";

const validArrayToken = require("./validArrayToken");
const OBJECT = "object";

/**
 * Get the last token and parent
 *
 * @param {Object|Array} doc     - JSON document
 * @param {Array}        tokens  - array of tokens
 * @return {Array}               - [token, target]
 */
module.exports = function context(doc, tokens) {
  const length = tokens.length;

  let i = 0;
  let target = doc;
  let token;

  while (i < length - 1) {
    token = tokens[i++];

    if (Array.isArray(target)) {
      validArrayToken(token, target.length);
    } else if (typeof target !== OBJECT || target === null) {
      throw new Error("Cannot be walked");
    }

    if (typeof Map !== "undefined" && target instanceof Map) {
      target = target.get(token);
    } else if (typeof Set !== "undefined" && target instanceof Set) {
      let c = 0;
      target.forEach(function (item) {
        // eslint-disable-line
        if (c === +token) target = item;
        else c++;
      });
    } else {
      target = target[token];
    }
  }

  token = tokens[i];

  if (Array.isArray(target)) {
    validArrayToken(token, target.length);
  } else if (typeof target !== OBJECT || target === null) {
    throw new Error("Invalid target");
  }

  return [token, target];
};
