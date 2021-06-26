import {RuleOptions} from './main/models/RuleOptions';

export function scan() {

  let result: RuleOptions = new RuleOptions(true, true, true,
    true, true, true, true, true);
  return result;
}
