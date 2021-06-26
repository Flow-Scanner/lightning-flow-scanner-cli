import {Flow} from "../models/Flow";

export class MissingFlowDescription{

    public execute(flow: Flow) {
        return !flow.xmldata.Flow.description;
    }
}
