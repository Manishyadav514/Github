import { MEMBER_TYPE_COLOR } from "@/constants/member.constant";
import { MemberI } from "@/models/member.model";
import { Link } from "@solidjs/router";
import { CommonIcon } from "../CommonIcon";

const MEMBER_COLORS = {
  ambassador: {
    textColor: `text-greenDark2`,
    backgroundColor: "bg-greenBackGround"
  },
  "beauty guide": {
    textColor:  `text-[${MEMBER_TYPE_COLOR["beauty guide"]}]`,
    backgroundColor: "bg-pink-100"
  },
  retailer: {
    textColor:  `text-[${MEMBER_TYPE_COLOR.retailer}]`,
    backgroundColor: "bg-blue-100"
  },
  influencer: {
    textColor:  `text-[${MEMBER_TYPE_COLOR.influencer}]`,
    backgroundColor: "bg-yellow-100"
  }
};

interface propType {
  memberData: MemberI;
  glammPoints: any;
}

function MemberCard(props: propType) {
  const typeOfMember: any = props?.memberData?.memberType?.typeName;
  // @ts-ignore
  const memberColor: any = MEMBER_COLORS[typeOfMember];
  console.log(memberColor);
  
  const handleStatus = (e: any) => {
    e.preventDefault, alert(`survey-status to ${e.target.value}`);
  };
  return (
    <div class="border  rounded-lg w-[350px]">
     <Link  href={`/members/view/${props?.memberData?.id}`}>
      <div class="p-4 border-b">
        <div class="flex space-x-4 items-center">
          <div class="text-base font-semibold capitalize">
            {props?.memberData?.firstName} {props?.memberData?.lastName}
          </div>
          {props?.memberData?.memberType?.typeName && (
            <span class={` px-2 py-1 capitalize rounded-sm ${memberColor?.backgroundColor} ${memberColor?.textColor}`}>
              {typeOfMember}
            </span>
          )}
        </div>
        <div class="text-gray-600 ">{props?.memberData?.location?.countryName}</div>
        <div class="text-gray-600 flex flex-col space-y-1 text-bold">
          <div class="flex justify-between">
            <div class="text-bold">Registration Date</div>
            <div> {props?.memberData?.createdAt} </div>
          </div>
            <div class="flex justify-between">
              <div> glammPOINTS </div>
              <div>{props?.glammPoints?.[props?.memberData?.id] ?? '-'}</div>
            </div>
          <div class="flex justify-between">
            <div> Personal Sales </div>
            <div> {props.memberData?.commission?.summary?.personalSales || '-'} </div>
          </div>
          <div class="flex justify-between">
            <div> Direct Sales </div>
            <div>{props.memberData?.commission?.summary?.directSales || '-'} </div>
          </div>
        </div>
      </div>
      </Link>
      <div class="flex justify-between items-center px-4 py-3 text-sm">
        <select
          id="couponStatus"
          class="block w-24 px-2  bg-white text-base text-gray-900"
          onChange={e => {
            handleStatus(e);
          }}
        >
          <option value="active" selected class={`${"bg-secondary"} w-8 hover:bg-slate-400 text-primary cursor-pointer`}>
            Active
          </option>
          <option value="inactive">Inactive</option>
        </select>
        <div class="flex space-x-2 cursor-pointer text-primary">
          <CommonIcon rotate="0" icon="lucide:party-popper" />
          <CommonIcon rotate="0" icon="material-symbols:delete-outline"  click={(e:any)=> console.log(e,'clicked')}/>
        </div>
      </div>
    </div>
  );
}

export { MemberCard };
