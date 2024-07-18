import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Button,
} from "react-native";
import { handleSignOut } from "../firebase/firebaseAuth";
import ProfileContainer from "../components/ProfileContainer";

export default function HomeScreen() {
  const newFnunction = () => {
    console.log("hey");
  };
  return (
    <>
      <ProfileContainer onPress={() => newFnunction()} />
      <Button title="Sign Out" color="black" onPress={() => handleSignOut()} />
    </>
  );
}

const styles = StyleSheet.create({});
