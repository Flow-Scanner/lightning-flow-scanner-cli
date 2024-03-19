# Writing Custom Rules

## Rule Structure 
A custom rule class typically follows this structure:

```typescript
const core = await import('https://Lightning-Flow-Scanner.github.io/lightning-flow-scanner-core/types.d.ts');

export class CustomRule extends core.IRuleDefinition {
    execute(flow: core.Flow, ruleOptions?: {}): core.RuleResult {
        // Implement rule logic here
    }
}
```

In this example, a dynamic import is utilized to import types from our GitHub Pages, but you can also import the types from a local version of the core repo. The execute method within the CustomRule class can implement any logic while having access to the flow being analyzed and the user-provided configurations.

## Custom Rule Interface

When creating custom rules, it's essential to adhere to the IRuleDefinition interface, which defines the required properties and methods for a rule definition:

```typescript
export default interface IRuleDefinition {
  name: string;
  label: string;
  description: string;
  supportedTypes: string[];
  type: string;
  docRefs: { label: string, path: string }[];
  isConfigurable: boolean;
  uri?: string;
  severity?: string;

  execute(flow: Flow, ruleOptions?: {}): RuleResult;
}
```

## Flow Compiler
The Flow Compiler is a powerful tool provided by the Lightning Flow Scanner Core for creating custom rules that require traversal of flow elements. This compiler enables efficient traversal through flow elements and is particularly useful for implementing complex logic for rule enforcement.

### Compiler Overview:
The Compiler class consists of methods designed to traverse flow elements effectively:
- Constructor: The constructor initializes the visitedElements set, which keeps track of visited elements during traversal.
- traverseFlow Method: This method implements the Iterative Deepening Depth-First Search (IDDFS) algorithm for traversing flow elements. It iteratively explores each element, starting from a specified starting point, and visits each element by calling the provided callback function. The traversal continues until all elements are visited or until a specified end point is reached.
- findNextElements Method: This private method is used internally by the traverseFlow method to find the next elements to visit based on the connectors of the current element. It examines the connectors of the current element and identifies the next elements to traverse.