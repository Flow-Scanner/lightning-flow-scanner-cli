# Lightning Flow Scanner Demo Repository

This directory contains sample Salesforce Flows used to demo Lightning Flow Scanner rules.

You can:

- Use these flows to demo scanner output.
- Deploy them to an Org for integrated tests.

## Available Flows

| Flow Name                          | Description                                                                 |
|------------------------------------|-----------------------------------------------------------------------------|
| Action_Call_In_Loop                | Apex actions or calls placed inside loops.                                  |
| DML_Statement_In_A_Loop            | DML operations inside loops, risking governor limits.                       |
| Duplicate_DML_Operation            | Duplicate DML operations, e.g., due to screen navigation.                   |
| Excessive_Cyclomatic_Complexity    | High-complexity flow with many loops and decisions.                         |
| Flow_Naming_Convention             | Flow with non-descriptive or inconsistent naming.                           |
| Get_Records_Stores_All_Fields      | Get Records retrieving all fields unnecessarily.                            |
| Hardcoded_Id                       | Flow using hardcoded record IDs instead of variables.                       |
| Hardcoded_URL                      | Flow containing hardcoded URLs.                                             |
| Inactive_Flow                      | Inactive flow that may need review or activation.                           |
| Invalid_API_Version                | Flow using an outdated API version.                                         |
| Missing_Auto_Layout                | Flow that should use the deprecated auto-layout canvas but is using free-form (or demonstrates a rule related to missing/recommended auto-layout migration). |
| Missing_Fault_Path                 | Flow without fault paths for error handling.                                |
| Missing_Flow_Description           | Flow lacking a proper description for documentation.                        |
| Missing_Null_Handler               | Get Records elements without null checks after query.                       |
| Missing_Trigger_Order              | Flow missing proper trigger order handling.                                 |
| Recursive_After_Update_Example     | Flow demonstrating potential recursion in after-update triggers.            |
| Same_Record_Field_Updates          | Multiple updates on the same record fields inefficiently.                   |
| SOQL_Query_In_A_Loop               | SOQL queries placed inside loops, risking governor limits.                  |
| Unclear_API_Name                   | Flow with copied elements retaining similar API names, reducing readability.|
| Unconnected_Element                | Flow with an element connected from Start but lacking further connectors.   |
| Unreachable_Element                | Flow with elements that are unreachable or unconnected.                     |
| Unsafe_Running_Context             | Flow set to run in System Mode without Sharing.                             |
| Unused_Variable                    | Flow declaring variables that are not referenced anywhere.                  |
## Getting Started

Follow these steps to get up and running with the Lightning Flow Scanner Example Flows:

1. To open this [Salesforce Project](../example-flows) in CLI:

   ```bash
   cd example-flows
   ```

2. Deploy Flows(optional)

   ```bash
   sf project deploy start --source-dir force-app
   ```