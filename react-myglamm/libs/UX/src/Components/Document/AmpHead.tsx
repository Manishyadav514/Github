import { Head } from "next/document";

class AMPHead extends Head {
  render() {
    const res = super.render();
    const preloads: any = [];
    function transform(node: any): any {
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
      if (node?.type === "style" && node?.props?.dangerouslySetInnerHTML?.__html === "") {
        return null;
      }
      if (node?.type === "link" && node?.props?.rel === "preload" && node?.props?.as === "image") {
        preloads.push(node);
        return null;
      }

      return node;
    }

    return (
      <>
        {preloads}
        {transform(res)}
      </>
    );
  }
}

export default AMPHead;
