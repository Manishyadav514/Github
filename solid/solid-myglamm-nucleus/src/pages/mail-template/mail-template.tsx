import { createSignal, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";

// Common components
import { PageTitlebar } from "@components/PageTitlebar";
import { SearchBar } from "@components/common/SearchBar";
import MailTemplateList from "@components/mail-template/mail-template-list";
import { Pagination } from "@/components/Pagination";

// Utility
import { showError } from "@/utils/showToaster";
import { getLocalStorageValue } from "@/utils/localStorage";

// Constant
import { MailTemplateBreadcrumb } from "../../constants/BreadcrumbConstant";
import { API_CONFIG } from "@/constants/api.constant";
import { LOCALSTORAGE } from "@/constants/Storage.constant";

// Services
import { hideLoader, showLoader } from "@/services/loader.service";
import MailTemplatesHttpService  from "./mail-templates-https/mail-templates-http.service"



const MailTemplatesComponent = () => {
    const [currentPage, setCurrentPage] = createSignal(1); // current active page
    const [SortOrder, setSortOrder] = createSignal({updatedAt: -1}); // This variable is use for sorting data
    const [templateSearch, setTemplateSearch] = createSignal(""); // This variable is use for search template
    const [mailTemplateData, setMailTemplateData] = createSignal<any>([]); // This variable is set/get mail template data
    const [paginationTotalCount, setPaginationTotalCount] = createSignal(0); // Total paginationTotalCount

    // Set were condition
    const mailTemplateFilter: { [key: string]: any } = {
        vendorCode: getLocalStorageValue(LOCALSTORAGE.SELECTED_VENDORCODE)
    };
    
    const pageSize = API_CONFIG.pageSize;
    const navigate = useNavigate();
    const moduleName = "Mail Templates";

    const _mailTemplateHttp = new MailTemplatesHttpService()
    

    onMount(()=>{
        fetchAllMailTemplateList()
    })
    /**
        * @description get all mail template listing
        * @param {number} currentPage
        * @memberof MailTemplatesComponent
   */
    const fetchAllMailTemplateList = async () =>{
        showLoader('Fetching Mail Templates...')
        try{
            const res:any = await _mailTemplateHttp.fetchAllMailTemplates(pageSize, currentPage(), mailTemplateFilter, SortOrder(),templateSearch() )
            setMailTemplateData(res?.data?.data?.responseData)
            setPaginationTotalCount(res?.data?.data?.totalRecords)
        }catch(err:any){
            showError((err && err?.message) || (err && err.error && err.error.message) || "Mail Template List");
        }finally {
            hideLoader();
        }
    }

    /**
        * @description it is called when page is changed by user
        * @param {number} currentPage
        * @memberof MailTemplatesComponent
    */
    const handlePageChange = (page:number) =>{
        setCurrentPage(page)
        fetchAllMailTemplateList()
    }

    /**
        * @description search mail template
        *
        * @param {string} searchString
        * @memberof MailTemplatesComponent
   */
   const onSearchChange = (searchString: string) => {
        setTemplateSearch(searchString)
        fetchAllMailTemplateList()
    };


    return (
      <div>
        <PageTitlebar
            breadcrumb={MailTemplateBreadcrumb}
            pageTitle={moduleName}
            btnText="Add Mail Template"
            addBtnTrigger={() => navigate(`/mail-templates/add`, { replace: false })}
        >
        </PageTitlebar>
        <SearchBar
            placeholder="Search by template name"
            onInput={term => {
                onSearchChange(term);
            }}
        >
        </SearchBar>
        <div class="bg-white pt-4">
            {/* Mail Template component */}
            <MailTemplateList 
                data={mailTemplateData()} 
            />
            {/* pagination component */}
            <Pagination
                onPageChange={handlePageChange}
                totalItems={paginationTotalCount()}
                currentPageNo={currentPage()}
                noOfPageSlots={5}
                recordsPerPage={pageSize}
            />
        </div>
        
      </div>
    );
  };
  
  export default MailTemplatesComponent;