import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  Button,
  Alert,
} from "react-native";
import { TextInput } from "react-native-paper";
// import auth from "@react-native-firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseAuth";

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const image = {
    // uri: "https://cdn.pixabay.com/photo/2014/01/21/16/01/backdrop-249158_960_720.jpg",
    uri: "https://cdn.pixabay.com/photo/2021/04/23/17/18/triangles-6202188_960_720.jpg",
    // uri: "https://img.freepik.com/free-psd/3d-geometric-black-scene-with-cube-podium-editable-light-product-placement_167960-36.jpg?w=360&t=st=1664905269~exp=1664905869~hmac=99e221f86b892d2596f5847d91555423bfa652685739d8bbad58be7431a30b0b",
  };
  if (loading) {
    return <ActivityIndicator size="large" color="#00ff00" />;
  }
  const userLogin = async () => {
    if (!email || !password) {
      alert("please add all the field");
      return;
    }
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // console.log(user);
        // setMessage("Signed in Successfully!");
        navigation.navigate("HomeScreen");
        setLoading(false);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setLoading(false);
        setErrorMessage(errorCode.split("/")[1]);
      });
  };
  
  return (
    <ImageBackground source={image} resizeMode="cover" style={styles.image}>
      <KeyboardAvoidingView behavior="position">
        <View style={styles.box1}>
          <Text style={styles.text}>Romix</Text>
          <Image
            style={styles.img}
            source={require("../assets/love-icon.png")}
          />
        </View>
        <View style={styles.box2}>
          <TextInput
            label="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            // type="flat"
            mode="outlined"
          />
          <TextInput
            label="password"
            mode="outlined"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
          />

          {!email || !password ? (
            <Button
              title="Sign In"
              onPress={() => Alert.alert("Simple Button pressed")}
              disabled
            />
          ) : (
            <Button
              title="Sign In"
              color="#10FFB4"
              // onPress={() => Alert.alert("Simple Button pressed")}
              onPress={() => userLogin()}
            />
          )}

          <TouchableOpacity onPress={() => navigation.navigate("signup")}>
            <Text style={{ textAlign: "center", color: "white" }}>
              Don't have an account ?
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={{ textAlign: "center", color: "red" }}>
            {errorMessage}
          </Text>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  buttonText: {
    borderWidth: 1,
    padding: 25,
    color: "black",
  },
  button: {
    color: "black",
  },
  text: {
    color: "white",
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
