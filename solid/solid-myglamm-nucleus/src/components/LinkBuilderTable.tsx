import { For } from "solid-js";
import { CommonIcon } from "./CommonIcon.jsx";
import { useNavigate } from "@solidjs/router";

interface LinkBuilderProps {
  type: string;
  id: string;
  destination: string;
  discountCode: string;
  shortURL: string;
  createdDate: string;
}

const LinkBuildRow = (props: LinkBuilderProps) => {
  console.log(props);
  
  const navigate = useNavigate();
  return (
    <tr class="h-[67px] bg-white box-border border-b border-[#dee2e6]">
      <td class="px-3 capitalizeh-fullflex flex-wrap text-sm font-medium text-gray-900 items-center gap-1">{props?.type}</td>
      <td class="px-3 text-sm text-gray-900 font-light h-full whitespace-nowrap">{props?.destination}</td>
      <td class="px-3 text-sm text-gray-900 font-light h-full whitespace-nowrap">{props?.discountCode}</td>
      <td class="max-w-[300px] overflow-hidden px-3 text-sm text-primary font-light h-full whitespace-nowrap">
        {props?.shortURL}
      </td>
      <td class="px-3 text-sm text-gray-900 font-light h-full whitespace-nowrap">{props?.createdDate}</td>
      <td class="px-3 h-full whitespace-nowrap text-primary cursor-pointer">
        {/* <a href={`${window.location.href}/edit/${Math.floor(Math.random() * 10) + 1}`}>
          <CommonIcon icon="ph:pencil-thin" />
        </a> */}
        <CommonIcon icon="ph:pencil-thin" click={() => navigate(`/link-builder/edit/${props.id}`, { replace: false })} />
      </td>
    </tr>
  );
};

const LinkBuilderTable = (props: any) => {
  console.log("datat is recieved", props.data);
  return (
    <>
      <table class="min-w-full text-left">
        <thead>
          <tr class="pt-3 bg-white border-y border-[#dee2e6]">
            <For each={["Type", "Destination", "Discount Code", "Short Url", "Created Date", "Action"]}>
              {(item, i) => <td class="capitalize p-3 text-sm text-[#908F97] font-lighth-fullwhitespace-nowrap">{item}</td>}
            </For>
          </tr>
        </thead>
        <tbody>
          {props?.data?.length > 0 && (
            <For each={props?.data}>
              {(item: any, i) => (
                <LinkBuildRow
                  type={item.type || "-"}
                  destination={item.id || "-"}
                  id={item.id || "-"}
                  discountCode={item.discountCode || "-"}
                  shortURL={item.shortUrl || "-"}
                  createdDate={item.createdAt || "-"}
                />
              )}
            </For>
          )}
        </tbody>
      </table>
    </>
  );
};

export { LinkBuilderTable, LinkBuildRow };
