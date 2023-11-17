import toast from "solid-toast";

export const showError = (errorMsg: string) => {
  toast.error(errorMsg, {
    style: {
      padding: "20px 18px",
      "font-size": "18px",
      "line-height": "26px",
      "font-family": "Rubik', sans-serif",
      "white-space": "nowrap",
    },
    duration: 3000,
    position: "bottom-left",
  });
};

export const showSuccess = (message: string) => {
  toast.success(message, {
    style: {
      padding: "20px 18px",
      "font-size": "18px",
      "line-height": "26px",
      "font-family": "Rubik', sans-serif",
      "white-space": "nowrap",
    },
    duration: 3000,
    position: "bottom-left",
  });
};
