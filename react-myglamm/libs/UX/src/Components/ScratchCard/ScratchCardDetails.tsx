import React from "react";
import useTranslation from "@libHooks/useTranslation";

function ScratchCardDetail({ data, setIsRotated, widgets }: any) {
  const { t } = useTranslation();

  return (
    <div className="back py-6 mx-auto  px-4 rounded-3xl  relative bg-white">
      <style>
        {`
    
      .scratchCard p { 
          font-size: 15px;
         
          margin-bottom: 12px;
      }
     
      .scratchCard h2,h3 { 
          font-size: 16px;
          margin-top: 1em;
          margin-bottom: 1em;
      }
      
     
    .scratchCard ul li,
     ol li {
       
          list-style-type: decimal;
            margin: 0;
            padding: 0;
            margin-bottom:8px;
            font-size:14px;
      }
      .scratchCard ul ,
     ol  {
       
         margin-left:32px;
      }
     
     
    `}
      </style>

      {widgets?.map((item: any, index: number) => {
        const metaData = item?.meta?.widgetMeta ? JSON.parse(item?.meta?.widgetMeta) : "";

        if (metaData.type === data.value?.type) {
          return (
            <div key={index} className="text-sm w-full p-3 h-[330px] overflow-scroll scratchCard">
              <div
                dangerouslySetInnerHTML={{
                  __html: item.commonDetails?.description,
                }}
              />
            </div>
          );
        }
      })}

      <button
        type="button"
        onClick={() => setIsRotated(false)}
        className="text-white mx-auto flex mb-2 justify-center mt-6 items-center uppercase bg-black font-semibold py-3.5 text-xs w-3/4 rounded-md relative"
      >
        {t("closeDetails") || "CLOSE DETAILS"}
      </button>
    </div>
  );
}

export default ScratchCardDetail;
