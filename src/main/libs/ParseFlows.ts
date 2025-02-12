import p from "path";
import { Flow } from "../models/Flow";
import * as fs from "fs";
import { convert } from "xmlbuilder2";
import { ParsedFlow } from "../models/ParsedFlow";

export async function ParseFlows(selectedUris: string[]): Promise<ParsedFlow[]> {
  let parseResults: ParsedFlow[] = [];
  for (let uri of selectedUris) {
    try {
      let normalizedURI = p.normalize(uri);
      let fsPath = p.resolve(normalizedURI);
      let flowName = p.basename(p.basename(fsPath), p.extname(fsPath));
      if (flowName.includes(".")) {
        flowName = flowName.split(".")[0];
      }
      let content = await fs.readFileSync(normalizedURI);
      let xmlString = content.toString();
      const flowObj = convert(xmlString, { format: "object" });
      parseResults.push(new ParsedFlow(uri, new Flow(flowName, flowObj)));
    } catch (e) {
      parseResults.push(new ParsedFlow(uri, undefined, e.errorMessage));
    }
  }
  return parseResults;
}
