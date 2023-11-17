import { createSignal, onMount } from "solid-js";

import { PageTitlebar } from "@components/PageTitlebar";
import { Pagination } from "@components/Pagination";
import { Link, useNavigate } from "@solidjs/router";
import { MembersBreadcrumb } from "../../constants/BreadcrumbConstant";
import { CommonButton } from "@components/CommonButton";
import { SearchBar } from "@components/common/SearchBar";
import { MemberCard } from "@/components/members/MemberCard";

import MemberAPI from "@services/members.service";
import { API_CONFIG, StatusEnum } from "@/constants/api.constant";
import { getLocalStorageValue } from "@/utils/localStorage";
import { LOCALSTORAGE } from "@/constants/Storage.constant";
import { showError } from "@/utils/showToaster";
import { MemberI } from "@/models/member.model";
import { hideLoader, showLoader } from "@/services/loader.service";

export default function Members() {
  const navigate = useNavigate();
  const vendorCode = getLocalStorageValue(LOCALSTORAGE.SELECTED_VENDORCODE);
  const [currentPageNo, setCurrentPageNo] = createSignal(1); // current active page
  const [sort, setSort] = createSignal("createdAt DESC");
  const [memberFilter, setMemberFilter] = createSignal({
    statusId: {
      inq: [StatusEnum.ACTIVE, StatusEnum.INACTIVE],
      vendorCode: { inq: [vendorCode] }
    }
  });
  const [memberCount, setMemberCount] = createSignal(0); // no. of members
  const [memberData, setMemberData] = createSignal([]);
  const [glammPoints, setGlammPoints] = createSignal({});
  const pageSize = API_CONFIG.pageSize;

  const memberAPI = new MemberAPI();

  onMount(() => {
    getMembersData();
  });

  /**
   * @description its is used to fetch members data
   */
  const getMembersData = async () => {
    showLoader("Members listing....");
    await getMembersCount();
    try {
      const res: any = await memberAPI.fetchAllMembers(pageSize, currentPageNo(), [sort()], memberFilter());
      setMemberData(res?.data?.data?.data);
      let idList = memberData().map((res: any) => {
        return res.id;
      });
      if (idList && idList.length) {
        getGlammPoints(idList);
      }
      hideLoader();
    } catch (err: any) {
      showError((err && err?.message) || (err && err.error && err.error.message) || "Member List");
    }
  };

  /**
   * @description it is used to fetch members data count
   */
  const getMembersCount = async () => {
    try {
      const data: any = await memberAPI.fetchAllMembersCount(pageSize, currentPageNo(), [sort()], memberFilter());
      if (data?.data) {
        setMemberCount(data?.data?.data?.count);
      }
    } catch (e: any) {
      showError(e.message || "Error!");
    }
  };

  /**
   * @description It is used to fetch glammPoints
   *
   * @memberof MemberComponent
   */
  const getGlammPoints = async (idList: any) => {
    let where = { _id: { $in: idList } };
    try {
      const res = await memberAPI.fetchGlammPoints(where);
      const data = res?.data?.data?.responseData;
      let glammObj: any = {};
      for (let i = 0; i < data?.length; i++) {
        glammObj[data?.[i].identifier] = data[i].currentBalance;
      }
      setGlammPoints(glammObj);
    } catch (e: any) {
      showError(e?.error?.message || "Member List");
    }
  };

  // handle page change
  const handlePageChange = (page: any) => {
    setCurrentPageNo(page);
    getMembersData();
  };

  /**
   * @description on search text change
   *
   * @param {string} searchString
   */
  const onSearchChange = (searchString: string) => {
    if (searchString) {
      setMemberFilter({ ...memberFilter(), search: searchString });
    } else {
      let filter: any = memberFilter();
      delete filter["search"];
      setMemberFilter({ ...filter });
    }
    setCurrentPageNo(1);
    getMembersData();
  };

  return (
    <div>
      <PageTitlebar
        breadcrumb={MembersBreadcrumb}
        pageTitle="Members"
        btnText="Add New Member"
        addBtnTrigger={() => navigate(`/members/add`, { replace: false })}
      >
        <CommonButton
          labelText="Bulk Members Upload"
          clicked={() => navigate(`/members/bulk-member-upload`, { replace: false })}
        />
      </PageTitlebar>
      <SearchBar
        placeholder="Search by Member Name, Phone Number and Email"
        onInput={term => {
          onSearchChange(term);
        }}
      >
        <CommonButton
          labelText="Filter"
          btnIcon="material-symbols:filter-list"
          bgWhite={true}
          hoverLightPink={true}
          clicked={(e: any) => {
            // showSidebar();
          }}
        />
      </SearchBar>
      <div class="flex flex-wrap bg-white ">
        {memberData()?.map((member: MemberI) => (
          <div class="pt-4 pl-[25px] pb-6">
            <MemberCard memberData={member} glammPoints={glammPoints()} />
          </div>
        ))}
      </div>

      <Pagination
        onPageChange={handlePageChange}
        totalItems={memberCount()}
        currentPageNo={currentPageNo()}
        noOfPageSlots={5}
        recordsPerPage={pageSize}
      />
    </div>
  );
}
