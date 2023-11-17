import { createSignal, createEffect, mergeProps } from "solid-js";

function getNumberOfPages(totalElements: number, pageSplitBy: number): number {
  const noOfPage =
    totalElements % pageSplitBy !== 0 ? Math.floor(totalElements / pageSplitBy) + 1 : totalElements / pageSplitBy;
  return noOfPage;
}
function getPageSlots(selectedPage: number, noOfSlots: number = 10, maxPages: number): number[] {
  let pageSlot = [];
  if(selectedPage === maxPages){
    pageSlot = Array.from(Array(maxPages + 1).keys()).splice(noOfSlots);
    return pageSlot;
  }
  if (selectedPage % noOfSlots === 0) {
    const temp = [];
    for (let i = selectedPage + 2; i > selectedPage + 2 - noOfSlots && i <= maxPages; i--) {
      temp.push(i);
    }
    pageSlot = temp.sort((a, b) => a - b);
  } else {
    let temp: number | undefined = 0;
    for (let i = 1; i < noOfSlots; i++) {
      if ((selectedPage + i) % noOfSlots === 0) {
        temp = selectedPage + i;
      }
    }
    for (let i = temp - noOfSlots + 1; i <= temp; i++) {
      if (i <= maxPages) pageSlot.push(i);
    }
  }
  return pageSlot;
}

interface IPagination {
  onPageChange: any;
  totalItems: number;
  currentPageNo: number;
  noOfPageSlots?: number;
  recordsPerPage?: number | any;
}

function Pagination(props: IPagination) {
  props = mergeProps({ noOfPageSlots: 5, recordsPerPage: 10 }, props) || {};

  const [pageSlot, setPageSlot] = createSignal([0]);
  const totalAvailPages: any = () => getNumberOfPages(props.totalItems, props.recordsPerPage);
  createEffect(() => {
    const pages: Array<number> = getPageSlots(props.currentPageNo, props.noOfPageSlots, totalAvailPages()) || [0];
    setPageSlot(pages);
  });
  const handlePagination = (pageNo: number) => {
    props.onPageChange(pageNo);
  };

  return (
    <div class="min-h-[68px] bg-white flex flex-row justify-between py-[0.5rem] px-[1.5rem] text-sm font-normal">
      <div class="text-primary flex items-center">
        Showing {(props.currentPageNo - 1) * props.recordsPerPage + 1} - {props.currentPageNo * props.recordsPerPage} of{" "}
        {props.totalItems}
      </div>
      <div class="flex flex-row items-center">
        <button
          disabled={props.currentPageNo === 1}
          onClick={() => handlePagination(props.currentPageNo > 1 ? props.currentPageNo - 1 : 1)}
          class={`${
            props.currentPageNo !== 1
              ? "pointer-events-auto text-primary hover:bg-gray-200 hover:text-pink-600"
              : " pointer-events-none text-gray-400 "
          } uppercase  p-2 inline-block border-y border-l rounded-tl-md rounded-bl-md `}
        >
          {"<<"}
        </button>
        <span class="flex  justify-center">
          {pageSlot().map(page => (
            <button
              onClick={() => handlePagination(page)}
              class={`${
                page === props.currentPageNo
                  ? "bg-primary text-white text-center border-primary"
                  : " text-center  text-primary  hover:bg-gray-200 hover:text-pink-600"
              } border-l border-y p-2 px-3 inline-block `}
            >
              {page === props.currentPageNo ? `${page}` : page}
            </button>
          ))}
          {totalAvailPages() > pageSlot().slice(-1)[0] && (
            <button class={" text-center text-primary cursor-not-allowed border-l border-y p-2 px-3 inline-block "}>...</button>
          )}
        </span>
        <button
          disabled={totalAvailPages() === props.currentPageNo}
          onClick={() =>
            totalAvailPages() !== props.currentPageNo
              ? handlePagination(props.currentPageNo + 1)
              : handlePagination(props.currentPageNo)
          }
          class={`${
            totalAvailPages() !== props.currentPageNo
              ? "pointer-events-auto text-primary hover:bg-gray-200 hover:text-pink-600 border border-text-primary"
              : " pointer-events-none text-gray-400"
          } uppercase font-normal text-sm p-2 inline-block border rounded-tr-md rounded-br-md`}
        >
          {">>"}
        </button>
      </div>
    </div>
  );
}

export { Pagination };
