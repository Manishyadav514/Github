import * as React from "react";
import { Fragment } from "react";
import Router, { useRouter } from "next/router";
import SearchLabel from "@libComponents/Search/SearchLabel";
import SearchChip from "@libComponents/Search/SearchChip";

const Chips = ({ item, getData }: any) => {
  const router = useRouter();
  const handleSearchTabClick = (query: any) => {
    router.replace(`?sourcepage=glammstudio&q=${query}&tab=BLOGS`);
    getData(query, true);
  };
  return (
    <div className="search-section  blog-topics  pb-6">
      <SearchLabel label={item.commonDetails.title} />
      {JSON.parse(item?.meta?.widgetMeta)?.topTopics?.map((topic: any, index: number) => (
        // <button
        //   type="button"
        //   className="search-chips"
        //   onClick={() => handleSearchTabClick(topic)}
        //   key={index}
        // >
        //   {topic}
        // </button>
        <SearchChip key={topic} query={topic} onClick={handleSearchTabClick} />
      ))}
    </div>
  );
};
export default Chips;
