const commandLineArgs = require("command-line-args");
const { extractTexturesFromJar, extractProvidersFromMinecraft, extractVersionFromMinecraft } = require("./helpers/jarHelper");
const createJson = require("./helpers/jsonHelper");
const { checkPath } = require('./helpers/miscellaneousHelper')

/**
 * The primary function
 * @param {*} path The path to a Minecraft version JAR file
 */
function main(path, name) {
  if (!checkPath(path)) {
    console.error('error: "versions" folder not found, is the path correct?');
    return
  }

  const version = extractVersionFromMinecraft(
    path,
  )
  const textures = extractTexturesFromJar(
    path,
    "assets/minecraft/textures/font",
  );
  const providers = extractProvidersFromMinecraft(
    path,
    "assets/minecraft/font"
  )

  createJson(name, version, textures, providers);

  console.log('Done!')
}

const optionDefinitions = [
  { name: "path", type: String, defaultOption: true },
  { name: "name", type: String },
];
const options = commandLineArgs(optionDefinitions);
main(options.path, options.name);
