import { For } from "solid-js";
import { CommonIcon } from "./CommonIcon";

interface LinkLogProps {
  date: string;
  feature: string;
  activity: string;
  name: string;
}

const LinkLogEle = ({ date, feature, activity, name }: LinkLogProps) => {
  return (
    <tr class="h-[67px] bg-white box-border border-b border-[#dee2e6]">
      <td class="px-3 capitalizeh-fullflex flex-wrap text-sm font-medium text-gray-900 items-center gap-1">
        {date}
      </td>
      <td class="px-3 text-sm text-gray-900 font-light h-full whitespace-nowrap">
        {feature}
      </td>
      <td class="px-3 text-sm text-gray-900 font-light h-full whitespace-nowrap">
        {activity}
      </td>
      <td class="max-w-[300px] overflow-hidden px-3 text-sm text-primary font-light h-full whitespace-nowrap">
        {name}
      </td>
      <td class="px-3 h-full whitespace-nowrap text-primary">
        <a>
          <CommonIcon icon="ph:pencil-thin" />
        </a>
      </td>
    </tr>
  );
};

const LinkBuildLog = () => {
  return (
    <>
      <table class="min-w-full text-left">
        <thead>
          <tr class="pt-3 bg-white border-y border-[#dee2e6]">
            <For each={["Date", "feature", "Activity", "Name", "Action"]}>
              {(item, i) => (
                <td class="capitalize p-3 text-sm text-[#908F97] font-lighth-fullwhitespace-nowrap">
                  {item}
                </td>
              )}
            </For>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan={5}>
              <div class="bg-white p-6 mt-6">
                <div class="min-h-[100px] flex justify-center align-middle items-center">
                  <p class="text-sm text-primary capitalize">
                    No Records found
                  </p>
                </div>
              </div>
            </td>
          </tr>
          {/* <LinkLogEle
            date={"14 Oct 2022, 11:20 AM"}
            feature="-"
            activity="-"
            name={"-"}
          /> */}
        </tbody>
      </table>
    </>
  );
};

export { LinkBuildLog };
