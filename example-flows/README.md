# Lightning Flow Scanner Demo Repository

This directory contains sample Salesforce Flows used to demo Lightning Flow Scanner rules.

You can:

- Use these flows to demo scanner output.
- Deploy them to an Org for integrated tests.

## Demo Flows

These flows demonstrate common violations detected by Lightning Flow Scanner rules:

| Flow Name                          | Rule Demonstrated                | Description                                                                 |
|------------------------------------|----------------------------------|-----------------------------------------------------------------------------|
| Action_Call_In_A_Loop              | Action Call In Loop              | Demonstrates action calls inside a loop that can exhaust governor limits. Best practice: bulkify by collecting data in the loop, then make a single action call with a collection. |
| DML_Statement_In_A_Loop            | DML Statement In Loop            | Shows DML operations (create/update/delete) inside a loop, a high-risk anti-pattern that frequently causes governor limit exceptions. |
| Duplicate_DML_Operation            | Duplicate DML Operation          | Illustrates how database operations across multiple screens can execute multiple times when users navigate backward. |
| Excessive_Cyclomatic_Complexity    | Cyclomatic Complexity            | High-complexity flow with many loops and decision elements that reduce maintainability. |
| FlowNamingConvention               | Flow Naming Convention           | Flow with a non-descriptive name that doesn't follow organizational naming standards. |
| Get_Records_Stores_All_Fields      | Get Record All Fields            | Get Records element retrieving all fields unnecessarily, impacting performance and exposing unnecessary data. |
| Hardcoded_Id                       | Hardcoded Id                     | Flow using hardcoded record IDs that are unique to a specific org and won't work in other environments. |
| Hardcoded_Url                      | Hardcoded URL                    | Flow containing hardcoded Salesforce URLs that break when migrated between sandboxes and production. |
| Inactive_Flow                      | Inactive Flow                    | Flow marked as inactive that may need review or activation. |
| Invalid_API_Version                | Invalid API Version              | Flow using an outdated API version. |
| Missing_Auto_Layout                | Missing Auto Layout              | Flow not using auto-layout canvas mode. |
| Missing_Fault_Path                 | Missing Fault Path               | Flow without fault path connectors for proper error handling. |
| Missing_Flow_Description           | Missing Flow Description         | Flow lacking a description for documentation and maintainability. |
| Missing_Null_Handler_Simple        | Missing Null Handler             | Get Records element without null checks, risking errors when no records are found. |
| Missing_Trigger_Order              | Missing Trigger Order            | Record-triggered flow missing trigger order configuration. |
| Recursive_After_Update             | Recursive After Update           | After-update trigger flow that can cause infinite recursion by updating the triggering record. |
| Same_Record_Field_Updates          | Same Record Field Updates        | Flow updating the same record field multiple times inefficiently. |
| SOQL_Query_In_A_Loop               | SOQL Query In Loop               | SOQL queries placed inside a loop, risking governor limit exceptions. |
| Unclear_API_Name                   | Unclear API Name                 | Flow with copied elements retaining similar API names like "Copy_1_of_Assignment", reducing readability. |
| Unreachable_Element                | Unreachable Element              | Flow with elements that cannot be reached from the start element. |
| Unsafe_Running_Context             | Unsafe Running Context           | Flow configured to run in System Mode without Sharing, potentially exposing unauthorized data. |
| Unused_Variable                    | Unused Variable                  | Flow declaring variables that are never referenced or used. |

## Testing Flows

The `force-app/testing/` directory contains additional flows used for integration tests, including both violation examples and fixed versions for testing auto-fixes and edge cases.

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