import { createSignal } from "solid-js";
import { AutoComplete } from "../components/AutoComplete";
import { CouponCode } from "../components/CouponCode";
import { SurveyCard } from "../components/SurveyCard";
import { CommonIcon } from "../components/CommonIcon";
import { Pagination } from "../components/Pagination";
import { UploadImage } from "../components/UploadImage";
import { BundledProduct } from "../components/BundledProduct";
import { CollectionCard } from "../components/CollectionCard";
import { LBListCard } from "../components/LBListCard";
import { LBCategoryCard } from "../components/LBCategoryCard";
import { showError, showSuccess } from "../utils/showToaster";
import { setLocalStorageValue } from "@/utils/localStorage";
import { LOCALSTORAGE } from "@/constants/Storage.constant";
import { MemberCard } from "../components/members/MemberCard";
import { PageTitlebar } from "../components/PageTitlebar";
import { homePageBreadcrumb } from "../constants/BreadcrumbConstant";
import { Tab } from "../components/Tab";
import { Accordion } from "../components/Accordion";
import { Checkbox } from "../components/common/Checkbox";
import { RadioButton } from "../components/common/RadioButton";
import { SwitchToggle } from "../components/SwitchToggle";
import { EditorTinyMCE } from "../components/Editor";
import { CommonButton } from "../components/CommonButton";
import { TaxGroup } from "../components/TaxGroup";
import { PopupModal } from "../components/common/PopupModal";
import { CountrySelectionModal } from "../components/CountrySelectionModal";
import { CurrencyInput } from "../components/CurrencyInput";
import { SearchBar } from "../components/common/SearchBar";
import { Filter } from "@/components/filter/Filter";
import { Spinner } from "../components/Spinner";
import { StatusPicker } from "../components/StatusPicker";

export default function Home() {
  const accordionData = [
    {
      title: "Section 1",
      content: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis sapiente
            laborum cupiditate possimus labore, hic temporibus velit dicta earum
            suscipit commodi eum enim atque at? Et perspiciatis dolore iure
            voluptatem.`
    },
    {
      title: "Section 2",
      content: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis sapiente
            laborum cupiditate possimus labore, hic temporibus velit dicta earum
            suscipit commodi eum enim atque at? Et perspiciatis dolore iure
            voluptatem.`
    }
  ];
  // This function is used to shrink the parent margin when the collapse bar is clicked
  const [showMenu, setShowMenu] = createSignal(true);
  const [itemsCount, setItemsCount] = createSignal(100);
  const [currencyValue, setCurrencyValue] = createSignal(0);
  const [togglePopup, setTogglePopup] = createSignal(false);
  const [sidebar, setSidebar] = createSignal(false);
  const [allImages, setAllImages] = createSignal([]);
  const showSidebar = () => {
    setSidebar(!sidebar());
  };

  const closeSidebar = () => {
    setSidebar(false);
  };
  const removeMargin = e => {
    setShowMenu(e);
  };
  const onAddbtnClick = () => {
    console.log("click on Add Button");
  };

  // Below Values are Required for Tab Change from Parent Component
  const titles = [
    { label: "paginator", id: 1 },
    { label: "upload image", id: 2 },
    { label: "Confirmed", id: 3 }
  ];
  const [activeTab, setActiveTab] = createSignal(titles[0]);
  const onTabChange = e => {
    setActiveTab(e);
  };

  return (
    <>
      <div>
        <PageTitlebar
          breadcrumb={homePageBreadcrumb}
          pageTitle="Home Page"
          ItemCount="110"
          btnText="Add"
          url="/"
          addBtnTrigger={onAddbtnClick}
        ></PageTitlebar>
        {/* Searchbar */}
        <SearchBar placeholder="Search by some text">
          <CommonButton
            labelText="Filter"
            btnIcon="material-symbols:filter-list"
            bgWhite={true}
            hoverLightPink={true}
            clicked={e => {
              showSidebar();
            }}
          />
          <CommonButton
            labelText="Download"
            btnIcon="ic:outline-file-download"
            bgWhite={true}
            hoverLightPink={true}
            clicked={e => {
              showSidebar();
            }}
            customClass="mr-2"
          />
        </SearchBar>
        <h1>{import.meta.env.NUCLEUS_WEBSITENODEHOST}</h1>
        <div class="main-section bg-white float-left w-full p-4">
          <div class="border p-4 mb-4">
            <h2 class="text-xs text-gray-600 uppercase mb-4">Autocomplete Component</h2>
            <AutoComplete />
            <p class="text-xs">Text below the component to test overflow</p>
          </div>
          {/* common button */}
          <div class="border p-4 mb-4">
            <h2 class="text-xs text-gray-600 uppercase mb-4">Common Button Component</h2>
            <div class="flex">
              <CommonButton
                labelText="Create order"
                btnIcon="ic:baseline-plus"
                clicked={e => {
                  console.log(e);
                }}
                customClass="mr-2"
              />
              <CommonButton
                labelText="Create order"
                bgWhite={true}
                btnIcon="ic:baseline-plus"
                clicked={e => {
                  console.log(e);
                }}
                customClass="mr-2"
              />
              <CommonButton
                labelText="Submit"
                clicked={e => {
                  console.log(e);
                }}
                customClass="mr-2"
              />
              <CommonButton labelText="Pink Disabled" isDisabled={true} customClass="mr-2" />
              <CommonButton bgWhite="true" labelText="White Disabled" isDisabled={true} customClass="mr-2" />
              <CommonButton
                labelText="Filter"
                btnIcon="material-symbols:filter-list"
                bgWhite={true}
                hoverLightPink={true}
                clicked={e => {
                  showSidebar();
                }}
                customClass="mr-2"
              />
            </div>
          </div>
          <div class="border p-4 mb-4">
            <h2 class="text-xs text-gray-600 uppercase mb-4">Spinner Component</h2>
            <Spinner />
          </div>
          <div class="border p-4 mb-4">
            <h2 class="text-xs text-gray-600 uppercase mb-4">Status Picker Component</h2>
            <StatusPicker />
          </div>
          {sidebar() && <Filter checkIsSidebar={sidebar()} closeSidebar={closeSidebar} />}
          {/* <div class="border p-4 mb-4 bg-gray-100">
              <h2 class="text-xs text-gray-600 uppercase mb-4">Tabs</h2>
              <Tabs
                titles={["Paginator", "Upload Image", "MemberCard"]}
                components={[
                  <Pagination
                    totalItems={500}
                    currentPageNo={5}
                    noOfPageSlots={5}
                    recordsPerPage={10}
                  />,
                  <UploadImage />,
                  <MemberCard />,
                ]}
              />
            </div> */}

          {/* Tab Change Component */}
          <h1>Modified Tab Component</h1>
          <div class="border p-4 bg-gray-100">
            <h2 class="text-xs text-gray-600 uppercase mb-4">Tabs</h2>
            <Tab titles={titles} activeTab={activeTab} changeTab={onTabChange} country={true}>
              <div class="p-8 bg-white ">
                <Switch>
                  <Match when={activeTab().id === 1}>
                    <Pagination totalItems={itemsCount} currentPageNo={5} noOfPageSlots={5} recordsPerPage={10} />
                  </Match>
                  <Match when={activeTab().id === 2}>
                    <UploadImage imageRender={allImages()} setImageRender={setAllImages} multipleImage={true} maxImages={2} />
                  </Match>
                  <Match when={activeTab().id === 3}>
                    <MemberCard />
                  </Match>
                </Switch>
              </div>
            </Tab>
          </div>

          <div class="border p-4 mb-4">
            <h2 class="text-xs text-gray-600 uppercase mb-4">Accordion</h2>
            <Accordion accordionData={accordionData} />
          </div>
          <div class="border p-4 mb-4 text-primary hover:text-yellow-400">
            <h2 class="text-xs text-gray-600 uppercase mb-4">Icon Sets</h2>
            <CommonIcon icon="mdi-light:home" />
            <CommonIcon icon="mdi:user" />
            <CommonIcon icon="material-symbols:edit" />
            <CommonIcon icon="mdi:bin" />
            <CommonIcon icon="mdi:arrow-right-circle" />
          </div>

          <div class="border p-4 mb-4">
            <h2 class="text-xs text-gray-600 uppercase mb-4">Toast Messages</h2>
            <button
              class="bg-primary"
              style={"padding:6px;color:white;margin-right:10px;"}
              onClick={() => showSuccess("Your Widget Test1 updated successfully!")}
            >
              Show Success
            </button>
            <button
              class="bg-primary"
              style={"padding:6px;color:white;"}
              onClick={() => showError("Your Test1 Widget update error!")}
            >
              Show Error
            </button>
          </div>

          {/* checkbox */}
          <div class="border p-4 mb-4">
            <h2 class="text-xs text-gray-600 uppercase mb-4">Custom Checkbox adn Radio Button Component</h2>
            <Checkbox
              labelText="Custom Checkbox"
              id="siteWide"
              checked={e => {
                console.log(e);
              }}
              isChecked
            />
            <RadioButton
              labelText="Custom Checkbox"
              id="siteWide"
              checked={e => {
                console.log(e);
              }}
              isChecked
            />
          </div>
          {/* Product Preview */}
          {/* <ProductPreview
              productImg="https://s3.ap-south-1.amazonaws.com/files.myglamm.net/myglamm-alpha/800x800/download-1_1.jpg"
              productTitle="TestProduct"
              prdSubTitle="TestSubTitle"
              productPrice={100}
              shadeImg="https://s3.ap-south-1.amazonaws.com/files.myglamm.net/myglamm-alpha/original/1671788109730.jpg"
            /> */}
          <div class="border p-4 mb-4">
            <h2 class="text-xs text-gray-600 uppercase mb-4">Editor TinyMCE</h2>
            <EditorTinyMCE />
          </div>

          {/* switch toggle */}
          <div class="border p-4 mb-4">
            <h2 class="text-xs text-gray-600 uppercase mb-4">Switch Toggle Component</h2>
            <SwitchToggle
              isChecked
              checked={e => {
                console.log(e);
              }}
            />
          </div>
          {/* tax group */}
          <div class="border p-4 mb-4">
            <h2 class="text-xs text-gray-600 uppercase mb-4">Tax Group Component</h2>
            <TaxGroup
              taxTitle="0% Tax"
              taxCount="0"
              clicked={e => {
                console.log(e);
              }}
            />
          </div>

          {/* Pagination  */}
          <div class="border p-4 mb-4">
            <h2 class="text-xs text-gray-600 uppercase mb-4">Pagination Component</h2>
            <Pagination totalItems={itemsCount} currentPageNo={5} noOfPageSlots={5} recordsPerPage={10} />
          </div>
          <div class="border p-4 mb-4">
            <h2 class="text-xs text-gray-600 uppercase mb-4">Currency Input </h2>
            <CurrencyInput
              labelName="charges"
              labelText="Charges"
              value={currencyValue()}
              handleChange={value => setCurrencyValue(value)}
            />
            <p>Output {currencyValue()}</p>
          </div>
          <div class="border p-4 mb-4">
            <h2 class="text-xs text-gray-600 uppercase mb-4">Popup </h2>
            <PopupModal show={togglePopup()} onRequestClose={setTogglePopup(!togglePopup())}>
              <CountrySelectionModal onRequestClose={setTogglePopup(!togglePopup())} />
            </PopupModal>
            <button onClick={() => setTogglePopup(!togglePopup())}>Country Popup Toggle</button>
          </div>
          <div class="border p-4 mb-4">
            <h2 class="text-xs text-gray-600 uppercase mb-4">Upload Image Component</h2>
            <UploadImage />
          </div>

          <div class="border p-4 mb-4">
            <h2 class="text-xs text-gray-600 uppercase mb-4">Member Card</h2>
            <MemberCard />
          </div>
          <div class="border p-4 mb-4">
            <h2 class="text-xs text-gray-600 uppercase mb-4">Currency Input </h2>
            <CurrencyInput
              labelName="charges"
              labelText="Charges"
              value={currencyValue()}
              handleChange={value => handleChange(value)}
            />
            <p>Output {currencyValue()}</p>
          </div>
          <div className="flex flex-col  justify-center align-middle items-center gap-8 my-32">
            {/* Discount Coupon Code Card  */}
            <CouponCode
              code={"50LCOUPONS5A97C37F78"}
              issuedOn={"14 Oct 2022"}
              validTill={"15 Oct 2022"}
              usage={"0"}
              discountAmount={1000}
              couponStatus={true}
              expired={true}
            />

            {/* Survey Card */}
            <SurveyCard title={"Survey Form Test"} createdOn={"14 Oct 2022"} language="eng" />
            {/* BundledProduct */}
            <BundledProduct
              title="Myglamm LIT -PH LIP balm"
              tag="makeup"
              price={690}
              deletePrice={900}
              code="CMB0020420"
              language="EN, HI"
              productAvailable={10}
            />
            {/* Products List / Collections */}
            <CollectionCard
              title=" COLLECTION MINI PDP SEACH TAGSADASDAS "
              tag="simple collection"
              redirectURL="https://alpha-mr.myglamm.net/collection/pick-any-1-product-1-re"
              language="EN"
              productAvailable={4}
            />
            {/* LookBook/List */}
            <LBListCard
              title="Myglamm LIT -PH LIP balm"
              tag="makeup"
              date={"14 Oct 2022"}
              price={690}
              language="EN, HI"
              productAvailable={10}
            />

            {/* LookBook/Category */}
            <LBCategoryCard title="Myglamm LIT -PH LIP balm" categoryAvailable={10} />
          </div>
        </div>
      </div>
    </>
  );
}
