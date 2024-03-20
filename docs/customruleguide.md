# Writing Custom Rules

## Rule Structure 
A custom rule class typically follows this structure:

```typescript
// Import necessary types and classes from a local core module
import { Flow, FlowAttribute, FlowType, IRuleDefinition, ResultDetails, RuleResult } from './lightning-flow-scanner-core/src/index';

export class CustomNamingConvention implements IRuleDefinition{

  name: string;
  label: string;
  description: string;
  type:string;
  supportedTypes:string[];
  isConfigurable: boolean;
  docRefs: any;

  constructor(){
    this.name = 'CustomNamingConvention';
    this.label = 'Custom Naming Convention';
    this.description='custom execute function ';
    this.type = 'flow';
    this.supportedTypes = FlowType.allTypes();
    isConfigurable: true;
  }

  // Create custom execute logic
  public execute(flow: Flow, options?: { expression: string }): RuleResult {

    const conventionApplied = (flow.name)?.startsWith('AcmeCorp_]');
    return (!conventionApplied ?
      new RuleResult(this, [new ResultDetails(new FlowAttribute(flow.name, 'name', 'The Name needs to start with AcmeCorp_'))]) :
      new RuleResult(this, []));
  }
}

```

In this code:
- We're importing necessary types and classes from the local core repository using a relative path (./lightning-flow-scanner-core/src/index). Make sure to adjust the path according to your local Core Module.
- We're defining the CustomNamingConvention class, implementing the IRuleDefinition interface.
- We're setting up the class properties such as name, label, description, etc., as per your provided example.
- We're implementing the execute method, which performs the custom logic for your rule. This method takes a Flow object as input and returns a RuleResult.

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
