import React, { Component, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  FlatList,
  Button,
} from "react-native";

export default class Contacts extends Component<{}, { value: any }> {

  constructor({ props }: any) {
    super(props);
    this.state = {
      value: [
        {
          id: 1,
          name: "Mark Doe",
          status: "active",
          onDevice: "Web",
          image: "https://bootdey.com/img/Content/avatar/avatar7.png",
        },
        {
          id: 2,
          name: "Clark Man",
          status: "active",
          onDevice: "mobile",
          image: "https://bootdey.com/img/Content/avatar/avatar6.png",
        },
        {
          id: 3,
          name: "Jaden Boor",
          status: "active",
          onDevice: "mobile",
          image: "https://bootdey.com/img/Content/avatar/avatar5.png",
        },
        {
          id: 4,
          name: "Srick Tree",
          status: "active",
          onDevice: "Web",
          image: "https://bootdey.com/img/Content/avatar/avatar4.png",
        },
        {
          id: 5,
          name: "Erick Doe",
          status: "active",
          onDevice: "mobile",
          image: "https://bootdey.com/img/Content/avatar/avatar3.png",
        },
        {
          id: 6,
          name: "Francis Doe",
          status: "active",
          onDevice: "mobile",
          image: "https://bootdey.com/img/Content/avatar/avatar2.png",
        },
        {
          id: 8,
          name: "Matilde Doe",
          status: "active",
          onDevice: "mobile",
          image: "https://bootdey.com/img/Content/avatar/avatar1.png",
        },
        {
          id: 9,
          name: "John Doe",
          status: "active",
          onDevice: "Web",
          image: "https://bootdey.com/img/Content/avatar/avatar4.png",
        },
        {
          id: 10,
          name: "Fermod Doe",
          status: "active",
          onDevice: "mobile",
          image: "https://bootdey.com/img/Content/avatar/avatar7.png",
        },
        {
          id: 11,
          name: "Danny Doe",
          status: "active",
          onDevice: "mobile",
          image: "https://bootdey.com/img/Content/avatar/avatar1.png",
        },
      ],
    };
  }

  renderItem = ({ item }: any) => {
    return (
      <TouchableOpacity>
        <View style={styles.row}>
          <Image source={{ uri: item.image }} style={styles.pic} />
          <View>
            <View style={styles.nameContainer}>
              <Text
                style={styles.nameTxt}
                numberOfLines={1}
                ellipsizeMode="tail"
              // onLongPress={console.log(this)}
              >
                {item.name}
              </Text>
              <Button
                onPress={() => {
                  console.log('You tapped the button!');
                }}
                title="Press Me"
              />


              <TouchableOpacity style={styles.followButton}>
                <Text style={styles.followButtonText}>Following</Text>
              </TouchableOpacity>
              <Text style={styles.mblTxt}>{item.onDevice}</Text>
            </View>
            <View style={styles.msgContainer}>
              <Text style={styles.msgTxt}>{item.status}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          extraData={this.state}
          data={this.state?.value}
          keyExtractor={(item) => {
            return item.id;
          }}
          renderItem={this.renderItem}
        // onPres={console.log(this)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#DCDCDC",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    padding: 10,
  },
  pic: {
    borderRadius: 30,
    width: 60,
    height: 60,
  },
  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 280,
  },
  nameTxt: {
    marginLeft: 15,
    fontWeight: "600",
    color: "#222",
    fontSize: 18,
    width: 170,
  },
  mblTxt: {
    fontWeight: "200",
    color: "#777",
    fontSize: 13,
  },
  msgContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  msgTxt: {
    fontWeight: "400",
    color: "#008B8B",
    fontSize: 12,
    marginLeft: 15,
  },
  followButton: {
    height: 30,
    width: 80,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: "#00BFFF",
  },
  followButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
  },
});
