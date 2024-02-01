import React, { useEffect, useState } from "react";
//@ts-ignore
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import MysteryRewardAPI from "@libAPI/apis/MysteryRewardApi";
import LoaderIcon from "../../../public/svg/loaderMR.svg";
import { showError } from "@libUtils/showToaster";
import ArrowDown from "./ArrowDown";
import { mysteryRewardDragComplete } from "@libAnalytics/MysteryRewards.Analytics";
import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";
import io from "socket.io-client";
import { useRouter } from "next/router";

interface DargAndDropProps {
  setShowDragAndDrop: (value: any) => void;
  brandLogo: string;
  setCouponData: (value: any) => void;
  rewardId: string;
  logoSkeleton: string;
  backgroundColor: string;
  vendorCode: string;
  title: string;
}

const DragAndDropLogo = ({
  setShowDragAndDrop,
  brandLogo,
  setCouponData,
  rewardId,
  logoSkeleton,
  backgroundColor,
  vendorCode,
  title,
}: DargAndDropProps) => {
  const [loader, setLoader] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const router = useRouter();
  const socketConnection = () => {
    const socketToken = checkUserLoginStatus()?.xtoken;

    if (socketToken) {
      const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}?token=${socketToken}`, {
        transports: ["websocket"],
      });
      setLoader(true);
      socket.on("connect", () => {
        try {
          const mysteryRewardApi = new MysteryRewardAPI();
          mysteryRewardApi.claimMysteryRewards(rewardId, vendorCode).catch(error => {
            setLoader(false);
            console.error(error);
            socket.close();
            if (error.response) {
              showError(error.response?.data?.message, 3000);
            } else {
              showError(error.message);
            }
          });
        } catch (error) {
          console.error(error);
          setLoader(false);
          socket.close();
        }
      });

      socket.on("message", (socketResponse: any) => {
        if (socketResponse.status === "Success") {
          setCouponData(socketResponse.data);
          setShowDragAndDrop(true);
          mysteryRewardDragComplete(title);
        } else if (socketResponse.status === "Error") {
          showError(socketResponse.error, 3000);
          console.error(`Socket Error`, socketResponse);
          setLoader(false);
        }
        socket.close();
      });

      socket.on("error", (socketResponse: any) => {
        showError("Something went Wrong....");
        socket.close();
      });
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!destination || destination.droppableId === source.droppableId) {
      return;
    }
    if (destination.droppableId === "Drop") {
      if (checkUserLoginStatus()) {
        socketConnection();
      } else {
        showError("Please Login first..", 2000);
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
    }
  };

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  if (loader) {
    return (
      <div className="flex flex-col items-center justify-center h-full flex-grow">
        <LoaderIcon stroke={backgroundColor} className="w-16 h-auto" />
      </div>
    );
  }
  return (
    <>
      <p className="text-sm text-center leading-6 font-bold my-5 text-black drag-drop-line">
        Drag the mystery reward logo to outline
      </p>
      <section className="flex flex-col items-center justify-between h-full flex-grow pt-4 pb-7 drag-drop">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="Drag">
            {(provided: any) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <Draggable draggableId="brandLogo" index={0}>
                  {(provided: any) => (
                    <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                      <img
                        className={`${vendorCode === "stb" ? "h-14" : "h-12"} moveUpDown object-contain max-w-[200px] drag`}
                        alt="brand logo"
                        src={brandLogo}
                      />
                    </div>
                  )}
                </Draggable>
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <span>
            <ArrowDown color={backgroundColor} className="mx-auto arrow blinkArrow " />
            <ArrowDown color={backgroundColor} className="mx-auto arrow blinkArrow1 -mt-3 block" />
            <ArrowDown color={backgroundColor} className="mx-auto arrow blinkArrow2 -mt-3 block" />
          </span>

          <Droppable droppableId="Drop">
            {(provided: any) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <img
                  className={`${vendorCode === "stb" ? "h-14" : "h-12"} object-contain max-w-[200px] drop`}
                  alt="brand logo"
                  src={logoSkeleton}
                />
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </section>
    </>
  );
};

export default DragAndDropLogo;
