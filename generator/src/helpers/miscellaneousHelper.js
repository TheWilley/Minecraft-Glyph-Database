const fs = require("fs");

/**
 * Checks whether a given file or directory path exists.
 *
 * @param {string} path - The file or directory path to check.
 * @returns {boolean} True if the path exists, false otherwise.
 */

function checkPath(path) {
    if (fs.existsSync(path)) {
        return true
    } else {
        return false
    }
}

/**
 * Calculates the dimensions of a 2D array.
 *
 * @param {Array<Array<any>>} arr - The 2D array to measure.
 * @returns {[number, number]} A tuple containing the number of rows and the maximum number of columns.
 */
function get2dArrayDimensions(arr) {
    return [
        arr.length,
        arr.reduce((x, y) => Math.max(x, y.length), 0)
    ];
}

module.exports = { checkPath, get2dArrayDimensions }