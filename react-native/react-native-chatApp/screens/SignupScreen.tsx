import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  StyleSheet,
  Button,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { TextInput,  } from "react-native-paper";
// import { launchImageLibrary } from "react-native-image-picker";
// import storage from "@react-native-firebase/storage";
// import auth from "@react-native-firebase/auth";
// import firestore from "@react-native-firebase/firestore";
import { auth, handleSignUp } from "../firebase/firebaseAuth";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function SignupScreen({ navigation }: any) {
  // const emailRefSignIn = useRef();
  // const passwordRefSignIn = useRef();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("...");
  const [showNext, setShowNext] = useState(false);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const image1 = {
    // uri: "https://images.unsplash.com/photo-1537420327992-d6e192287183?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80",
    uri: "https://images.unsplash.com/photo-1544991185-13fe5d113fe3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    // uri: "https://cdn.pixabay.com/photo/2021/04/23/17/18/triangles-6202188_960_720.jpg",
    // uri: "https://img.freepik.com/free-psd/3d-geometric-black-scene-with-cube-podium-editable-light-product-placement_167960-36.jpg?w=360&t=st=1664905269~exp=1664905869~hmac=99e221f86b892d2596f5847d91555423bfa652685739d8bbad58be7431a30b0b",
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#00ff00" />;
  }

  function alert(argument: string) {
    throw new Error(argument);
  }

  const userSignUp =()=> {
    setLoading(true);
    // let response = handleSignUp(email, password);
    // setMessage(response);
    createUserWithEmailAndPassword(auth, email, password)
      .then(function () {
        setLoading(false);
        setMessage("User Created!");
        setShowNext(true);
        // navigation.navigate("signin");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        var errorCode = error?.code;
        var errorMessage = error?.message;
        console.log(errorCode);
        console.log(errorMessage);
        setMessage(errorCode?.split("/")[1]);
      });
  };

  // const pickImageAndUpload = () => {const [message, setMessage] = useState("Response");
  //   launchImageLibrary({ quality: 0.5 }, (fileobj) => {
  //     const uploadTask = storage()
  //       .ref()
  //       .child(`/userprofile/${Date.now()}`)
  //       .putFile(fileobj.uri);
  //     uploadTask.on(
  //       "state_changed",
  //       (snapshot) => {
  //         var progress =
  //           (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //         if (progress == 100) alert("image uploaded");
  //       },
  //       (error) => {
  //         alert("error uploading image");
  //       },
  //       () => {
  //         uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
  //           setImage(downloadURL);
  //         });
  //       }
  //     );
  //   });
  // };

  return (
    <ImageBackground source={image1} resizeMode="cover" style={styles.image}>
      <KeyboardAvoidingView behavior="position">
        {!showNext ? (
          <>
            <View style={styles.box1}>
              <Text style={styles.text}>Romix</Text>
              <Image
                style={styles.img}
                source={require("../assets/love-icon.png")}
              />
            </View>
            <View style={styles.box2}>
              <TextInput
                label="Name"
                value={name}
                onChangeText={(text) => setName(text)}
                // ref={emailRefSignIn}
                mode="outlined"
                style={styles.input}
              />
              <TextInput
                label="Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
                // ref={passwordRefSignIn}
                mode="outlined"
              />
              <TextInput
                label="password"
                mode="outlined"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry
              />
              <Text style={{ color: "red" }}></Text>

              {!email || !password || !name ? (
            <Button
              title="Register"
              disabled
            />
          ) : (
            <Button
              title="Register"
              color="#10FFB4"
              onPress={() => userSignUp()}
            />
          )}

              {/* <Button
                mode="contained"
                onPress={() => userSignUp()}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Signup</Text>
              </Button> */}
            </View>
            <View>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={{ textAlign: "center", color: "white" }}>
                  Already have an account ?
                </Text>
              </TouchableOpacity>
            </View>
            <View>
                <Text style={{ textAlign: "center", color: "red" }}>
                  {message}
                </Text>
            </View>
          </>
        ) : (
          <></>
        )}

      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {},
  buttonText: {
    borderWidth: 1,
    padding: 25,
    color: "black",
  },
  button: {
    color: "red",
    backgroundColor: "#10FFB4",
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },

  text: {
    color: "black",
    fontSize: 42,
    lineHeight: 84,
    fontWeight: "bold",
    textAlign: "center",
    // backgroundColor: "#000000c0",
  },
  img: {
    width: 200,
    height: 200,
    borderRadius: 50,
  },
  box1: {
    alignItems: "center",
  },
  box2: {
    paddingHorizontal: 40,
    justifyContent: "space-evenly",
    height: "50%",
  },
});
