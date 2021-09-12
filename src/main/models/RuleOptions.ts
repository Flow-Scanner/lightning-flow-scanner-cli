import {Override} from "./Override";
import {RuleOption} from "./RuleOption";

export class RuleOptions {
  public ruleSettings: [RuleOption];
  public overrides: [Override];

  constructor(ruleSettings, overrides){
    this.ruleSettings = ruleSettings;
    this.overrides = overrides;
  }
}
