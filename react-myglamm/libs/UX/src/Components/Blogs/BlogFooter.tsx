import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useAmp } from "next/amp";

const BlogFooter = ({ title, items }: any) => {
  const router = useRouter();
  const isAmp = useAmp();
  return (
    <>
      {Array.isArray(items) && (
        <div className="bg-white mt-4 p-2">
          <div className="flex items-center h-4 mt-2 ml-1">
            <p
              className={`text-lg text-black font-bold uppercase bg-gradient-to-b from-transparent via-transparent w-max leading-tight to-red-200`}
            >
              {title}
            </p>
          </div>
          <div className="overflow-y-scroll mt-2">
            <ul className="mt-2.5 inline-flex h-auto overflow-hidden ">
              {items.length &&
                items.map((blogPost: any, index: number) => {
                  return (
                    <React.Fragment key={index}>
                      {router.asPath !== blogPost.urlManager.url && (
                        <li className="inline-block mr-3.5">
                          <Link href={blogPost.urlManager.url} aria-label={blogPost.cms[0]?.content.name}>
                            <div className="items-center justify-center w-80 h-auto">
                              {isAmp ? (
                                <amp-img
                                  src={blogPost.assets[0]?.imageUrl["768x432"]}
                                  alt={blogPost.assets[0]?.properties?.imageAltTag || blogPost.cms[0]?.content?.name}
                                  width="318"
                                  height="179"
                                />
                              ) : (
                                <img
                                  src={blogPost.assets[0]?.imageUrl["768x432"]}
                                  loading="lazy"
                                  alt={blogPost.assets[0]?.properties?.imageAltTag || blogPost.cms[0]?.content?.name}
                                  className="rounded-3xl w-full border"
                                />
                              )}
                              <p className="text-base text-gray-500 pl-2 pt-2 w-4/5">{blogPost.cms[0]?.content.name}</p>
                            </div>
                          </Link>
                        </li>
                      )}
                    </React.Fragment>
                  );
                })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default BlogFooter;
