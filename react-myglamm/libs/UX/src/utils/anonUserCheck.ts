import { User } from "@typesLib/Consumer";

export function anonUserCheck(profile?: User | null) {
  if (profile && profile.firstName?.toLowerCase().startsWith("anon_")) {
    return true;
  }

  return false;
}
