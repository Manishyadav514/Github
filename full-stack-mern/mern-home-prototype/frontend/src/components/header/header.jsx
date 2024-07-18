import { UserButton, useUser } from "@clerk/clerk-react";
import myimg from "./../../assets/me (2).jpg";
import s from "./header.module.css";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function header() {
  const { user, dispatch } = useAuthContext();
  const userData = useUser();
  const navigate = useNavigate();

  const Logout = () => {
    // remove user from storage
    localStorage.removeItem("user");

    // dispatch logout action
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  if (!userData.isLoaded) {
    return (
      <div className={s.header}>
        <div className={s.header_text}>
          <h3>Loading</h3>
        </div>

        <div className={s.ubutton}>
          <UserButton
            appearance={{
              elements: {
                userButtonPopoverCard: "ubutton",
                userPreviewMainIdentifier: "ubuttonf",
                userPreviewSecondaryIdentifier: "ubuttonf",
                userPreviewAvatarBox: "ubuttonimg",
                userButtonPopoverActionButtonText: "ubuttonf",
                userButtonPopoverFooter: "ubuttonf",
              },
            }}
          />
        </div>
      </div>
    );
  }

  const name = userData.user.fullName;

  return (
    <div className={s.header}>
      <div className={s.header_text}>
        <h1>Hello, {user.name}!</h1>
        <p className="text-lg font-semibold">
          Your devices are under your control.
        </p>
      </div>

      <button
        type="button"
        onClick={Logout}
        class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 
      font-medium rounded-lg text-[0.7rem] px-2 py-0.5 me-2 mx-3 dark:bg-gray-800
       dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
      >
        Logout
      </button>

      <div className={s.ubutton}>
        <UserButton
          appearance={{
            elements: {
              userButtonPopoverCard: "ubutton",
              userPreviewMainIdentifier: "ubuttonf",
              userPreviewSecondaryIdentifier: "ubuttonf",
              userPreviewAvatarBox: "ubuttonimg",
              userButtonPopoverActionButtonText: "ubuttonf",
              userButtonPopoverFooter: "ubuttonf",
              userPreview: "gap-x-[0.5rem]",
              userPreviewMainIdentifier: "p-0 text-xs",
              userPreviewSecondaryIdentifier: "p-0 text-[0.6rem]",
              userButtonPopoverActionButton: "justify-around",
              userButtonPopoverActionButton__signOut: "mr-1",
              // userPreview__userButton:"ml-5"
              // userPreviewAvatarContainer:"ml-2",
            },
          }}
        />
      </div>
    </div>
  );
}

export default header;
