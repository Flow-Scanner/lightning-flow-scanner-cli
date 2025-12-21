export function BuildFlow(nodesToMerge) {
  let res = {};
  for (const nodeToMerge of nodesToMerge) {
    const subtype = nodeToMerge.subtype;
    const nodesOfType = nodesToMerge.filter((node) => subtype === node.subtype);
    res = convertFlowNodes(res, nodesOfType, subtype);
  }
  return res;
}

function convertFlowNodes(obj, nodes, key) {
  obj[key] = nodes.map((node) => node.element);
  return obj;
}
