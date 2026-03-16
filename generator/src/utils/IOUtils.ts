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
