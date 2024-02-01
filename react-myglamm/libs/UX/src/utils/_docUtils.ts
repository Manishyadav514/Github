export function transform(node: any): any {
  if (node?.props?.children) {
    return {
      ...node,
      props: {
        ...node.props,
        children: Array.isArray(node.props.children) ? node.props.children.map(transform) : transform(node.props.children),
      },
    };
  }

  if (Array.isArray(node)) {
    return node.map(transform);
  }
  /* Uncomment if want to preload all scripts and images */
  if (node?.type === "link" && node?.props?.rel === "preload" && node?.props?.as === "script") {
    return null;
  }
  if (node?.type === "link" && node?.props?.rel === "preload" && node?.props?.as === "image") {
    // preloads.push(node);
    return null;
  }

  return node;
}
