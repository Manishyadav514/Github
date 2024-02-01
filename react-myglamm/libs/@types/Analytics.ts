export type EVENT_TYPES =
  | "LOGIN_START"
  | "ENTER_OTP"
  | "WEB_OTP"
  | "RESEND_OTP"
  | "SOCIAL_CLICK"
  | "SOCIAL_SIGNUP_START"
  | "LOGIN_SUCCESS"
  | "LOGIN_FAILURE"
  | "LOGIN_SOCIAL_SUCCESS"
  | "LOGIN_SOCIAL_FAILURE"
  | "SIGNUP_START"
  | "SIGNUP_SUCCESS"
  | "SIGNUP_FAILURE"
  | "SIGNUP_SOCIAL_SUCCESS"
  | "SIGNUP_SOCIAL_FAILURE";

export type EventState = "success" | "failure";

export type SimplifiedState = EventState | "registration success" | "registration failure";
