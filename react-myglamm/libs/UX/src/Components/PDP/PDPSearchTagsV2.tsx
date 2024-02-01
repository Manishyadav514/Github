import Router from "next/router";
import { SEARCH_STATE } from "@libStore/valtio/SEARCH.store";
import ArrowRight from "../../../public/svg/white-arrow.svg";

function PDPSearchTags({ tags }: { tags: Array<any> }) {
  const handleSearchTabClick = (q: any) => {
    SEARCH_STATE.products = [];
    SEARCH_STATE.input.value = q;
    SEARCH_STATE.searchType = `selection | Search Tags`;
    Router.push(
      {
        pathname: "/search",
        query: {
          q,
          tab: "PRODUCTS",
          source: "PDP",
        },
      },
      undefined,
      { shallow: true }
    );
  };

  if (!tags?.length) return <></>;

  return (
    <div className="px-4 py-2 flex flex-wrap gap-2">
      {tags?.map((searchText: string, index: number) => {
        return (
          <button
            className="py-2.5 mr-2 cursor-pointer text-10  rounded-3 bg-color4 searchTag  "
            onClick={() => handleSearchTabClick(searchText)}
            key={`${searchText}-index`}
          >
            <p className="flex flex-row text-white justify-evenly  font-bold ml-2 text-xxs uppercase ">
              <p className="leading-tight mt-0.5" >{searchText}</p>
              <ArrowRight className="block ml-2.5 h-2 self-center relative z-10" />
            </p>
          </button>
        );
      })}

      <style>
        {`
        .searchTag{
          height: 1.50rem;
          justify-content: center;
          position: relative;
          display:flex;
          justify-content: center;
          align-items: center;
        }

        .searchTag::after{
          content:'';
          position:absolute;
          width:0;
          height:0;
          border-width:10px;
          z-index:1;
          border-color: transparent;
          border-style: solid;
          border-left-color: var(--color4);
        }

        [dir="ltr"] .searchTag::after{
          right: -1.24rem;
         }

        [dir="rtl"] .searchTag::after{
          left: -1.24rem;
          rotate: 180deg;
        } 

        `}
      </style>
    </div>
  );
}

export default PDPSearchTags;
