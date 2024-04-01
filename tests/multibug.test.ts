import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src/index'
import unconnectedElement from './testfiles/UnconnectedElement.json';
import waitForOnly from './testfiles/WaitForOnly.json';

describe('Multiple Expression Configurations ', () => {

  let flow2: core.Flow;

  it(' should not confuse', () => {
    flow2 = new core.Flow({
      path: './testfiles/Async_OnlyTransaction.flow-meta.xml',
      xmldata: unconnectedElement,
    });
    const ruleConfig = {
        rules: {
          APIVersion: {
            severity: "error",
            expression: ">50",
          },
          CopyAPIName: {
            severity: "error",
          },
          DMLStatementInLoop: {
            severity: "error",
          },
          DuplicateDMLOperation: {
            severity: "error",
          },
          FlowDescription: {
            severity: "error",
          },
          FlowName: {
            severity: "error",
            expression: "[A-Za-z0-9]+_[A-Za-z0-9]+",
          },
          HardcodedId: {
            severity: "error",
          },
          MissingFaultPath: {
            severity: "error",
          },
          MissingNullHandler: {
            severity: "error",
          },
          SOQLQueryInLoop: {
            severity: "error",
          },
          UnconnectedElement: {
            severity: "error",
          },
          UnusedVariable: {
            severity: "error",
          },
        },
      };
    const results: core.ScanResult[] = core.scan([flow2], ruleConfig);
    expect(results[0].ruleResults.find((r) => r.ruleName === 'FlowName')?.occurs).to.equal(false);
  });

});
