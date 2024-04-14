export class RuleInfo {

    public name: string;
    public label: string;
    public description: string;
    public supportedTypes: string[];
    public docRefs:  {label: string, path: string}[];
    public isConfigurable: boolean;
    public autoFixable: boolean;

}