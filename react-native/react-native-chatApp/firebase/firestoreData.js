import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "./firebaseAuth";

// interface userDataInterfce {
//   firstName: "string",
//   secondName?: "string",
//   city?: "string",
// };
export const setUserDate = () => {
  const cityRef = db.collection("cities").doc("SF");
  const doc = await cityRef.get();
  if (!doc.exists) {
    console.log("No such document!");
  } else {
    console.log("Document data:", doc.data());
  }
};
