import React from "react";
import Link from "next/link";

import Rating from "@components/Rating/Rating";
import { IMovie } from "types";

interface Props {
  movie: IMovie;
  isLast: boolean;
}

// Movie on the homepage
const Movie = ({
  movie: {
    id,
    title,
    short_title,
    poster_path,
    release_date,
    vote_average,
    genres,
  },
  isLast,
}: Props) => {
  return (
    <div className={`mt-8 space-y-2 ${isLast && "pr-8 md:pr-0"}`}>
      <Link href={`/movie/${id}`}>
        <a>
          <h2
            title={title}
            className="text-xl text-center text-gray-600 truncate hover:text-gray-500 sm:text-left"
          >
            {short_title}
          </h2>
        </a>
      </Link>
      <Link href={`/movie/${id}`}>
        <a className="block w-48 sm:w-auto sm:h-auto">
          <img
            className="object-contain w-full rounded"
            src={poster_path}
            alt={title}
          />
        </a>
      </Link>
      <div
        className="grid items-center h-16"
        style={{ gridTemplateColumns: "1fr 2fr" }}
      >
        <Rating rating={vote_average} />
        <div>
          <p className="text-lg leading-relaxed text-gray-400 ">
            {release_date}
          </p>
          <p className="text-sm text-gray-400">{genres.join(", ")}</p>
        </div>
      </div>
    </div>
  );
};

export default Movie;
