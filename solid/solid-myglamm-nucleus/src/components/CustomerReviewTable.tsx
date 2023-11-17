import { For, Match, Switch, createSignal } from "solid-js";
import { CommonIcon } from "./CommonIcon";
import { PopupModal } from "./common/PopupModal";
import { ReviewPopup } from "./ReviewPopup";

interface ReviewRowProps {
  productName: string;
  date: string;
  customerName: string;
  rating: number;
  comment: string;
  subParameters: any;
  imageSRC: string;
  likes: number;
  country: string;
  action: any;
}

const data = [
  {
    productName: "MyGlamm K.Play Flavoured Lipstick - Cherry Burst",
    date: "23 Dec 2022",
    customerName: "Darshana",
    rating: 1,
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    subParameters: [
      { label: "colour", rating: 1 },
      { label: "long lasting", rating: 2 },
      { label: "value for money", rating: 3 },
      { label: "colour", rating: 4 },
    ],
    imageSRC: "https://s3.ap-south-1.amazonaws.com/files.myglamm.net/myglamm-alpha/original/1671788109730.jpg",
    likes: 10,
    country: "india",
    action: "",
  },
  {
    productName: "MyGlamm K.Play Flavoured Lipstick - Cherry Burst",
    date: "23 Dec 2022",
    customerName: "Manish Yadav",
    rating: 2,
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    subParameters: [
      { label: "colour", rating: 5 },
      { label: "long lasting", rating: 5 },
    ],
    imageSRC: "https://s3.ap-south-1.amazonaws.com/files.myglamm.net/myglamm-alpha/original/1671788109730.jpg",
    likes: 10,
    country: "india",
    action: "",
  },
  {
    productName: "MyGlamm K.Play ",
    date: "23 Dec 2022",
    customerName: "ram",
    rating: 3,
    comment: "amazing",
    subParameters: [],
    imageSRC: "https://s3.ap-south-1.amazonaws.com/files.myglamm.net/myglamm-alpha/original/1_6.jpg",
    likes: 10,
    country: "mgp",
    action: "",
  },
  {
    productName: "MyGlamm K.Play ",
    date: "23 Dec 2022",
    customerName: "ram",
    rating: 5,
    comment: "amazing",
    subParameters: [],
    imageSRC: "https://s3.ap-south-1.amazonaws.com/files.myglamm.net/myglamm-alpha/original/1_6.jpg",
    likes: 10,
    country: "mgp",
    action: "",
  },
];

const RatingCard = ({ rating }: any) => {
  return (
    <Switch
      fallback={
        <span class=" bg-greenDark2 text-white  text-sm p-1 rounded flex flex-row  gap-1 justify-center ">
          <p>{rating}</p>
          <CommonIcon icon="material-symbols:star" height={16} width={16} />
        </span>
      }
    >
      <Match when={rating === 1}>
        <span class=" bg-redDark text-white  text-sm p-1 rounded flex flex-row  gap-1 justify-center ">
          <p>{rating}</p>
          <CommonIcon icon="material-symbols:star" height={16} width={16} />
        </span>
      </Match>
      <Match when={rating === 2}>
        <span class=" bg-orangeDark text-white  text-sm p-1 rounded flex flex-row  gap-1 justify-center ">
          <p>{rating}</p>
          <CommonIcon icon="material-symbols:star" height={16} width={16} />
        </span>
      </Match>
      <Match when={rating === 3}>
        <span class=" bg-yellowDark text-white  text-sm p-1 rounded flex flex-row  gap-1 justify-center ">
          <p>{rating}</p>
          <CommonIcon icon="material-symbols:star" height={16} width={16} />
        </span>
      </Match>
    </Switch>
  );
};

const SubRatingCard = ({ subParameters }: any) => {
  return (
    <For each={subParameters}>
      {({ label, rating }: { label: string; rating: number }) => (
        <Switch
          fallback={
            <span class=" w-min bg-greenLight1 text-greenDark text-xs p-1 mb-1 rounded flex flex-row gap-1 justify-start capitalize ">
              <p>{rating}</p>
              <CommonIcon icon="material-symbols:star" height={13} width={13} />
              <p>{label}</p>
            </span>
          }
        >
          <Match when={rating === 1}>
            <span class=" w-min bg-redLight text-redDark text-xs p-1 mb-1 rounded flex flex-row gap-1 justify-start capitalize ">
              <p>{rating}</p>
              <CommonIcon icon="material-symbols:star" height={13} width={13} />
              <p>{label}</p>
            </span>
          </Match>
          <Match when={rating === 2}>
            <span class=" w-min bg-orangeLight text-orangeDark text-xs p-1 mb-1 rounded flex flex-row gap-1 justify-start capitalize ">
              <p>{rating}</p>
              <CommonIcon icon="material-symbols:star" height={13} width={13} />
              <p>{label}</p>
            </span>
          </Match>
          <Match when={rating === 3}>
            <span class=" w-min bg-yellowLight text-yellowDark text-xs p-1 mb-1 rounded flex flex-row gap-1 justify-start capitalize ">
              <p>{rating}</p>
              <CommonIcon icon="material-symbols:star" height={13} width={13} />
              <p>{label}</p>
            </span>
          </Match>
          <Match when={rating === 4}>
            <span class=" w-min bg-greenLight1 text-greenDark2 text-xs p-1 mb-1 rounded flex flex-row gap-1 justify-start capitalize ">
              <p>{rating}</p>
              <CommonIcon icon="material-symbols:star" height={13} width={13} />
              <p>{label}</p>
            </span>
          </Match>
        </Switch>
      )}
    </For>
  );
};

const ReviewRow = ({
  productName,
  date,
  customerName,
  rating,
  comment,
  subParameters,
  imageSRC,
  likes,
  country,
  action,
}: ReviewRowProps) => {
  const [togglePopup, setTogglePopup] = createSignal(false);
  return (
    <tr class="h-[80px] bg-white border-b">
      <td class="text-sm text-gray-900 font-normal px-6 py-4 ">
        <div class="flex justify-start text-left">{productName}</div>
      </td>
      <td class="text-sm text-gray-900 font-normal px-6 py-4 whitespace-nowrap">{date}</td>
      <td class="text-sm text-primary font-light px-6 py-4 whitespace-nowrap capitalize">{customerName}</td>
      <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
        <RatingCard rating={rating} />
      </td>
      <td class="px-6 py-4">
        <div>
          <p class="text-left text-ellipsis overflow-hidden">
            {comment.slice(0, 100)}
            {comment.length >= 100 && (
              <span
                class="text-primary cursor-pointer capitalize"
                onclick={() => {
                  setTogglePopup(!togglePopup());
                }}
              >
                ... read more
              </span>
            )}
          </p>
          <PopupModal show={togglePopup()} onRequestClose={() => setTogglePopup(!togglePopup())}>
            <ReviewPopup
              productName={productName}
              customerName={customerName}
              productRating={rating}
              date={date}
              country={country}
              comment={comment}
              subParameters={subParameters}
              imageSRC={imageSRC}
              onRequestClose={() => setTogglePopup(!togglePopup())}
            />
          </PopupModal>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <SubRatingCard subParameters={subParameters} />
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <img class="h-16 w-16" alt="image" src={imageSRC}></img>
      </td>
      <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{likes}</td>
      <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{country}</td>
      <td class="px-6 py-4">
        <div class="flex justify-center align-middle items-center gap-6 text-primary">
          <CommonIcon icon="iconoir:thumbs-up" />
          <CommonIcon icon="iconoir:thumbs-up" rotate="180deg" />
        </div>
      </td>
    </tr>
  );
};

const CustomerReviewTable = () => {
  const coloumnTitle = [
    { label: "Product", id: 1 },
    { label: "Date", id: 2 },
    { label: "Customer Name", id: 3 },
    { label: "Rating", id: 4 },
    { label: "Comment", id: 5 },
    { label: "Sub Parameters", id: 6 },
    { label: "Images", id: 7 },
    { label: "Likes", id: 8 },
    { label: "Country", id: 9 },
    { label: "Action", id: 10 },
  ];

  const [sortID, setSortID] = createSignal();

  const handleTitleClick = (id: number) => {
    setSortID(id);
    const { label } = coloumnTitle.filter(item => item.id === id)[0];
    alert(`Will sort data based on "${label}"`);
  };

  return (
    <div class="flex flex-col bg-white">
      <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-4 inline-block min-w-full sm:px-6 lg:px-8">
          <div class="overflow-hidden">
            <table class="w-full text-center">
              <thead class="h-12 border-y border-[#DEE2E6]">
                <tr>
                  <For each={coloumnTitle}>
                    {item => (
                      <th scope="col" class="text-sm font-medium  text-[#858A93] px-6 py-4 whitespace-nowrap ">
                        <div
                          class="flex justify-start align-middle items-center gap-2 cursor-pointer"
                          onclick={() => handleTitleClick(item.id)}
                        >
                          {item.label}
                          {item.id === sortID() && (
                            <span class="text-primary">
                              <CommonIcon icon="material-symbols:arrow-upward-rounded" height={16} width={16} />
                            </span>
                          )}
                        </div>
                      </th>
                    )}
                  </For>
                </tr>
              </thead>
              <tbody>
                <For each={data}>
                  {(item, i) => (
                    <ReviewRow
                      productName={item.productName}
                      date={item.date}
                      customerName={item.customerName}
                      rating={item.rating}
                      comment={item.comment}
                      subParameters={item.subParameters}
                      imageSRC={item.imageSRC}
                      likes={item.likes}
                      country={item.country}
                      action={item.action}
                    />
                  )}
                </For>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export { CustomerReviewTable, RatingCard, SubRatingCard };
