/* eslint-disable camelcase */
import parse from "html-react-parser";

export const VALID_ATTR_SET = new Set([
  "accept",
  "accept-charset",
  "accesskey",
  "action",
  "align",
  "alt",
  "async",
  "autocomplete",
  "autofocus",
  "autoplay",
  "bgcolor",
  "border",
  "charset",
  "checked",
  "cite",
  "class",
  "className",
  "cols",
  "colspan",
  "content",
  "contenteditable",
  "controls",
  "coords",
  "data",
  "data-",
  "datetime",
  "default",
  "defer",
  "dir",
  "dirname",
  "disabled",
  "download",
  "draggable",
  "enctype",
  "for",
  "form",
  "formaction",
  "headers",
  "height",
  "hidden",
  "high",
  "href",
  "hreflang",
  "http-equiv",
  "id",
  "ismap",
  "kind",
  "label",
  "lang",
  "list",
  "loop",
  "low",
  "layout",
  "max",
  "maxlength",
  "media",
  "method",
  "min",
  "multiple",
  "muted",
  "name",
  "novalidate",
  "open",
  "optimum",
  "pattern",
  "placeholder",
  "poster",
  "preload",
  "readonly",
  "rel",
  "required",
  "reversed",
  "rows",
  "rowspan",
  "sandbox",
  "scope",
  "selected",
  "shape",
  "sizes",
  "span",
  "spellcheck",
  "src",
  "srcdoc",
  "srclang",
  "srcset",
  "start",
  "step",
  // "style",
  "tabindex",
  "target",
  "title",
  "translate",
  "type",
  "usemap",
  "value",
  "width",
  "wrap",
]);

export const VALID_TAGS_SET = new Set([
  "amp-img",
  "amp-video",
  "amp-title",
  "amp-iframe",
  "amp-form",
  "amp-embedly-card",
  "amp-reddit",
  "amp-instagram",
  "amp-twitter",
  "amp-youtube",
  "a",
  "abbr",
  "acronym",
  "address",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "basefont",
  "bdi",
  "bdo",
  "bgsound",
  "big",
  "blink",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "center",
  "cite",
  "code",
  "col",
  "colgroup",
  "content",
  "data",
  "datalist",
  "dd",
  "decorator",
  "del",
  "details",
  "dfn",
  "dir",
  "div",
  "dl",
  "dt",
  "element",
  "em",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hgroup",
  "hr",
  "html",
  "i",
  "iframe",
  "img",
  "input",
  "ins",
  "isindex",
  "kbd",
  "keygen",
  "label",
  "legend",
  "li",
  "listing",
  "main",
  "map",
  "mark",
  "marquee",
  "menu",
  "menuitem",
  "meta",
  "meter",
  "nav",
  "nobr",
  "noframes",
  "noscript",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "plaintext",
  "pre",
  "progress",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "script",
  "section",
  "select",
  "shadow",
  "small",
  "source",
  "spacer",
  "span",
  "strike",
  "strong",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "template",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "title",
  "tr",
  "track",
  "tt",
  "u",
  "ul",
  "var",
  "video",
  "wbr",
  "xmp",
]);

export const INVALID_ANCHOR_ATTRIBUTES = new Set(["allowFullScreen", "frameBorder", "height", "src", "width"]);
function handleInvalidAttr(ele: any) {
  const { children, ...rest } = ele.props;
  const props = JSON.parse(JSON.stringify(rest));

  // eslint-disable-next-line array-callback-return
  Object.keys(props).map(p => {
    if (!VALID_ATTR_SET.has(p) && !p.includes("data-")) {
      delete props[p];
    }
  });

  return {
    ...ele,
    props: {
      children,
      ...props,
    },
  };
}

function checkForInvalidAnchorAttr(newAnchrElement: any) {
  const { children, ...rest } = newAnchrElement.props;
  const props = JSON.parse(JSON.stringify(rest));

  Object.keys(props).map(p => INVALID_ANCHOR_ATTRIBUTES.has(p) && delete props[p]);

  return {
    ...newAnchrElement,
    props: {
      ...props,
      children,
    },
  };
}

const handleRedditContent = (ele: any) => {
  const child = ele.props.children.filter((c: any) => c?.props?.href?.includes("reddit.com"));

  const children = (
    // @ts-ignore
    <amp-reddit
      layout="responsive"
      width="300"
      height="400"
      data-embedtype={ele.type === "blockquote" ? "post" : "comment"}
      data-src={child[0].props.href}
    />
  );

  return {
    ...ele,
    props: {
      ...ele.props,
      children,
    },
  };
};

const returnAMPHTML = (ele: any) => {
  if (!ele) {
    return null;
  }
  let newEle = ele;

  if (ele.props) {
    newEle = handleInvalidAttr(ele);
  }

  if (newEle.props?.className?.includes("instagram-media")) {
    const instaID = newEle.props["data-instgrm-permalink"]?.split("/")[4];
    return (
      <amp-instagram
        width={400}
        height={400}
        data-captioned
        layout="responsive"
        key={instaID || ""}
        data-shortcode={instaID || ""}
      />
    );
  }

  if (newEle.type === "iframe") {
    if (!newEle.props?.src) {
      return <span />;
    }

    let width = newEle.props?.width;
    let height = newEle.props?.height;

    if (!width || width?.includes("%")) {
      width = 600;
    }

    if (!height || height?.includes("%")) {
      height = 600;
    }

    const src = newEle.props?.src.replace("http:", "https:");

    return (
      <amp-iframe
        frameborder="0"
        layout="responsive"
        sandbox="allow-same-origin allow-scripts"
        width={width}
        height={height}
        key={src}
        src={src}
      />
    );
  }

  if (newEle.type === "script" && !!newEle.props?.src) {
    return <span />;
  }

  if (newEle.type === "img") {
    if (!newEle.props?.src) {
      return <span />;
    }

    return (
      <amp-img
        layout="responsive"
        alt={newEle.props.alt || ""}
        width={newEle.props.width || 200}
        height={newEle.props.height || 200}
        className={newEle.props.className || ""}
        src={newEle.props.src || newEle.props["data-src"]}
        key={newEle.props.src || newEle.props["data-src"]}
      />
    );
  }

  if (newEle.props?.className?.includes("twitter-tweet")) {
    const twitterIndex =
      Array.isArray(newEle.props?.children) && newEle.props.children.findIndex((x: any) => x.props?.href?.includes("twitter.com"));
    const tweetID = newEle.props.children?.[twitterIndex]?.props?.href?.split("?")[0].split("/")[5];

    if (tweetID) {
      return (
        // @ts-ignore
        <amp-twitter
          width="375"
          height="472"
          layout="responsive"
          data-tweetid={tweetID}
          key={newEle.key || `insta${tweetID}`}
        />
      );
    }
  }

  if (newEle.props?.children?.type === "iframe") {
    if (newEle?.props?.children?.props?.src?.includes("youtube.com")) {
      const url = newEle.props.children.props.src.split("/");
      const id = url.pop().split("?")[0];
      return <amp-youtube data-videoid={id} layout="responsive" width="480" height="270" />;
    }
  }

  if (newEle.type === "a") {
    if (!newEle.props.href) {
      return <span />;
    }

    if (newEle.props.href?.match(/scoopwhoop\.com/)) {
      return <a href={newEle.props.href}>{newEle.props.children || ""}</a>;
    }

    let href = "";

    try {
      href = decodeURI(newEle.props.href);
    } catch (error) {
      href = newEle.props.href;
    }

    const newAnchrElement = {
      ...newEle,
      props: {
        ...newEle.props,
        href,
      },
    };

    return checkForInvalidAnchorAttr(newAnchrElement);
  }

  if (
    newEle.props?.className === "reddit-card" ||
    newEle.props?.className === "reddit-embed" ||
    newEle.props?.className === "reddit-embed-bq"
  ) {
    return handleRedditContent(newEle);
  }

  return newEle;
};

/* Recursively Check for Children of HTML(Parsed HTML) */
const checkingChildrenRecursively = (ele: any, isAmp: any): any => {
  /* Setting Temporary State Based on the State */

  if (ele.type && !VALID_TAGS_SET.has(ele.type)) {
    return <span />;
  }

  const ampTag = returnAMPHTML(ele);

  if (Array.isArray(ampTag?.props?.children)) {
    return {
      ...ele,
      props: {
        ...ampTag.props,
        children: ampTag.props.children.map((newEle: any) => checkingChildrenRecursively(newEle, isAmp)),
      },
    };
  }
  /* Incase children is presnt and it's a string with article init only go inside */
  if (
    ampTag?.props?.children &&
    (typeof ampTag?.props?.children !== "string" ||
      (typeof ampTag?.props?.children === "string" && ampTag.props.children.includes("/")))
  ) {
    return {
      ...ele,
      props: {
        ...ampTag.props,
        children: checkingChildrenRecursively(ampTag.props.children, isAmp),
      },
    };
  }

  return ampTag;
};

export default function handleStoryHTML(contentString: any, isAMP = false) {
  let updatedHTML: any = "";

  if (contentString) {
    /* Removing Empty Tags or Invalid Tags */
    updatedHTML = parse(contentString);

    let count = 0;
    let adIndex = 0;
    let adIncrementIndex = 0;

    updatedHTML = updatedHTML.map((element: any) => {
      if (element.type !== "script") {
        return <>{checkingChildrenRecursively(element, isAMP)}</>;
      }
      return "";
    });

    return updatedHTML;
  }

  return "";
}
