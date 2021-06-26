export class RuleOptions {

    public dmlStatementInLoop: boolean;
    public duplicateDMLOperations: boolean;
    public hardcodedIds: boolean;
    public missingDescription: boolean;
    public missingFaultPaths: boolean;
    public missingNullHandlers: boolean;
    public unconnectedElements: boolean;
    public unusedVariables: boolean;

    constructor(dmlStatementInLoop: boolean, duplicateDMLOperations: boolean, hardcodedIds: boolean, missingDescription: boolean, missingFaultPaths: boolean, missingNullHandlers: boolean, unconnectedElements: boolean, unusedVariables: boolean) {
        this.dmlStatementInLoop = dmlStatementInLoop;
        this.duplicateDMLOperations = duplicateDMLOperations;
        this.hardcodedIds = hardcodedIds;
        this.missingDescription = missingDescription;
        this.missingFaultPaths = missingFaultPaths;
        this.missingNullHandlers = missingNullHandlers;
        this.unconnectedElements = unconnectedElements;
        this.unusedVariables = unusedVariables;
    }
}
