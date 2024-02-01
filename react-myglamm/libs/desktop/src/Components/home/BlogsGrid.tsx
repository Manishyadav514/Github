import React from "react";
import Link from "next/link";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { getImage, generateICIDlink } from "@libUtils/homeUtils";

import HomeWidgetLabel from "./HomeWidgetLabel";

import RightArrow from "../../../public/svg/rightArrow.svg";

const BlogsGrid = (props: any) => {
  const { data, icid } = props;
  const blogs = data.commonDetails.descriptionData[0].value;

  return (
    <section className="bg-white w-full py-12">
      <div className="max-w-screen-xl mx-auto">
        <HomeWidgetLabel title={data.commonDetails.title} />

        <div className="w-full flex">
          <Link
            href={generateICIDlink(blogs?.[0]?.urlManager?.url, icid, `${blogs?.[0]?.cms?.[0]?.content?.name}_${1}`)}
            className="m-auto w-1/2"
          >
            <LazyLoadImage src={getImage(blogs[0], "768x432")} alt={blogs?.[0]?.assets[0]?.name} />
            <p className="text-2xl font-bold h-14 mt-9 mb-4 line-clamp-2">{blogs?.[0]?.cms?.[0]?.content?.name} </p>
            <p className="text-color1 text-sm mb-4">Read more...</p>
          </Link>

          <div className="w-1/2">
            {blogs.slice(1, 5).map((blog: any, index: number) => (
              <Link
                href={generateICIDlink(
                  blogs?.[0]?.urlManager?.url,
                  icid,
                  `${blogs?.[0]?.cms?.[0]?.content?.name}_${index + 2}`
                )}
                key={blog.id}
                className="flex ml-4 mb-7"
              >
                <LazyLoadImage
                  alt={blog.assets[0]?.name}
                  className="mx-4 aspect-video"
                  style={{ maxWidth: "160px" }}
                  src={getImage(blog, "768x432")}
                />
                <div>
                  <p className="font-bold h-11 line-clamp-2 mb-4">{blog.cms?.[0]?.content?.name}</p>
                  <p className="text-sm text-color1 mb-4">Read more...</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <Link
          href="/glammstudio"
          className="m-auto px-5 py-2.5 bg-color2 rounded-full flex items-center justify-center max-w-max"
        >
          <span>Show More</span>
          <RightArrow className="ml-2" />
        </Link>
      </div>
    </section>
  );
};

export default BlogsGrid;
