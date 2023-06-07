const isElement = ( value: Node ): value is Element => {
  return (typeof value === 'object' && value !== null && value.nodeType === 1);
};

const isElementInTable = (node: Node) => {
  let parentHasTable = false
  let parentNode = node.parentNode
  while(parentNode) {
    if ((parentNode as HTMLElement).tagName === 'TABLE') {
      parentHasTable = true
      break
    }
    parentNode = parentNode.parentNode
  }
  return parentHasTable
}

export { isElement, isElementInTable };
