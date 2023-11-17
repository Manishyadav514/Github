interface ITabProps {
  titles: any;
  changeTab: (param: any) => any;
  activeTab: any;
  children?: any;
  country?: boolean;
  labelKey: string;
  idKey?: string;
}

function Tab({ titles, activeTab, changeTab, children, country = true, labelKey = "label", idKey = "id" }: ITabProps) {
  const handleTabClick = (obj: any) => {
    changeTab(obj);
  };

  return (
    <div class="bg-grey-100 font-semibold">
      {/* Flag Visibility */}
      {country && (
        <div class="px-5 py-[10px] flex flex-row justify-center items-center gap-2 w-fit bg-white rounded-t-lg">
          <img
            width="19px"
            height="12px"
            src="https://s3.ap-south-1.amazonaws.com/files.myglamm.net/myglamm-alpha/discount/original/india.png"
            alt="India flag"
          />
          <span>India</span>
        </div>
      )}
      {/* Tab Titles */}
      {titles && (
        <div class="flex flex-row flex-wrap border-b text-base pt-2 bg-white pl-4">
          {titles.map((title: any, i: number) => (
            <button
              class={`${
                activeTab()[idKey] === title[idKey] ? "text-primary  border-primary border-b-2  " : "opacity-[0.5]"
              }  px-2 py-[10px] mr-[5px] capitalize`}
              onClick={() => handleTabClick(title)}
            >
              {title[labelKey]}
            </button>
          ))}
        </div>
      )}
      {/* Conditional Component */}
      {children}
    </div>
  );
}

export { Tab };
