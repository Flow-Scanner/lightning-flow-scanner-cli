import p from "path-browserify";
import { Flow } from "../models/Flow";
import * as fs from "fs";
import { convert } from "xmlbuilder2";
import { ParsedFlow } from "../models/ParsedFlow";

export async function ParseFlows(selectedUris: string[]): Promise<ParsedFlow[]> {
  let parseResults: ParsedFlow[] = [];
  for (let uri of selectedUris) {
    try {
      let normalizedURI = p.normalize(uri);
      let content = await fs.readFileSync(normalizedURI);
      let xmlString = content.toString();
      const flowObj = convert(xmlString, { format: "object" });
      parseResults.push(new ParsedFlow(uri, new Flow(uri, flowObj)));
    } catch (e) {
      parseResults.push(new ParsedFlow(uri, undefined, e.errorMessage));
    }
  }
  return parseResults;
}
