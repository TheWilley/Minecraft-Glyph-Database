import path from "path";
import AdmZip from "adm-zip";
import type { Proivder, Result, TextureBuffer } from "../global/types.js";
import { paths } from "../static/paths.js";
import { PROVIDER_MAP } from "../static/providers.js";

/**
 * Extract font specific textures from a Minecraft version
 * @param jarFilePath The path to the Minecraft version `.jar` file
 */
export function extractTexturesFromJar(
  jarFilePath: string,
): Result<TextureBuffer[], string> {
  try {
    // Create zip instance
    const textureBuffers: TextureBuffer[] = [];
    const zip = new AdmZip(jarFilePath);
    const zipEntries = zip.getEntries();

    zipEntries.forEach((entry) => {
      if (
        entry.entryName.startsWith(paths.FONT_TEXTURES_PATH) &&
        !entry.isDirectory
      ) {
        const fileName = path.basename(entry.entryName);
        textureBuffers.push({ fileName, buffer: zip.readFile(entry) });
      }
    });

    return { ok: true, value: textureBuffers };
  } catch (err) {
    return {
      ok: false,
      error: `Could not extract textures from JAR file: ${err}`,
    };
  }
}

/**
 * Extracts the Minecraft version ID from a version JAR file.
 *
 * Looks for a file named "version.json" in the root of the JAR and returns
 * the value of its "id" field, which typically contains the version string (e.g., "1.20.1").
 *
 * @param jarFilePath The path to the Minecraft version JAR file.
 * @returns The version ID if found, otherwise null.
 */
export function extractVersionFromMinecraft(
  jarFilePath: string,
): Result<string, string> {
  try {
    // Create zip instance
    const zip = new AdmZip(jarFilePath);
    const versionEntry = zip.getEntry("version.json");

    // We may not be able to find versions should a generic JAR be read
    if (!versionEntry) {
      return { ok: false, error: "Could not find versions.json in JAR" };
    }

    const data = versionEntry.getData().toString("utf8");
    const json: { id: string } = JSON.parse(data);
    return { ok: true, value: json.id };
  } catch (err) {
    return { ok: false, error: `Could not extract version from JAR: ${err}` };
  }
}

/**
 * Extracts all bitmap font providers from known font files inside a Minecraft JAR,
 * and adds a `name` field derived from the file path (after /font/).
 *
 * @param jarFilePath - Path to the Minecraft .jar file.
 * @returns An array of bitmap provider objects with `name` fields.
 */
export function extractProvidersFromMinecraft(
  jarFilePath: string,
): Result<Proivder[], string> {
  try {
    // Create zip instance
    const zip = new AdmZip(jarFilePath);
    const zipEntries = zip.getEntries();

    // Used later
    const bitmapProviders: Proivder[] = [];

    // Loop trough each entry
    zipEntries.forEach((entry) => {
      if (
        !entry.isDirectory &&
        entry.entryName.endsWith(".json") &&
        PROVIDER_MAP.hasOwnProperty(entry.entryName)
      ) {
        const json = JSON.parse(entry.getData().toString("utf8"));
        const providers = json.providers as Proivder;

        if (Array.isArray(providers)) {
          providers.forEach((provider) => {
            if (
              provider.type === "bitmap" &&
              typeof provider.file === "string"
            ) {
              const match = provider.file.match(/font\/(.+?)\.png/);
              if (match && match[1]) {
                provider.name = match[1];
              } else {
                provider.name = "unknown";
              }

              bitmapProviders.push(provider);
            }
          });
        }
      }
    });

    return { ok: true, value: bitmapProviders };
  } catch (err) {
    return {
      ok: false,
      error: `Could not extract bitmap providers from JAR: ${err}`,
    };
  }
}
