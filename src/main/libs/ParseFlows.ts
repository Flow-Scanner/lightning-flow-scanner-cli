// import p from "path-browserify";
import { Flow } from "../models/Flow";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { convert } from "xmlbuilder2";
import { realpath } from "fs/promises";
import { ParsedFlow } from "../models/ParsedFlow";

export async function ParseFlows(selectedUris: string[]): Promise<ParsedFlow[]> {
  const parseResults: ParsedFlow[] = [];
  for (const uri of selectedUris) {
    try {
      const resolvePath = await realpath(uri);
      const content = await readFile(fileURLToPath(`file:${resolvePath}`));
      const xmlString = content.toString();
      const flowObj = convert(xmlString, { format: "object" });
      console.log(`flowObj ${JSON.stringify(flowObj, null, 2)}`);
      parseResults.push(new ParsedFlow(uri, new Flow(uri, flowObj)));
    } catch (e) {
      parseResults.push(new ParsedFlow(uri, undefined, e));
    }
  }
  return parseResults;
}
