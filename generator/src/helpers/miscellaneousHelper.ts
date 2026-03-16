import fs from "fs";

/**
 * Checks whether a given directory path exists.
 *
 * @param path The file or directory path to check.
 * @returns True if the path exists, false otherwise.
 */
export function checkFolderPath(path: string) {
  if (fs.existsSync(path)) {
    return true;
  } else {
    return false;
  }
}

/**
 * Calculates the dimensions of a 2D array or array of strings, ignoring specified characters.
 *
 * @param arr The 2D array or array of strings to measure.
 * @param ignores An array of characters (or any values) to ignore when calculating column lengths.
 * @returns An object containing the number of rows and the maximum number of columns.
 */
export function get2dArrayDimensions(arr: string[], ignores: string[]) {
  if (!Array.isArray(arr)) {
    throw new Error("Input must be an array.");
  }

  const rows = arr.length;

  if (rows === 0) {
    return { rows: 0, columns: 0 };
  }

  const charactersToIgnore = Array.isArray(ignores) ? ignores : [];

  const columns = arr.reduce((maxCols, currentRow) => {
    let effectiveRow;

    if (Array.isArray(currentRow)) {
      effectiveRow = currentRow;
    } else if (typeof currentRow === "string") {
      effectiveRow = Array.from(currentRow);
    } else {
      return maxCols;
    }

    const effectiveRowLength = effectiveRow.filter(
      (item) => !charactersToIgnore.includes(item),
    ).length;
    return Math.max(maxCols, effectiveRowLength);
  }, 0);

  return {
    rows: rows,
    columns: columns,
  };
}
