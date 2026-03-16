import commandLineArgs from "command-line-args";
import {
  extractTexturesFromJar,
  extractProvidersFromMinecraft,
  extractVersionFromMinecraft,
} from "./helpers/jarHelper.js";
import { createJson } from "./helpers/jsonHelper.js";
import { checkPath } from "./helpers/miscellaneousHelper.js";

/**
 * The primary function
 * @param path The path to a Minecraft version JAR file
 */
function main(path: string) {
  if (!checkPath(path)) {
    console.error('error: "versions" folder not found, is the path correct?');
    return;
  }

  const version = extractVersionFromMinecraft(path);
  const textures = extractTexturesFromJar(
    path,
    "assets/minecraft/textures/font",
  );
  const providers = extractProvidersFromMinecraft(path);

  if (textures) {
    createJson(version, textures, providers);
    console.log("Done!");
  } else {
    console.error("Could not load textures");
    process.exit();
  }
}

const optionDefinitions = [{ name: "path", type: String, defaultOption: true }];
const options = commandLineArgs(optionDefinitions);
main(options.path);
