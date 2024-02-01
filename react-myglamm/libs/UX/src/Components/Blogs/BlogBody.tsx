import React from "react";
import BlogProducts from "./BlogsProducts";
import parse, { domToReact } from "html-react-parser";
import isDomainLink from "@libUtils/isDomainLink";
import Head from "next/head";

interface blogBodyProps {
  description: string;
  editorData: any[];
}

export const replaceHref = {
  replace: ({ name, attribs, children }: any) => {
    if (["gwmw", "g", "path"].includes(name)) {
      return <span>{domToReact(children, replaceHref)}</span>;
    }
    if (name == "h1") {
      return <h1>{domToReact(children, replaceHref)}</h1>;
    }
    if (name == "h2") {
      return <h2>{domToReact(children, replaceHref)}</h2>;
    }
    if (name == "h3") {
      return <h3>{domToReact(children, replaceHref)}</h3>;
    }
    if (name == "h4") {
      return <h4>{domToReact(children, replaceHref)}</h4>;
    }
    if (name == "p") {
      return <p>{domToReact(children, replaceHref)}</p>;
    }
    if (name == "br") {
      return <></>;
    }
    if (name == "span") {
      if (children[0]?.type !== "tag" && !children[0]?.data?.trim().length) {
        return <></>;
      }
      return <span>{domToReact(children, replaceHref)}</span>;
    }
    if (name == "ol") {
      return <ol>{domToReact(children, replaceHref)}</ol>;
    }
    if (name == "ul") {
      return <ul>{domToReact(children, replaceHref)}</ul>;
    }
    if (name == "li") {
      return <li>{domToReact(children, replaceHref)}</li>;
    }
    if (name == "b") {
      if (!children[0]?.data?.trim().length) {
        return <></>;
      }
      return <b>{domToReact(children, replaceHref)}</b>;
    }
    if (name == "img") {
      const { style, ..._attribs } = attribs;
      return (
        <>
          <img {..._attribs} loading="lazy" />
        </>
      );
    }
    if (name === "a" && attribs["href"]) {
      if (!isDomainLink(attribs["href"])) {
        return (
          <a rel="nofollow" href={attribs.href}>
            {domToReact(children, replaceHref)}
          </a>
        );
      } else {
        return <a href={attribs.href}>{domToReact(children, replaceHref)}</a>;
      }
    }

    return null;
  },
};

const BlogBody = ({ description, editorData }: blogBodyProps) => {
  return (
    <div className="bg-white">
      <Head>
        <style>
          {`
        .Blogs a {
          color: darkblue;
          text-decoration: underline;
          font-weight: bold;
        }
        .Blogs span a {
          margin-right: 2px;
        }
        .Blogs p:has(span b:empty), .Blogs p span:empty, .Blogs p:empty, .Blogs p span b:empty {
          display: none;
        }
        .Blogs iframe {
          width: 100%;
        }
        .Blogs .pull-right {
          float: right;
        }
        .Blogs .fullwidth {
          width: 100%;
        }
        .Blogs .text-center {
          text-align: center;
        }
        .Blogs .text-right {
          text-align: right;
        }
        .Blogs .text-left {
          text-align: left;
        }
        .Blogs input[type="email"] {
          height: 15px;
          border: 0;
          width: calc(100% - 2px);
          margin-left: 1px;
          font-weight: bold;
          color: #495057;
          box-shadow: -8px 10px 0px -7px #ced4da, 6px 10px 0px -7px #ced4da;
          -webkit-transition: box-shadow 0.3s;
          transition: box-shadow 0.3s;
        }
        .Blogs input[type="email"]:focus {
          outline: none;
          box-shadow: -8px 10px 0px -7px rgb(10, 10, 10), 8px 10px 0px -7px rgb(17, 17, 17);
        }
        .Blogs .box:active {
          border-color: #000;
          border-style: solid;
          border-width: thin;
        }
        .Blogs .glamm-academy {
          background: #fbe4e4;
        }
        .Blogs .studio-acdemy {
          margin: -7% 0 0;
          padding: 0 10px;
        }
        .Blogs .studio-acdemy-inner {
          background: #fff;
          padding: 13px 5px;
          position: relative;
          border-radius: 4px;
          display: flex;
          flex-direction: column;
        }
        .Blogs .studio-acdemy h6 {
          margin: 0;
          font-size: 18px;
          font-weight: bold;
          line-height: 1.31;
          padding: 0 44px 9px 44px;
        }
        .Blogs .studio-acdemy p {
          margin: 0;
          font-size: 12px;
          line-height: 16px;
          letter-spacing: 0.1px;
          opacity: 0.79;
        }
        .Blogs .content-section .studio-video-content {
          width: 36%;
          position: relative;
        }
        .Blogs .content-section .studio-video-content .glamm-play-button {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .Blogs .content-section .studio-text-content {
          width: 60%;
          padding-left: 10px;
          padding-top: 6px;
        }
        .Blogs .content-section .studio-glamm-number {
          width: 7%;
          font-size: 16px;
          font-weight: bold;
          font-stretch: normal;
          font-style: normal;
          line-height: normal;
          letter-spacing: normal;
          color: #1d1f24;
        }
        .Blogs .content-section {
          display: table;
        }
        .Blogs .content-section .course-content {
          border-radius: 4px;
          background-color: #ffffff;
          padding: 0 10px 5px;
          margin: 10px 10px;
        }
        .Blogs .studio-video-content {
          display: table-cell;
          vertical-align: middle;
        }
        .Blogs .studio-text-content {
          display: table-cell;
          vertical-align: middle;
        }
        .Blogs .studio-glamm-number {
          display: table-cell;
          vertical-align: middle;
        }
        .Blogs .studio-bottom-bar .ico-share {
          border-left: 1px solid #f3eeee;
          font-size: 10px;
          padding: 2px 2px 0;
          text-transform: uppercase;
          float: right;
          text-align: left;
          font-weight: bold;
          color: #000;
          opacity: 0.6;
        }
        .Blogs .studio-bottom-bar .ico-share > img {
          display: inline-block;
        }
        .Blogs .content-header h6 {
          margin: 0;
          font-size: 14px;
          padding: 17px 0 0px 14px;
        }
        .Blogs .content-section .studio-glamm-number span {
          font-size: 16px;
          font-weight: bold;
        }
        .Blogs .studio-text-content h6 {
          font-size: 16px;
          font-weight: bold;
          color: #1d1f24;
          line-height: 16px;
          padding: 0.5rem 0;
        }
        .Blogs .studio-text-content p {
          font-size: 12px;
          color: #1d1f24;
          padding-right: 0.2rem;
          margin-bottom: 0.2rem;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.08;
          letter-spacing: normal;
        }
        .Blogs .studio-text-content span {
          font-size: 12px;
          opacity: 0.67;
          line-height: 14px;
        }
        .Blogs .share-acdemy {
          text-align: center;
          padding: 16px 0;
        }
        .Blogs .share-acdemy > img {
          margin: 0 auto;
        }
        .Blogs .share-acdemy span {
          font-size: 14px;
          font-weight: bold;
          text-transform: uppercase;
        }
      `}
        </style>
      </Head>

      {editorData?.length > 0 ? (
        <div>
          {editorData.map((data: any) => {
            switch (data.identifier) {
              case "html-editor":
                return (
                  <div key={data.id} className="w-full p-4 prose-sm Blogs">
                    {parse(data.description, replaceHref)}
                  </div>
                );

              case "products":
                return <BlogProducts key={data.itemIds[0]} descriptionData={data.descriptionData} />;

              default:
                return null;
            }
          })}
        </div>
      ) : (
        <div className="w-full p-4 pt-0 text-sm prose-sm Blogs">{parse(description, replaceHref)}</div>
      )}
    </div>
  );
};

export default BlogBody;
