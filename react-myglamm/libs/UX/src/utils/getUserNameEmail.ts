import { User } from "@typesLib/Consumer";
import { anonUserCheck } from "./anonUserCheck";

export function getUserNameEmail(user: User, email?: boolean) {
  if (user) {
    if (anonUserCheck(user)) {
      if (email) {
        return "anonymous@gmail.com";
      }
      return "Anonymous";
    }

    if (email) {
      return user.email;
    }

    return `${user.firstName} ${user.lastName || ""}`;
  }

  return "";
}
