import { Rule } from './Rule';

export class ScanOptions {

    constructor(rules : Rule[]){
      this.rules = rules;
    }

    public rules : Rule[] = [];
}
