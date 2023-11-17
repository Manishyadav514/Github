import { For } from "solid-js";
import { CommonIcon } from "./CommonIcon.js";
import StatusManipulator from "./StatusHandler.jsx";
import StatusHandler from "./StatusHandler.jsx";

interface LinkBuilderProps {
  requestForm: string;
  eventName: string;
  comment: string;
  date: string;
  transactionAmount: number;
  errorCount: number;
  sucessCount: number;
  totalCount: number;
  status: string;
}

const GoodPointRow = ({
  requestForm,
  eventName,
  comment,
  date,
  transactionAmount,
  errorCount,
  sucessCount,
  totalCount,
}: LinkBuilderProps) => {
  return (
    <tr class="h-[67px] text-sm text-gray-900 font-normal bg-white box-border border-b border-[#dee2e6]">
      <td class="px-3 capitalizeh-fullflex flex-wrap font-medium  items-center gap-1">
        {requestForm}
      </td>
      <td class="px-3 h-full whitespace-nowrap">{eventName}</td>
      <td class="px-3 h-full whitespace-nowrap">{comment}</td>
      <td class="px-3 h-full whitespace-nowrap">{date}</td>
      <td class="px-3 h-full whitespace-nowrap">{transactionAmount}</td>
      <td class="px-3 h-full whitespace-nowrap">{errorCount}</td>
      <td class="px-3 h-full whitespace-nowrap">{sucessCount}</td>
      <td class="px-3 h-full whitespace-nowrap">{totalCount}</td>
      <td class="px-3 h-full whitespace-nowrap">
        <select id="couponStatus" class="block px-2 py-3 bg-white text-base ">
          <option
            value="active"
            class={`${
              true && "bg-secondary"
            } w-8 hover:bg-slate-400 text-primary cursor-pointer`}
          >
            Active
          </option>
          <option selected value="inactive">
            Inactive
          </option>
        </select>
      </td>
    </tr>
  );
};

const GoodPointsTable = () => {
  return (
    <>
      <table class="min-w-full text-left">
        <thead>
          <tr class="pt-3 bg-white border-y border-[#dee2e6]">
            <For
              each={[
                "Request Form",
                "Event Name",
                "Comments",
                "Date",
                "Transaction Amount",
                "Error Count",
                "Success Count",
                "Total Count",
                "Status Count",
              ]}
            >
              {(item, i) => (
                <td class="capitalize p-3 text-sm text-[#908F97] h-fullwhitespace-nowrap">
                  {item}
                </td>
              )}
            </For>
          </tr>
        </thead>
        <tbody>
          {[...Array(5).keys()].map(() => (
            <GoodPointRow
              requestForm="member"
              eventName="-"
              comment="asa"
              date={"14 Oct 2022, 11:20 AM"}
              transactionAmount={10}
              errorCount={0}
              sucessCount={0}
              totalCount={10}
              status="active"
            />
          ))}
        </tbody>
      </table>
    </>
  );
};

export { GoodPointsTable };
