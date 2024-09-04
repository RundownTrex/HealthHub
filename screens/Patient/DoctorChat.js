import { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  Pressable,
  Image,
} from "react-native";
import {
  GiftedChat,
  InputToolbar,
  Composer,
  Send,
  Bubble,
} from "react-native-gifted-chat";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

import colors from "../../utils/colors";
import BackIcon from "../../assets/icons/BackIcon";
import { useBottomSheet } from "../../context/BottomSheetContext";
import LoadingOverlay from "../../components/LoadingOverlay";

const callId = "Fw39EziXX2kB";

export default function DoctorChat({ navigation, route }) {
  const { doctorname, pfp } = route.params;
  const { toggleBottomSheet } = useBottomSheet();

  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const user = auth().currentUser;

  // Fetch messages from Firestore
  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = firestore()
      .collection("chats")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) =>
        setMessages(
          snapshot.docs.map((doc) => ({
            _id: doc.id,
            text: doc.data().text,
            createdAt: doc.data().createdAt.toDate(),
            user: doc.data().user,
          }))
        )
      );

    setIsLoading(false);

    return () => unsubscribe();
  }, []);

  //Toggle bottom tab navigator visibility
  useEffect(() => {
    toggleBottomSheet(true);
    const backAction = () => {
      navigation.pop();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => {
      toggleBottomSheet(false);
      backHandler.remove();
    };
  }, [toggleBottomSheet, navigation]);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );

    const { _id, createdAt, text, user } = messages[0];

    // Add the new message to Firestore
    firestore().collection("chats").add({
      _id,
      text,
      createdAt,
      user,
    });
  }, []);

  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: colors.darkback,
          marginTop: 0,
          marginTop: 8,
          paddingBottom: 5,
          paddingTop: 5,
        }}
        primaryStyle={{ alignItems: "center", justifyContent: "center" }}
      />
    );
  };

  const renderComposer = (props) => {
    return (
      <Composer
        {...props}
        textInputStyle={{
          color: colors.whitetext, // Change text color
          backgroundColor: colors.darkback, // Change background color
          borderRadius: 20,
          paddingLeft: 15,
          paddingRight: 10,
          lineHeight: 30,
          //   borderWidth: 1,
          alignItems: "center",
          backgroundColor: colors.darkgraytext,
          marginBottom: 0,
          marginRight: 5,
        }}
        placeholderTextColor={colors.coolback} // Change placeholder color
      />
    );
  };

  // Customize the send button
  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View
          style={{
            marginRight: 10,
            // marginBottom: 10,
            borderWidth: 1,
            padding: 10,
            borderRadius: 200,
            backgroundColor: colors.darkgraytext,
            alignSelf: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={require("../../assets/icons/send.png")} // Your custom send icon
            style={{ height: 28, width: 28 }}
          />
        </View>
      </Send>
    );
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            // backgroundColor: colors.leftBubbleBackground,
          },
          right: {
            backgroundColor: colors.complementary,
          },
        }}
        textStyle={{
          left: {
            // color: colors.leftBubbleText,
          },
          right: {
            color: colors.whitetext,
          },
        }}
      />
    );
  };

  const renderAvatar = (props) => {
    const avataruri = props.currentMessage.user.avatar;
    const placeholderpfp = require("../../assets/avatar.png");
    console.log(avataruri);

    return (
      <View
        style={{
          width: 40,
          height: 40,
          overflow: "hidden",
          borderRadius: 100,
          // marginLeft: 5,
          marginBottom: 5,
        }}
      >
        <Image
          source={avataruri !== "null" ? { uri: avataruri } : placeholderpfp}
          style={{
            width: 40, // Customize the size
            height: 40, // Customize the size
            borderRadius: 100, // Make it round
            // borderWidth: 1, // Add a border
            // borderColor: colors.whitetext, // Border color
            // marginLeft: 5, // Adjust spacing
            // marginBottom: 5, // Adjust spacing
            // overflow: "hidden",
          }}
        />
      </View>
    );
  };

  return (
    <>
      <LoadingOverlay isVisible={isLoading} />
      <View
        style={{
          height: 60,
          backgroundColor: colors.lightaccent,
          alignItems: "center",
          flexDirection: "row",
          paddingVertical: 10,
          paddingHorizontal: 16,
        }}
      >
        <Pressable style={{ padding: 5 }} onPress={() => navigation.pop()}>
          <BackIcon style={{ alignItems: "center" }} />
        </Pressable>
        <Image
          source={pfp}
          style={{
            marginRight: 10,
            height: 45,
            width: 45,
            borderRadius: 100,
          }}
        />
        <Text
          style={{
            color: colors.whitetext,
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          {doctorname}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            flex: 1,
          }}
        >
          <Pressable
            onPress={() => navigation.navigate("VoiceCall", { callId })}
            style={{ padding: 10, marginRight: 5 }}
          >
            <Image
              source={require("../../assets/icons/phone.png")}
              style={{ height: 20, width: 20 }}
            />
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate("VideoCall", { callId })}
            style={{ padding: 10 }}
          >
            <Image
              source={require("../../assets/icons/video-cam.png")}
              style={{ height: 25, width: 25 }}
            />
          </Pressable>
        </View>
      </View>
      <View style={styles.container}>
        <GiftedChat
          key={user.uid}
          messages={messages}
          onSend={(messages) => onSend(messages)}
          user={{
            _id: user.uid, // Use the Firebase user's ID
            name: user.displayName || "Anonymous",
            avatar: user.photoURL || "null", // Use Firebase user profile picture or passed prop
          }}
          renderInputToolbar={renderInputToolbar}
          renderComposer={renderComposer}
          renderSend={renderSend}
          renderBubble={renderBubble}
          renderAvatar={renderAvatar}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkback,
  },
});
