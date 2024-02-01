import BigBossAPI from "@libAPI/apis/BigBossAPI";
import useTranslation from "@libHooks/useTranslation";
import { ValtioStore } from "@typesLib/ValtioStore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "@libHooks/useValtioSelector";
import GoldMedal from "../../../public/svg/medal-gold.svg";
import SilverMedal from "../../../public/svg/medal-silver.svg";
import BronzeMedal from "../../../public/svg/medal-bronze.svg";
import RightIcon from "../../../public/svg/right-icon.svg";
import CrossIcon from "../../../public/svg/cross-icon.svg";
import { ParseJSON } from "@libUtils/widgetUtils";

interface LeaderObject {
  id: string;
  slug: string;
  position: any;
  isEliminated: any;
  firstName: string;
  lastName: string;
  percentage: any;
  thumbnail: string;
  voteCount: any;
}

const BBLeaderboard = ({ item, icid }: any) => {
  const { t } = useTranslation();
  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);
  const [vote, setVote] = useState("");
  const [leaderBoardData, setLeaderBoardData] = useState([]);
  const voteLine1 = t("voteLine1") || "{{votePercent}}%";
  const voteLine2 = t("voteLine2") || "({{voteCount}} votes)";
  const { title, ui } = ParseJSON(item?.meta?.widgetMeta);
  const icidQuery = icid
    ? `?icid=${icid}_${(title ? title : item?.commonDetails?.title).toLowerCase().replace(/\s/g, "-")}_0`
    : "";

  useEffect(() => {
    const fetchData = async () => {
      const api = new BigBossAPI();
      if (userProfile) {
        const { data: voteData } = await api.isYourVote();
        if (voteData?.data?.count > 0) {
          setVote(Object.keys(voteData?.data?.data)[0]);
        }
      }
      const { data: leaderData } = await api.getContestantsLeaderBoard();
      setLeaderBoardData(leaderData?.data?.data);
    };

    fetchData().catch(e => {});
  }, []);

  return (
    <section
      className="bg-no-repeat flex flex-col justify-between w-[94%] mx-auto rounded-md my-5"
      style={
        ui?.backgroundImage
          ? {
              backgroundSize: "100% 100%",
              backgroundImage: `url(${ui?.backgroundImage})`,
            }
          : {}
      }
      role="banner"
    >
      <div className="mx-4 mb-3">
        <div className="flex flex-row justify-between mt-6 mb-4">
          <p className="text-white font-bold text-xl tracking-wide">{t("contestLeaderboardTitle") || "Leaderboard"}</p>
          <Link href={`/bigg-boss/leaderboard${icidQuery}`} legacyBehavior>
            <button
              type="button"
              style={{ backgroundColor: "#50A2D6" }}
              className="text-white w-20 h-8 shadow-lg rounded-md text-xs	font-bold tracking-wide uppercase"
            >
              {t("viewAll") || "VIEW ALL"}
            </button>
          </Link>
        </div>
        {leaderBoardData
          ?.sort((a: { position: any }, b: { position: any }) => a?.position - b?.position)
          ?.map((leader: LeaderObject, index) => {
            if (index > 2) return null;
            return (
              <Link href={`${leader.slug}${icidQuery}`} key={index} className="w-full" legacyBehavior aria-label="Leader Board">
                <div className="flex flex-row items-center mb-4 mx-1">
                  <div>
                    {leader.position < 4 ? (
                      <div>
                        {leader.position === 1 ? (
                          <GoldMedal className="w-6 h-7" />
                        ) : leader.position === 2 ? (
                          <SilverMedal className="w-6 h-7" />
                        ) : leader.position === 3 ? (
                          <BronzeMedal className="w-6 h-7" />
                        ) : null}
                      </div>
                    ) : (
                      <div className="text-center bg-gray-200 rounded-full">
                        <p className="text-sm text-gray-500 font-bold w-6 h-6 pt-0.5">{index + 1}</p>
                      </div>
                    )}
                  </div>
                  <div
                    className="flex flex-row items-center rounded-lg w-full ml-2"
                    style={
                      leader.isEliminated
                        ? {
                            backgroundColor: "#A6214E",
                            boxShadow: "0px 5px 7px rgba(0, 0, 0, 0.32)",
                            opacity: 0.7,
                          }
                        : { backgroundColor: "#DD4780", boxShadow: "0px 5px 7px rgba(0, 0, 0, 0.32)" }
                    }
                  >
                    <img
                      src={leader.thumbnail}
                      className="mx-2 rounded-full border-2 border-rose-200 h-14 w-14"
                      loading="lazy"
                    />
                    <div className="flex flex-row my-4 mx-2 w-full">
                      <div className="flex flex-col mr-1 w-full">
                        <div className="flex flex-row justify-between">
                          <p className="text-white text-sm font-bold tracking-wide">
                            {leader.firstName + " " + leader.lastName}
                          </p>
                          <span className="flex flex-row flex-wrap justify-end">
                            {voteLine1 && (
                              <p className="text-white text-sm font-bold">
                                {voteLine1.replace("{{votePercent}}", leader.percentage)}
                              </p>
                            )}
                            {voteLine2 && (
                              <p className="text-white text-sm ml-1">{voteLine2.replace("{{voteCount}}", leader.voteCount)}</p>
                            )}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-white-700 mt-2">
                          <div
                            className="h-1.5 rounded-full"
                            style={{ width: `${leader.percentage || 0}%`, backgroundColor: "#50A2D6" }}
                          ></div>
                        </div>
                        <div className="flex flex-row items-center">
                          {vote == leader.id && (
                            <>
                              <RightIcon className="w-4 h-5 mt-1 mr-1" />
                              <p className="text-white text-xs mt-1 mr-2">{t("yourVote") || "Your vote"}</p>
                            </>
                          )}
                          {leader.isEliminated && (
                            <div className="flex flex-row items-center">
                              <>
                                <CrossIcon className="w-4 h-3.5 mt-1 mr-1" />
                                <p className="text-white text-xs mt-1">{t("eliminated") || "Eliminated"}</p>
                              </>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
    </section>
  );
};

export default BBLeaderboard;
