import StatusHandler from "./StatusHandler.jsx";

interface surveyProps {
  title: string;
  createdOn?: string;
  language?: string;
}

const SurveyCard = ({ title, createdOn, language }: surveyProps) => {
  const deleteFunction = (e: any) => {
    e.preventDefault, alert("You clicked on survey-delete!");
  };
  const editFunction = (e: any) => {
    e.preventDefault, alert("You clicked on survey-edit!");
  };
  const handleStatus = (e: any) => {
    e.preventDefault, alert(`survey-status to ${e.target.value}`);
  };

  return (
    <div class=" w-[350px] rounded-[3px] border border-[#e8e9ec] flex flex-col ">
      <div class="p-4 h-[175px] ">
        <div class=" mb-3 text-[16px] font-semibold capitalize">{title}</div>
        <div class=" mb-1">
          <span class="bg-[var(--primary-light-color)] text-primary capitalize font-normal text-[14px] p-2">
            responses
          </span>
        </div>
        <div class="flex flex-col justify-between pt-1 pb-4 text-left tracking-wide">
          <p class="text-[13px] text-gray-700 ">Created Date</p>
          <div class="text-[15px]  font-normal leading-6 text-[#212529] mb-1">
            {createdOn}
          </div>
          <p class="text-[13px] text-gray-700 uppercase ">
            {language || "ENG"}
          </p>
        </div>
      </div>
      <StatusHandler
        deleteFunction={deleteFunction}
        editFunction={editFunction}
        handleStatus={handleStatus}
        currentStatus={true}
      />
    </div>
  );
};

export { SurveyCard };
