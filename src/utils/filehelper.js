const fs = require("fs").promises;
const path = require("path");

/**
 * Read and parse character data from a JSON file
 * @param {string} filename - Name of the character data file
 * @returns {Promise<Object>} Parsed character data
 */
async function readCharacterData(filename) {
  try {
    const filePath = path.join(__dirname, "../data", filename);
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(`Character file ${filename} not found`);
    }
    throw new Error(`Error reading character file: ${error.message}`);
  }
}

module.exports = {
  readCharacterData,
};
