
import { createSignal } from "solid-js";

interface ITabProps {
  titles: string[];
  components: any;
}

function Tabs({ titles, components }: ITabProps) {
  const [activeTab, setActiveTab] = createSignal(0);
  const handleTabClick = (i: number) => {
    setActiveTab(i);
  };
  return (
    <span class="bg-white rounded-lg">
      <div class="px-4 pt-3 pb-2 flex space-x-4 w-fit bg-white rounded-t-lg">
        <img
          width="27px"
          height="16px"
          src="https://s3.ap-south-1.amazonaws.com/files.myglamm.net/myglamm-alpha/discount/original/india.png"
          alt="India flag"
        />
        <span>India</span>
      </div>
      <div class="px-4 py-4 bg-white rounded-b-lg">
        <div class="flex space-x-7 border-b ">
          {titles.map((title: string, i: number) => (
            <button
              class={`${
                activeTab() === i
                  ? "text-primary  border-primary border-b-2  "
                  : "text-gray-500"
              } text-md px-4 pb-3 font-semibold`}
              onClick={() => handleTabClick(i)}
            >
              {title}
            </button>
          ))}
        </div>
        {/* @ts-ignore */}
        <div class="my-4 border p-8">{components[activeTab()]}</div>
      </div>
    </span>
  );
}

export { Tabs };
