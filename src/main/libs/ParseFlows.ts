import { Flow } from "../models/Flow";
import { ParsedFlow } from "../models/ParsedFlow";

import p from "path-browserify";
import fs from "fs";
import { convert } from "xmlbuilder2";

export async function ParseFlows(selectedUris: string[]): Promise<ParsedFlow[]> {
  const parseResults: ParsedFlow[] = [];
  for (const uri of selectedUris) {
    try {
      const normalizedURI = p.normalize(uri);
      const content = await fs.readFileSync(normalizedURI);
      const xmlString = content.toString();
      const flowObj = convert(xmlString, { format: "object" });
      parseResults.push(new ParsedFlow(uri, new Flow(uri, flowObj)));
    } catch (e) {
      parseResults.push(new ParsedFlow(uri, undefined, e));
    }
  }
  return parseResults;
}
