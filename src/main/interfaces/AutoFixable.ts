import { Flow } from "../internals/internals";

/**
 * Interface representing an entity capable of automatically fixing a Flow.
 *
 * Implementations of this interface provide a `fix` method that takes a {@link Flow}
 * object as input and returns a new or modified {@link Flow} with applied fixes.
 */
export interface AutoFixable {
  fix(flow: Flow): Flow;
}
