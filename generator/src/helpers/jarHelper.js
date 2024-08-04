const path = require("path");
const AdmZip = require("adm-zip");
const fs = require("fs");

/**
 * Checks if string is a valid x.x.x version format
 * @param {*} version The string to check
 * @returns Wether the string follows the format
 */
function isValidVersion(version) {
  // Ensure the version matches the x.x.x format
  const regex = /^\d+\.\d+\.\d+$/;
  return regex.test(version);
}

/**
 * Compares two versions in the x.x.x format
 * @param {*} version1 The first string
 * @param {*} version2 The second string
 * @returns Wether the first version is larger than the second
 */
function compareVersions(version1, version2) {
  const v1 = version1.split(".").map(Number);
  const v2 = version2.split(".").map(Number);

  for (let i = 0; i < 3; i++) {
    if (v1[i] > v2[i]) return 1;
    if (v1[i] < v2[i]) return -1;
  }
  return 0;
}

/**
 * Extract font specific textures from a Minecraft version
 * @param {*} jarFilePath The path to the Miencraft version `.jar` file
 * @param {*} folderPath The path to the assets within the `.jar` file
 * @param {*} outputDir The output directory to extract assets to
 */
function extractTexturesFromJar(jarFilePath, folderPath, outputDir) {
  try {
    const zip = new AdmZip(jarFilePath);
    const zipEntries = zip.getEntries();

    // Create the output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    zipEntries.forEach((entry) => {
      // Check if the entry is within the specified folder
      if (entry.entryName.startsWith(folderPath) && !entry.isDirectory) {
        const fileName = path.basename(entry.entryName);
        const fileOutputPath = path.join(outputDir, fileName);

        // Extract the file
        fs.writeFileSync(fileOutputPath, zip.readFile(entry));
        console.info(`Extracted: ${fileOutputPath}`);
      }
    });
  } catch (err) {
    console.error(`Error extracting folder from JAR file: ${err}`);
  }
}

/**
 * Gets textures from Minecraft source
 * @param {*} path The path to the Minecraft game folder
 */
function getTexturesFromMinecraft(path) {
  if (fs.existsSync(path)) {
    extractTexturesFromJar(
      path,
      "assets/minecraft/textures/font",
      "textures"
    );
  } else {
    console.error('error: "versions" folder not found, is the path correct?');
  }
}

module.exports = getTexturesFromMinecraft;
