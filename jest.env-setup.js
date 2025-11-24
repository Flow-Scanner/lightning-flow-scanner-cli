const fs = require("fs");
const path = require("path");

module.exports = () => {
  if (process.env.UMD_PATH) {
    const umdFilePath = path.resolve(process.env.UMD_PATH);
    if (!fs.existsSync(umdFilePath)) {
      return; // Skip silently
    }

    let umdCode = fs.readFileSync(umdFilePath, "utf8");

    // Inject dep
    const fastXmlParser = require("fast-xml-parser");

    // Flexible regex
    const factoryMatch = umdCode.match(
      /function\(w,U\)\{["']use strict["'];\s*(.*)\}\)\);[\s\S]*$/s
    );
    if (factoryMatch) {
      const factoryBody = factoryMatch[1];
      try {
        const factory = new Function("w", "U", factoryBody);
        // Mimic UMD: Create sub-object, invoke on it
        const scanner = {};
        factory(scanner, fastXmlParser);
        global.lightningflowscanner = scanner;
      } catch (e) {
        // Silent fail or log minimally in prod—keep for dev
        console.error("UMD Factory error:", e.message);
      }
    }
  }
};
