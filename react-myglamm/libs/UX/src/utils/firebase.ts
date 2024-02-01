// @ts-nocheck

import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

export function getFirebaseConfig() {
  var firebaseConfig = {
    apiKey: GBC_ENV.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: GBC_ENV.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: GBC_ENV.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  };
  if (!firebase?.apps?.length) {
    firebase.initializeApp(firebaseConfig);
  }
  return firebase;
}

export function fireBaseSignOut() {
  if (GBC_ENV.NEXT_PUBLIC_FIREBASE_API_KEY) {
    const config = getFirebaseConfig();
    const auth = config.auth();
    if (auth.currentUser) {
      auth.signOut();
    }
  }
}
