import React, { useEffect, useState } from "react";

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
} from "react-native";
// import 'react-native-gesture-handler';
import SignupScreen from "./screens/SignupScreen";
import LoginScreen from "./screens/LoginScreen";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
// import auth from '@react-native-firebase/auth'
import HomeScreen from "./screens/HomeScreen";
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import ChatScreen from "./screens/ChatScreen";
// import firestore from '@react-native-firebase/firestore'
import { auth } from "./firebase/firebaseAuth";
import AccountScreen from "./screens/AccountScreen";
import { onAuthStateChanged } from "firebase/auth";
const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "black",
  },
};

const Stack = createStackNavigator();

const Navigation = () => {
  const [user, setUser] = useState("");
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user);
      // console.log("user", user);
      const uid = user.uid;
    } else {
      setUser("");
    }
  });

  // const handleSignOut = useEffect(() => {
  // onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //     firestore().collection("users").doc(user.uid).update({
  //       status: "online",
  //     });
  //     setuser(user);
  //   } else setuser("");
  // });
  // return () => {
  //   unregister();
  // };
  // }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTintColor: "green",
        }}
      >
        {!user ? (
          <>
            <Stack.Screen
              name="login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="signup"
              component={SignupScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="home"
              component={HomeScreen}
              options={{ headerShown: true }}
            />
            {/* <Stack.Screen
              name="chat"
              options={({ route }) => ({
                title: (
                  <View>
                    <Text>{route.params.name}</Text>
                    <Text>{route.params.status}</Text>
                  </View>
                ),
              })}
            >
              {(props) => <ChatScreen {...props} user={user} />}
            </Stack.Screen> */}
            {/* <Stack.Screen name="account">
              {(props) => <AccountScreen {...props} user={user} />}
            </Stack.Screen> */}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <>
      <PaperProvider theme={theme}>
        <StatusBar barStyle="light-content" backgroundColor="black" />
        <View style={styles.container}>
          <Navigation />
        </View>
      </PaperProvider>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});

export default App;
