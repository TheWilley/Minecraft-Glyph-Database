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
 * @param text2bookReady If the generated json is to be used with Text2Book
 */
async function main(jarFilePath: string, text2bookReady: boolean) {
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

  // CreateJson handling
  const createdPath = await createJson(
    version.value,
    textures.value,
    providers.value,
    text2bookReady,
  );
  if (!createdPath.ok) {
    console.error("Error:", createdPath.error);
    process.exit(1);
  }

  console.log("-->", createdPath.value);
}

// Define options and run main function with parameters
const optionDefinitions = [
  { name: "path", type: String, defaultOption: true },
  { name: "ttb", type: Boolean },
];
const options = commandLineArgs(optionDefinitions);
main(options.path, options.ttb);
