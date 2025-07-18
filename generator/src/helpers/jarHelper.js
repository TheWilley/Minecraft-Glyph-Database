const path = require("path");
const AdmZip = require("adm-zip");

/**
 * Converts an ArrayBuffer to a Base64 encoded string.
 *
 * @param {ArrayBuffer} buffer - The ArrayBuffer to convert.
 * @returns {string} The Base64 encoded string representation of the buffer.
 */
function arrayBufferToBase64(buffer) {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}


/**
 * Extract font specific textures from a Minecraft version
 * @param {*} jarFilePath The path to the Miencraft version `.jar` file
 * @param {*} folderPath The path to the assets within the `.jar` file
 */
function extractTexturesFromJar(jarFilePath, folderPath) {
  try {
    const textures = []
    const zip = new AdmZip(jarFilePath);
    const zipEntries = zip.getEntries();

    zipEntries.forEach((entry) => {
      // Check if the entry is within the specified folder
      if (entry.entryName.startsWith(folderPath) && !entry.isDirectory) {
        const fileName = path.basename(entry.entryName);

        textures.push({ fileName, base64: arrayBufferToBase64(zip.readFile(entry)) })

      }
    });

    return textures
  } catch (err) {
    console.error(`Error extracting folder from JAR file: ${err}`);
  }
}

/**
 * Extracts font provider JSONs from a Minecraft JAR and maps them to logical names.
 * @param {string} jarFilePath - Path to the Minecraft .jar file.
 * @returns {Object<string, any>} Mapped providers as { name: jsonContent }
 */
function extractProvidersFromMinecraft(jarFilePath) {
  try {
    const zip = new AdmZip(jarFilePath);
    const zipEntries = zip.getEntries();

    const providerMap = {
      'assets/minecraft/font/alt.json': 'ascii_sga',
      'assets/minecraft/font/illageralt.json': 'asciillager',
      'assets/minecraft/font/include/default.json': ['nonlatin_european', 'accented', 'ascii'],
      'assets/minecraft/font/include/space.json': 'space',
    };

    const result = {};

    zipEntries.forEach((entry) => {
      if (
        !entry.isDirectory &&
        entry.entryName.endsWith('.json') &&
        providerMap.hasOwnProperty(entry.entryName)
      ) {
        const json = JSON.parse(entry.getData().toString('utf8'));
        const mappedName = providerMap[entry.entryName];

        if (Array.isArray(mappedName)) {
          mappedName.forEach((name) => {
            result[name] = json;
          });
        } else {
          result[mappedName] = json;
        }
      }
    });

    return result;
  } catch (err) {
    console.error(`Error extracting font providers from JAR: ${err}`);
    return {};
  }
}

module.exports = { extractTexturesFromJar, extractProvidersFromMinecraft };
