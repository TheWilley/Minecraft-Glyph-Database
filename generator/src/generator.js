const commandLineArgs = require("command-line-args");
const getTexturesFromMinecraft = require("./helpers/jarHelper");
const createJson = require("./helpers/jsonHelper");

/**
 * The primary function
 * @param {*} path The path to the game folder
 * @param {*} name The name of the output JSON
 * @param {*} skip If we shouldn't extract textures automatically
 */
function main(path, name, skip) {
  if (!skip) getTexturesFromMinecraft(path);
  createJson(name);
}

const optionDefinitions = [
  { name: "path", type: String, defaultOption: true },
  { name: "name", type: String },
  { name: "skip", type: Boolean },
];
const options = commandLineArgs(optionDefinitions);
main(options.path, options.name, options.skip);
