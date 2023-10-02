import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useState, useLayoutEffect, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  userIcon,
  ChevronDownIcon,
  SearchIcon,
  AdjustmentsVerticalIcon,
  UserIcon,
  MagnifyingGlassIcon,
} from "react-native-heroicons/outline";

import Categories from "../components/Categories";
import FeaturedRow from "../components/FeaturedRow";
import sanityClient from "../sanity";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [featuredCategories, setFeaturedCategories] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
 
  useEffect(() => {
    sanityClient
      .fetch(
        `
  *[_type == 'featured'] {
      ...,
      restaurants[]->{
        ...,
        dishes[]->
          }
    }`
    )
      .then((data) => {
        setFeaturedCategories(data);
      });
  }, []);

  return (
    <SafeAreaView className="bg-white pt-5">
      {/* Header */}
      <View className="flex-row items-center pb-3 mx-4 mt-3 space-x-2">
        <Image
          source={{
            uri: "https://links.papareact.com/wru",
          }}
          className="h-7 w-7 bg-gray-300 p-4 rounded-full"
        />
        <View className="flex-1">
          <Text className="font-bold text-gray-400 text-xs">Deliver Now!</Text>
          <Text className="font-bold text-xl items-center">
            Current Location
            <ChevronDownIcon size={20} color="#00CCBB" />
          </Text>
        </View>
        <UserIcon size={35} color="#00CCBB" />
      </View>

      {/* Search */}
      <View className="flex-row items-center space-x-1 pb-2 mx-2 px-2">
        <View className="flex-row space-x-2 flex-1 p-3 bg-gray-200 px-4 items-center">
          <MagnifyingGlassIcon color="gray" size={20} />
          <TextInput
            placeholder="Restaurants and cuisines"
            keyboardType="default"
          />
        </View>

        <AdjustmentsVerticalIcon color="#00CCBB" />
      </View>

      {/* Body  */}
      <ScrollView
        className="bg-gray-100"
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        {/* Categories */}
        <Categories />

        {/* Featured Rows */}

        {featuredCategories?.map(category => (
          <FeaturedRow
          key={category._id}
          id={category._id}
          title={category.name}
          description={category.short_description}
        />
        ))}
        
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
