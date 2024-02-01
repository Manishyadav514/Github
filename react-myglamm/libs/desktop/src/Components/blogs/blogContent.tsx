import React from "react";
import parse, { domToReact } from "html-react-parser";

import isDomainLink from "@libUtils/isDomainLink";
import { decodeHtml } from "@libUtils/decodeHtml";

import BlogInStoryProducts from "./blogInStoryProducts";
import { BlogsStyles } from "../../styles/BlogsStyles";

const replaceHref = {
  replace: ({ name, attribs, children }: any) => {
    if (name === "a" && attribs.href) {
      if (!isDomainLink(attribs.href)) {
        return (
          <a rel="nofollow" href={attribs.href}>
            {domToReact(children, replaceHref)}
          </a>
        );
      }
    }
    return null;
  },
};

const BlogContent = ({ blog, description, editorData, relationalData, header }: any) => (
  <>
    <div className="blog blog-aricle">
      <BlogsStyles />

      {editorData?.length > 0 ? (
        <>
          {editorData.map((data: any) => {
            switch (data.identifier) {
              case "html-editor":
                return (
                  <div key={data.id} className="text-sm w-full p-2 Blogs pTag">
                    {parse(data.description, replaceHref)}
                  </div>
                );
              case "products":
                return (
                  <BlogInStoryProducts
                    blog={blog}
                    header={header}
                    key={data.itemIds[0]}
                    relationalData={relationalData}
                    descriptionData={data.descriptionData}
                  />
                );
              default:
                return null;
            }
          })}
        </>
      ) : (
        <div className="box pull-left dynamic-content">
          {parse(
            decodeHtml(description, {
              stripSlash: true,
            }),
            replaceHref
          )}
        </div>
      )}
    </div>
    <style>{`.pTag p{
    padding-bottom:10px !important;
    }`}</style>
  </>
);

export default BlogContent;
