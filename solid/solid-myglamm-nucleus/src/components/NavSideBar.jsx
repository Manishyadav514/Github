import { createSignal, For, Show } from "solid-js";
import { CommonIcon } from "./CommonIcon";
import clsx from "clsx";
import { useNavigate } from "@solidjs/router";
import { sidebarMenu } from "@/constants/navigation-constant";

function NavSideBar(props) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = createSignal("");
  const [showNestedMenu, setShowNestedMenu] = createSignal("");
  const [isOpen, setIsopen] = createSignal(true);

  // handle parent menu click
  const menuClick = menu => {
    menu?.routerLink && navigate(menu?.routerLink);
    setShowMenu(menu.name);
    setShowNestedMenu("");
  };

  //  handle nested menu click
  const nestedMenuClick = menu => {
    setShowNestedMenu(menu.name);
    navigate(menu?.routerLink, { replace: true });
  };

  // This function is use for collapsed side nav;
  const collapsedNavClick = e => {
    props.width(e);
    setIsopen(e);
  };

  return (
    <nav
      class={clsx(
        "sideBar fixed bg-white  ml-[-235px] left-[235px] bottom-0 top-[78px] overflow-x-hidden overflow-y-scroll border-0 whitespace-nowrap pb-[48px]",
        isOpen() ? "w-[210px]" : "w-[49px]"
      )}
    >
      <For each={sidebarMenu}>
        {menu => (
          <div class=" list-none float-left w-full cursor-pointer">
            <a
              class={clsx(
                "p-3 flex items-center text-[#808593] border-l-4 border-white border-opacity-0 hover:text-primary hover:bg-secondary hover:border-primary hover:border-opacity-100",
                showMenu() === menu.name ? "bg-secondary border-l-4 text-primary border-primary border-opacity-100" : ""
              )}
              onClick={() => menuClick(menu)}
            >
              <span class="hover:text-primary">
                <CommonIcon icon={`${menu.icon}`} />
              </span>
              <span class="ml-2">{menu.name}</span>
            </a>
            {showMenu() === menu.name && menu.nestedMenu && menu.nestedMenu.length > 0 && (
              <For each={menu.nestedMenu}>
                {nMenu => (
                  <a
                    onClick={() => nestedMenuClick(nMenu)}
                    class={clsx(
                      "pl-[35px] py-2 float-left w-full text-[#808593] hover:text-primary",
                      showNestedMenu() === nMenu.name ? "text-primary " : ""
                    )}
                  >
                    {nMenu.name}
                  </a>
                )}
              </For>
            )}
          </div>
        )}
      </For>
      <div
        class={clsx(
          "toggle-button fixed bottom-0 p-3  text-primary bg-white cursor-pointer text-center",
          isOpen() ? "w-[210px]" : "w-[64px]"
        )}
        onClick={() => collapsedNavClick(!isOpen())}
      >
        {/* <i class="icon-angle-double-{{ collapsed ? 'right' : 'left' }}"></i>&nbsp; */}
        <span class="text-base">{isOpen() ? "<< Collapse Sidebar" : ">>"}</span>
      </div>
    </nav>
  );
}

export { NavSideBar };
