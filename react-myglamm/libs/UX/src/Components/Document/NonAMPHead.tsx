import { Head } from "next/document";

import { IS_DESKTOP } from "@libConstants/COMMON.constant";

import { getStaticUrl } from "@libUtils/getStaticUrl";

import DocVaniallaScript from "./_documentVanillaScript";

class NonAMPHead extends Head {
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
      /* Uncomment if want to preload all scripts and images */
      if (node?.type === "link" && node?.props?.rel === "preload" && node?.props?.as === "script") {
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

        <meta charSet="utf-8" />

        {!IS_DESKTOP && (
          <>
            <link rel="manifest" href={getStaticUrl("/manifest.json")} />

            <link rel="apple-touch-icon" href={getStaticUrl("/apple_icons/apple-touch-icon.png")} />
            <link rel="apple-touch-icon" sizes="57x57" href={getStaticUrl("/apple_icons/apple-touch-icon-57x57.png")} />
            <link rel="apple-touch-icon" sizes="72x72" href={getStaticUrl("/apple_icons/apple-touch-icon-72x72.png")} />
            <link rel="apple-touch-icon" sizes="76x76" href={getStaticUrl("/apple_icons/apple-touch-icon-76x76.png")} />
            <link rel="apple-touch-icon" sizes="114x114" href={getStaticUrl("/apple_icons/apple-touch-icon-114x114.png")} />
            <link rel="apple-touch-icon" sizes="120x120" href={getStaticUrl("/apple_icons/apple-touch-icon-120x120.png")} />
            <link rel="apple-touch-icon" sizes="144x144" href={getStaticUrl("/apple_icons/apple-touch-icon-144x144.png")} />
            <link rel="apple-touch-icon" sizes="152x152" href={getStaticUrl("/apple_icons/apple-touch-icon-152x152.png")} />
            <link rel="apple-touch-icon" sizes="180x180" href={getStaticUrl("/apple_icons/apple-touch-icon-180x180.png")} />
          </>
        )}

        <DocVaniallaScript />

        <script dangerouslySetInnerHTML={{ __html: `history.scrollRestoration = "manual"` }} />

        {(this.props as any).typekitFonts && (
          <script
            id="TypeKit-Load"
            dangerouslySetInnerHTML={{
              __html: `
                  function loadTypeKit() {
                    var xhr = new XMLHttpRequest();
                    xhr.open("GET", "${(this.props as any).typekitFonts}", true);
                    xhr.onreadystatechange = function () {
                      if (xhr.readyState == 4 && xhr.status == 200) {
                        var css = xhr.responseText.replace(/auto;/g, "swap;");
                        var style = document.createElement("style");
                        style.appendChild(document.createTextNode(css));
                        var El = document.getElementsByTagName("head")[0];
                        El.appendChild(style);
                      }
                    };
                    xhr.send();
                  }
                  window.requestIdleCallback(loadTypeKit);
              `,
            }}
          />
        )}
      </>
    );
  }
}

export default NonAMPHead;
