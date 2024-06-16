/**
 * split string into characters, handling surrogate pairs
 * @param str Astring of UTF-8 characters
 * */
function splitIntoCharacters(str) {
  let result = [];
  for (let i = 0; i < str.length; i++) {
    let char = str.charAt(i);
    if (/[\uD800-\uDBFF]/.test(char) && i + 1 < str.length) {
      let surrogatePair = char + str.charAt(i + 1);
      result.push(surrogatePair);
      i++;
    } else {
      result.push(char);
    }
  }
  return result;
}

/**
 * Get raw Unicode code point of a given character
 * The character
 */
function getRawCodePoints(char) {
  // Check if the character is part of a surrogate pair
  if (char.length === 2) {
    // Calculate the code point of the surrogate pair
    let codePoint =
      (char.charCodeAt(0) - 0xd800) * 0x400 +
      (char.charCodeAt(1) - 0xdc00) +
      0x10000;
    return codePoint.toString(16).toUpperCase(); // Convert to hexadecimal string
  } else {
    // Get the code point of the regular character
    let codePoint = char.codePointAt(0);
    return codePoint.toString(16).toUpperCase(); // Convert to hexadecimal string
  }
}

module.exports = {splitIntoCharacters, getRawCodePoints}