/**
 * split string into characters, handling surrogate pairs
 * @param str A string of UTF-8 characters
 * */
export function splitIntoCharacters(str: string) {
  const result = [];
  for (let i = 0; i < str.length; i++) {
    const char = str.charAt(i);
    if (/[\uD800-\uDBFF]/.test(char) && i + 1 < str.length) {
      const surrogatePair = char + str.charAt(i + 1);
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
 * @param char The character to get unicode for
 */
export function getRawCodePoints(char: string) {
  // Check if the character is part of a surrogate pair
  if (char.length === 2) {
    // Calculate the code point of the surrogate pair
    const codePoint =
      (char.charCodeAt(0) - 0xd800) * 0x400 +
      (char.charCodeAt(1) - 0xdc00) +
      0x10000;
    return codePoint.toString(16).toUpperCase(); // Convert to hexadecimal string
  } else {
    // Get the code point of the regular character
    const codePoint = char.codePointAt(0);
    if (codePoint) {
      return codePoint.toString(16).toUpperCase(); // Convert to hexadecimal string
    }
  }
}
