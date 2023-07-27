import { RuleDefinitions } from './RuleDefinitions';

export function RuleInfo(ruleDefinitions: RuleDefinitions) {
  switch (ruleDefinitions) {
    case RuleDefinitions.DMLStatementInLoop:
      return {
        label: 'DML statements in a loop',
        text: 'To avoid hitting Apex governor limits, we recommend grouping all of your database changes together at the end of the flow, whether those changes create, update, or delete records.'
      };
    case RuleDefinitions.DuplicateDMLOperations:
      return {
        label: 'Duplicate DML operations',
        text: "If the flow commits changes to the database or performs actions between two screens, don't let users navigate back between screen. Otherwise, the flow may perform duplicate database operations."
      };

    case RuleDefinitions.HardcodedIds:
      return {
        label: 'Hardcoded Ids',
        text: 'IDs are org-specific, so don’t hard-code IDs. Instead, pass them into variables when the flow starts. You can do so, for example, by using merge fields in URL parameters or by using a Get Records element.'
      };
    case RuleDefinitions.FlowName:
      return {
        label: 'Flow Naming Convention',
        text: ''
      };
    case RuleDefinitions.MissingFlowDescription:
      return {
        label: 'Missing flow description',
        text: 'Descriptions are useful for documentation purposes. It is recommended to provide information about where it is used and what it will do.'
      };
    case RuleDefinitions.MissingFaultPath:
      return {
        label: 'Missing error handlers',
        text: 'Sometimes a flow doesn’t perform an operation that you configured it to do. By default, the flow shows an error message to the user and emails the admin who created the flow. However, you can control that behavior.'
      };
    case RuleDefinitions.MissingNullHandler:
      return {
        label: 'Missing null handlers',
        text: 'If a Get Records operation does not find any data it will return null. Use a decision element on the operation result variable to validate that the result is not null.'
      };
    case RuleDefinitions.UnconnectedElements:
      return {
        label: 'Unconnected elements',
        text: 'Removing unconnected elements which are not being used by the Flow makes your Flow more efficient and maintainable.'
      };
    case RuleDefinitions.UnusedVariables:
      return {
        label: 'Unused variables',
        text: 'Removing unconnected variables which are not being used by the Flow makes your Flow more efficient and maintainable.'
      };
  }
}
