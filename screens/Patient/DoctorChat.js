import { useState, useEffect, useCallback, useRef, useContext } from "react";
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
import RoleContext from "../../context/RoleContext";

import colors from "../../utils/colors";
import BackIcon from "../../assets/icons/BackIcon";
import { useBottomSheet } from "../../context/BottomSheetContext";
import LoadingOverlay from "../../components/LoadingOverlay";

export default function DoctorChat({ navigation, route }) {
  const { doctorName, patientName, userpfp, doctorId, patientId } =
    route.params;
  const { toggleBottomSheet } = useBottomSheet();
  const [userData, setUserData] = useState({});
  const [fullName, setFullName] = useState("");
  const [curPfp, setCurPfp] = useState();
  const { userRole } = useContext(RoleContext);

  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const user = auth().currentUser;
  const callId = "Fw39EziXX2kB";

  const createChatRoomId = (userId1, userId2) => {
    return [userId1, userId2].sort().join("_");
  };
  const chatId = createChatRoomId(patientId, doctorId);

  const fetchUserData = async () => {
    const profileDoc = await firestore()
      .collection("users")
      .doc(user.uid)
      .get();

    if (profileDoc.exists) {
      profileData = profileDoc.data();
      setUserData(profileData);
      setFullName(profileData.firstname + " " + profileData.lastname);
      setCurPfp(profileData.pfpUrl);
    }
  };

  useEffect(() => {
    console.log(doctorName);
    console.log(patientName);
    console.log("Receiver's : ", userpfp);
    console.log("Senders's : ", userData.pfpUrl);
    console.log(doctorId);
    console.log(patientId);
  }, [userData]);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = firestore()
      .collection("chats")
      .doc(chatId)
      .collection("messages")
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

    fetchUserData();

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

  const onSend = useCallback(
    (messages = []) => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages)
      );

      const { _id, createdAt, text, user } = messages[0];

      // Add the new message to Firestore
      firestore()
        .collection("chats")
        .doc(chatId)
        .collection("messages")
        .add({
          _id,
          text,
          createdAt,
          user,
        })
        .then(() => {
          if (userRole === "patient") {
            const recentData = {
              doctorId: doctorId,
              doctorName: doctorName,
              doctorPfp: userpfp,
              patientId: patientId,
              patientName: patientName,
              patientPfp: userData.pfpUrl,
              latestMessage: text,
              timestamp: createdAt,
              participants: [doctorId, patientId],
              doctorUnread: firestore.FieldValue.increment(1),
            };

            console.log(recentData);

            firestore()
              .collection("recentChats")
              .doc(chatId)
              .set(recentData, { merge: true });
          } else {
            const recentData = {
              doctorId: doctorId,
              doctorName: fullName,
              doctorPfp: userData.pfpUrl,
              patientId: patientId,
              patientName: patientName,
              patientPfp: userpfp,
              latestMessage: text,
              timestamp: createdAt,
              participants: [doctorId, patientId],
              patientUnread: firestore.FieldValue.increment(1),
            };

            firestore()
              .collection("recentChats")
              .doc(chatId)
              .set(recentData, { merge: true });
          }
        });
    },
    [
      userData,
      fullName,
      doctorName,
      doctorId,
      patientId,
      patientName,
      userRole,
      userpfp,
    ]
  );

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
    // console.log(avataruri);

    return (
      <View
        style={{
          width: 36,
          height: 36,
          overflow: "hidden",
          borderRadius: 100,
          // marginLeft: 5,
          marginBottom: 5,
        }}
      >
        <Image
          source={avataruri !== "null" ? { uri: avataruri } : placeholderpfp}
          style={{
            width: 36, // Customize the size
            height: 36, // Customize the size
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

  if (!userData || !fullName) {
    return <LoadingOverlay isVisible={true} />;
  }

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
        <View
          style={{
            borderRadius: 100,
            overflow: "hidden",
            width: 45,
            height: 45,
            marginRight: 10,
          }}
        >
          <Image
            source={{ uri: userpfp }}
            style={{
              height: 45,
              width: 45,
              borderRadius: 100,
            }}
          />
        </View>
        <Text
          style={{
            color: colors.whitetext,
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          {userRole === "patient" ? doctorName : patientName}
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
            _id: user.uid,
            name: fullName || user.displayName || "Anonymous",
            avatar: userData.pfpUrl || user.photoURL || "null",
          }}
          renderInputToolbar={renderInputToolbar}
          renderComposer={renderComposer}
          renderSend={renderSend}
          renderBubble={renderBubble}
          renderAvatar={renderAvatar}
          renderFooter={() => <View style={{ height: 12}} />}
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
