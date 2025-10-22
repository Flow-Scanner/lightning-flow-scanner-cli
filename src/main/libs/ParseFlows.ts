import { promises as fs } from "fs";
import * as p from "path";
import { convert } from "xmlbuilder2";

import { Flow } from "../models/Flow";
import { ParsedFlow } from "../models/ParsedFlow";

export async function parse(selectedUris: string[]): Promise<ParsedFlow[]> {
  const parseResults: ParsedFlow[] = [];

  for (const uri of selectedUris) {
    try {
      const normalizedURI = p.normalize(uri);
      const content = await fs.readFile(normalizedURI, "utf8");
      const flowObj = convert(content, { format: "object" });
      parseResults.push(new ParsedFlow(uri, new Flow(uri, flowObj)));
    } catch (e: any) {
      parseResults.push(
        new ParsedFlow(uri, undefined, e.message ?? e.toString())
      );
    }
  }

  return parseResults;
}
