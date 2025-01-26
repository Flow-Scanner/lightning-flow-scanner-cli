import p from "path-browserify";
import { Flow } from "../models/Flow";
import fs from "fs";
import { convert } from "xmlbuilder2";
import { ParsedFlow } from "../models/ParsedFlow";

export async function ParseFlows(selectedUris: string[]): Promise<ParsedFlow[]> {
  const parseResults: ParsedFlow[] = [];
  for (const uri of selectedUris) {
    try {
      console.log(`normalize uri ${uri}`);
      const normalizedURI = p.normalize(uri);
      const content = await fs.readFileSync(normalizedURI);
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
