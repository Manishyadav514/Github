import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAmp } from "next/amp";
import parse from "html-react-parser";

import WpArticleApi from "@libAPI/apis/WpArticleApi";

const LatestArticles = () => {
  const router = useRouter();
  const isAmp = useAmp();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchLatestArticles = async () => {
      try {
        const wpArticleApi = new WpArticleApi();
        const response: any = await wpArticleApi.getLatestArticles();
        setItems(response?.data?.length ? response?.data : []);
      } catch {
        //
      }
    };
    fetchLatestArticles();
  }, []);

  return (
    <>
      {items?.length > 0 && (
        <div className="bg-white mt-4 p-2">
          <div className="flex items-center h-4 mt-2 ml-1">
            <p
              className={`text-lg text-black font-bold uppercase bg-gradient-to-b from-transparent via-transparent w-max leading-tight to-red-200`}
            >
              Latest Articles
            </p>
          </div>
          <div className="overflow-y-scroll mt-2">
            <ul className="mt-2.5 inline-flex h-auto overflow-hidden ">
              {items.map((blogPost: any, index: number) => {
                return (
                  <React.Fragment key={index}>
                    {router.asPath !== blogPost.slug && (
                      <li className="inline-block mr-3.5">
                        <Link href={blogPost.slug}>
                          <div className="items-center justify-center w-80 h-auto">
                            {isAmp ? (
                              <amp-img
                                src={blogPost?._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.medium?.source_url}
                                alt={blogPost?.title?.rendered}
                                width="318"
                                height="179"
                              />
                            ) : (
                              <img
                                className="rounded-3xl w-full border"
                                src={blogPost?._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.medium?.source_url}
                                alt={blogPost?.title?.rendered}
                              />
                            )}
                            <p className="text-base text-gray-500 pl-2 pt-2 w-4/5">{parse(blogPost?.title?.rendered)}</p>
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

export default LatestArticles;
