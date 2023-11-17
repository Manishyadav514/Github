import { PageTitlebar } from "@components/PageTitlebar";
import { MembersBreadcrumb } from "@constants/BreadcrumbConstant";
import { CommonIcon } from "@components/CommonIcon";
import { A } from "@solidjs/router";
import { Match, Switch, createSignal } from "solid-js";
import { Tab } from "@components/Tab";
import { Address } from "@/components/members/Address";

const MemberDetails = () => {
  const memberName = "Kitty Cat";
  let breadcrumb = [
    ...MembersBreadcrumb,
    {
      name: memberName,
    },
  ];
  // tab component
  // Below Values are Required for Tab Change from Parent Component
  const titles = [
    { label: "My Rewards", id: 1 },
    { label: "Address", id: 2 },
    { label: "Earnings", id: 3 },
    { label: "Orders", id: 4 },
    { label: "Community", id: 5 },
    { label: "Preferences", id: 6 },
    { label: "Referral Code", id: 7 },
    { label: "Scratch Cards", id: 8 },
    { label: "Meta", id: 9 },
  ];
  const [activeTab, setActiveTab] = createSignal(titles[0]);
  const onTabChange = e => {
    setActiveTab(e);
  };
  return (
    <div>
      <div>
        <PageTitlebar breadcrumb={breadcrumb} pageTitle={memberName} />
        <div class="w-full bg-white p-1 mb-6">
          <div class="w-full flex p-4">
            <div class="flex flex-col">
              <div class="object-cover rounded-full h-32 w-32">
                <img src="https://nucleus-alpha.myglamm.net/assets/images/member.svg" alt="profile"></img>
              </div>
              <div class="flex gap-1 pt-4 justify-center items-center">
                <div class="h-3 w-4">
                  <img
                    src="https://s3.ap-south-1.amazonaws.com/files.myglamm.net/myglamm-alpha/discount/original/india.png"
                    alt="flag"
                    class="object-cover"
                  ></img>
                </div>
                <span class="text-xs font-semibold">India</span>
              </div>
            </div>
            <div class="w-full flex flex-col justify-between">
              <div class="flex justify-between mb-4">
                <div class="flex gap-2 justify-center items-center">
                  <h2 class="text-xl font-semibold">{memberName}</h2>
                  <span class="rounded bg-greenLight1 text-greenDark2 capitalize font-normal text-base p-2 ">Ambassador</span>
                  <span class="text-blue-600">
                    <CommonIcon icon="mingcute:information-fill" width={25} height={25} />
                  </span>
                </div>
                <span class="text-primary">
                  <A href={`/members/edit/randomID`}>
                    <CommonIcon icon="ph:pencil-thin" width={25} height={25} />
                  </A>
                </span>
              </div>
              <div>
                <div class="flex gap-1 text-gray-400 items-center">
                  <CommonIcon icon="ph:link-fill" width={14} height={14} />
                  <p class="text-primary text-sm"> https://s.mygl.in/rfc6XK8NCjb?rc=PRIY5991</p>
                </div>
                <div class="flex flex-wrap justify-between mt-4">
                  <div class="flex gap-4">
                    <span class="flex flex-col text-sm pr-8">
                      <p class="text-[#aaadb7]">Span Up Date</p>
                      <p class="text-[#696f80] font-semibold">11 jan 2023</p>
                    </span>
                    <span class="flex flex-col text-sm px-4">
                      <p class="text-[#aaadb7]">Parent Member</p>
                      <p class="text-[#696f80] font-semibold">-</p>
                    </span>
                    <span class="flex px-4">
                      <span class="flex flex-col text-sm mr-2 ">
                        <p class="text-[#aaadb7]">Referral Generated Code</p>
                        <p class="text-[#696f80] font-semibold">PRIY5991</p>
                      </span>
                      <CommonIcon icon="mingcute:information-fill" width={18} height={18} />
                    </span>
                  </div>
                  <div class="flex justify-center items-center gap-2">
                    <p class="text-base mr-2">Subscritpion</p>
                    <span class="cursor-pointer flex justify-center items-ceneter border border-green-400 text-green-600 rounded p-2">
                      <CommonIcon icon="ri:whatsapp-fill" width={15} height={15} />
                    </span>
                    <span class="cursor-pointer flex justify-center items-ceneter border border-blue-400 text-blue-600 rounded p-2">
                      <CommonIcon icon="mdi:message-processing" width={15} height={15} />
                    </span>
                    <span class="cursor-pointer flex justify-center items-ceneter border border-yellow-400 text-yellow-500 rounded p-2">
                      <CommonIcon icon="mdi:email-open" width={15} height={15} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="p-4 grid grid-cols-9 mb-2 border-t text-[#aaadb7] border-gray-200">
            <div class="gap-1 flex flex-col justify-center items-center px-4">
              <CommonIcon icon="mdi:diamond-stone" width={24} height={24} />
              <p class="uppercase text-base font-semibold text-black">Silver</p>
              <p class="text-xs">Reward Level</p>
            </div>
            <div class="gap-1 flex flex-col justify-center items-center px-4">
              <CommonIcon icon="mdi:diamond-stone" width={24} height={24} />
              <p class="uppercase text-base font-semibold text-black">0</p>
              <p class="text-xs">Reward Level</p>
            </div>
            <div class="gap-1 flex flex-col justify-center items-center px-4">
              <CommonIcon icon="mdi:diamond-stone" width={24} height={24} />
              <p class="uppercase text-base font-semibold text-black">0</p>
              <p class="text-xs">Reward Level</p>
            </div>
            <div class="gap-1 flex flex-col justify-center items-center px-4">
              <CommonIcon icon="mdi:diamond-stone" width={24} height={24} />
              <p class="uppercase text-base font-semibold text-black">0</p>
              <p class="text-xs">Reward Level</p>
            </div>
            <div class="gap-1 flex flex-col justify-center items-center px-4">
              <CommonIcon icon="mdi:diamond-stone" width={24} height={24} />
              <p class="uppercase text-base font-semibold text-black">0</p>
              <p class="text-xs">Reward Level</p>
            </div>
          </div>
        </div>
        <div class="p-5 bg-white">
          <Tab titles={titles} activeTab={activeTab} changeTab={onTabChange} country={false}>
            <div class="p-8 bg-white ">
              <Switch>
                <Match when={activeTab().id === 1}>
                  <>
                    <div class="relative w-full grid grid-cols-3 justify-between items-center bg-secondary p-6 mb-6 text-xl font-semibold text-primary min-h-[200px] bg-no-repeat bg-center bg-[url('https://nucleus-alpha.myglamm.net/earning.b9a82cfefa3151c2.svg')]">
                      <div class="col-span-2">
                        <div class="p-4">
                          Claimed Rewards:
                          <span class="ml-1 text-black">0</span>
                        </div>
                        <div class="p-4">
                          Balance:
                          <span class="ml-1 text-black">0</span>
                        </div>
                      </div>
                      <div class="col-span-1 text-center">
                        Friends who Have <br></br>Claimed FREE Lipstick
                        <p class="ml-1 text-black">0</p>
                      </div>
                      <img src=""></img>
                    </div>
                    <div class="flex w-full text-center gap-4">
                      <div class="w-full">
                        <p class="text-xl">Current Reward Status </p>
                        <div class="p-8 mt-2 border border-gray-200"></div>
                      </div>
                      <div class="w-full">
                        <p class="text-xl">Friend Who Claimed Reward </p>
                        <div class="p-8 mt-2 border border-gray-200">
                          <p class="text-primary text-base font-normal">No record found </p>
                        </div>
                      </div>
                    </div>
                  </>
                </Match>
                <Match when={activeTab().id === 2}>
                  <Address />
                </Match>
                <Match when={activeTab().id === 3}>
                  <div>loewerw</div>
                </Match>
              </Switch>
            </div>
          </Tab>
        </div>
      </div>
    </div>
  );
};

export default MemberDetails;
