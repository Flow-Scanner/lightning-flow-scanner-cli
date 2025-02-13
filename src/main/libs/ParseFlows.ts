import * as p from "path";
import { Flow } from "../models/Flow";
import fs from "fs";
import { convert } from "xmlbuilder2";
import { ParsedFlow } from "../models/ParsedFlow";

export async function parse(selectedUris: string[]): Promise<ParsedFlow[]> {
  const parseResults: ParsedFlow[] = [];
  for (const uri of selectedUris) {
    try {
      const normalizedURI = p.normalize(uri);
      const fsPath = p.resolve(normalizedURI);
      let flowName = p.basename(p.basename(fsPath), p.extname(fsPath));
      if (flowName.includes(".")) {
        flowName = flowName.split(".")[0];
      }
      const content = await fs.readFileSync(normalizedURI);
      const xmlString = content.toString();
      const flowObj = convert(xmlString, { format: "object" });
      parseResults.push(new ParsedFlow(uri, new Flow(flowName, flowObj)));
    } catch (e) {
      parseResults.push(new ParsedFlow(uri, undefined, e.errorMessage));
    }
  }
  return parseResults;
}
