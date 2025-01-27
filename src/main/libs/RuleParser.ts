import * as ts from "typescript";
import * as fs from "fs";
import { IRuleDefinition } from "../interfaces/IRuleDefinition";

export class RuleParser {
  static parseRuleFile(filePath: string): IRuleDefinition | undefined {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const sourceFile = ts.createSourceFile(filePath, fileContent, ts.ScriptTarget.ESNext);

    let ruleDefinition: IRuleDefinition | undefined;

    function visit(node: ts.Node) {
      if (ts.isClassDeclaration(node)) {
        const className = node.name?.escapedText;
        if (className) {
          const methods = node.members.filter((member) =>
            ts.isMethodDeclaration(member)
          ) as ts.MethodDeclaration[];
          const requiredMethods = ["execute"];
          const methodNames = methods.map((method) => method.name?.["escapedText"]);
          // TODO: revisit this statement. doesn't make sense
          const implementsMethods = requiredMethods.every((methodName) =>
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            methods.some((method) => methodNames.includes(methodName))
          );
          const properties = node.members.filter((member) =>
            ts.isPropertyDeclaration(member)
          ) as ts.PropertyDeclaration[];
          const requiredProperties = [
            "name",
            "label",
            "description",
            "supportedTypes",
            "type",
            "docRefs",
            "isConfigurable",
          ];
          const propertyNames = properties.map((property) => property.name?.["escapedText"]);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const implementsProperties = requiredProperties.every((propertyName) =>
            propertyNames.includes(propertyName)
          );
          if (implementsMethods) {
            ruleDefinition = RuleParser.extractRuleDefinition(node);
          }
        }
      }
      ts.forEachChild(node, visit);
    }

    ts.forEachChild(sourceFile, visit);
    return ruleDefinition;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static extractRuleDefinition(classDeclaration: ts.ClassDeclaration): IRuleDefinition {
    // Extract relevant information from the class declaration
    // and create an instance of IRuleDefinition
    return {} as unknown as IRuleDefinition;
  }
}
