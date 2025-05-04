import { Flow } from "../internals/internals";

export interface AutoFixable {
  fix(flow: Flow): Flow;
}
