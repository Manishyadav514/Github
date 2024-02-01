import React from "react";
import { NextScript as OriginalNextScript } from "next/document";

/**
 * A replacement for NextScript from `next/document` that gives you greater control over how script elements are rendered.
 * This should be used in the body of `pages/_document.js` in place of `NextScript`.
 */
export default class NextScript extends OriginalNextScript {
  static defaultProps = {
    mode: "async",
  };

  getScripts() {
    return super.getScripts().map(script => {
      return React.cloneElement(script, {
        key: script.props.src,
        defer: this.props.mode === "defer" ? true : undefined,
        async: this.props.mode === "async" ? true : undefined,
      });
    });
  }
}
