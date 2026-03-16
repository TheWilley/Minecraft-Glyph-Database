import commandLineArgs from "command-line-args";
import {
  extractTexturesFromJar,
  extractProvidersFromMinecraft,
  extractVersionFromMinecraft,
} from "./utils/jarUtils.js";
import { createJson } from "./utils/jsonUtils.js";
import { checkFolderPath } from "./utils/IOUtils.js";

/**
 * Program entry
 * @param jarFilePath The path to a Minecraft version JAR file
 */
function main(jarFilePath: string) {
  // Check that the path exists at all
  if (!checkFolderPath(jarFilePath)) {
    console.error("Error:", "Folder does not exist, is the path correct?");
    process.exit(1);
  }

  // Version handling
  const version = extractVersionFromMinecraft(jarFilePath);
  if (!version.ok) {
    console.error("Error:", version.error);
    process.exit(1);
  }

  // Textures handling
  const textures = extractTexturesFromJar(jarFilePath);
  if (!textures.ok) {
    console.error("Error:", textures.error);
    process.exit(1);
  }

  // Providers handling
  const providers = extractProvidersFromMinecraft(jarFilePath);
  if (!providers.ok) {
    console.error("Error:", providers.error);
    process.exit(1);
  }

  // Check that there are textures to process
  if (!textures.value.length) {
    console.error("Error:", "Textures are empty");
    process.exit(1);
  }

  createJson(version.value, textures.value, providers.value);

  console.log("Done!");
}

// Define options and run main function with parameters
const optionDefinitions = [{ name: "path", type: String, defaultOption: true }];
const options = commandLineArgs(optionDefinitions);
main(options.path);
