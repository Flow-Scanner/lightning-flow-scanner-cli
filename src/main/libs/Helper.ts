export class Helper {

  public buildFlow(nodesToMerge) {
    let res = {};
    for (const nodeToMerge of nodesToMerge) {
      const subtype = nodeToMerge.subtype;
      const nodesOfType = nodesToMerge.filter(node => subtype === node.subtype);
      res = this.convertFlowNodes(res, nodesOfType, subtype);
    }
    return {Flow: res};

    // return {
    //     'Flow': {
    //         $: root,
    //     }
    // };

  }

  private convertFlowNodes(obj, nodes, key) {
    obj[key] = nodes.map(node => node.element);
    return obj;
  }
}
