const path = require("path");
const AdmZip = require("adm-zip");

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

        textures.push({ fileName, buffer: zip.readFile(entry) })

      }
    });

    return textures
  } catch (err) {
    console.error(`Error extracting textures from JAR file: ${err}`);
  }
}

/**
 * Extracts the Minecraft version ID from a version JAR file.
 *
 * Looks for a file named "version.json" in the root of the JAR and returns
 * the value of its "id" field, which typically contains the version string (e.g., "1.20.1").
 *
 * @param {string} jarFilePath The path to the Minecraft version JAR file.
 * @returns {string|null} The version ID if found, otherwise null.
 */
function extractVersionFromMinecraft(jarFilePath) {
  try {
    const zip = new AdmZip(jarFilePath);
    const versionEntry = zip.getEntry('version.json');

    if (versionEntry) {
      const data = versionEntry.getData().toString('utf8');
      const json = JSON.parse(data);
      return json.id || null;
    }

    return null;
  } catch (err) {
    console.error(`Error extracting version from JAR: ${err}`);
    return null;
  }
}

/**
 * Extracts all bitmap font providers from known font files inside a Minecraft JAR,
 * and adds a `name` field derived from the file path (after /font/).
 *
 * @param {string} jarFilePath - Path to the Minecraft .jar file.
 * @returns {Array<Object>} An array of bitmap provider objects with `name` fields.
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

    const bitmapProviders = [];

    zipEntries.forEach((entry) => {
      if (
        !entry.isDirectory &&
        entry.entryName.endsWith('.json') &&
        providerMap.hasOwnProperty(entry.entryName)
      ) {
        const json = JSON.parse(entry.getData().toString('utf8'));
        const providers = json.providers;

        if (Array.isArray(providers)) {
          providers.forEach((provider) => {
            if (provider.type === 'bitmap' && typeof provider.file === 'string') {
              const match = provider.file.match(/font\/(.+?)\.png/);
              if (match && match[1]) {
                provider.name = match[1];
              } else {
                provider.name = 'unknown';
              }

              bitmapProviders.push(provider);
            }
          });
        }
      }
    });

    return bitmapProviders;
  } catch (err) {
    console.error(`Error extracting bitmap providers from JAR: ${err}`);
    return [];
  }
}

module.exports = { extractTexturesFromJar, extractProvidersFromMinecraft, extractVersionFromMinecraft };
