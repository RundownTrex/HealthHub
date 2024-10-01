import { LOCAL_IP } from "@env";
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
import io from "socket.io-client";
import { TypingAnimation } from "react-native-typing-animation";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";

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
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");

  const user = auth().currentUser;
  const callId = "Fw39EziXX2kB";
  const socket = useRef();

  const createChatRoomId = (userId1, userId2) => {
    return [userId1, userId2].sort().join("_");
  };
  const chatId = createChatRoomId(patientId, doctorId);
  const userId = user.uid;
  const isDoctor = userRole === "doctor" ? true : false;

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
    // console.log(doctorName);
    // console.log(patientName);
    // console.log("Receiver's : ", userpfp);
    // console.log("Senders's : ", userData.pfpUrl);
    // console.log(doctorId);
    // console.log(patientId);
    console.log(LOCAL_IP);
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

    return () => {
      unsubscribe();

      if (userRole === "doctor") {
        firestore()
          .collection("recentChats")
          .doc(chatId)
          .set({ doctorUnread: 0 }, { merge: true });
      } else {
        firestore()
          .collection("recentChats")
          .doc(chatId)
          .set({ patientUnread: 0 }, { merge: true });
      }
    };
  }, []);

  useEffect(() => {
    console.log("Attempting to connect to socket server...");
    socket.current = io(`https://healthhub-6799.onrender.com`);

    socket.current.on("connect", () => {
      console.log("Socket connected:", socket.current.id);
      socket.current.emit("joinRoom", chatId, userId, isDoctor);
    });

    socket.current.on(
      "userTyping",
      ({ chatId: incomingChatId, userId: typingUserId, isTyping }) => {
        console.log(" Typing user Id: ", typingUserId);
        if (incomingChatId === chatId && typingUserId !== userId) {
          console.log("Typing event received:", { typingUserId, isTyping });
          setIsTyping(isTyping);
          setTypingUser(typingUserId);
        }
      }
    );

    return () => {
      socket.current.disconnect();
    };
  }, [chatId, userId]);

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

  const handleTyping = (text) => {
    const isTyping = text.length > 0;

    // console.log(`User ${userId} is typing:`, isTyping);

    socket.current.emit("userTyping", {
      chatId,
      userId,
      isTyping,
    });
  };

  const onSend = useCallback(
    (messages = []) => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages)
      );

      const { _id, createdAt, text, user } = messages[0];

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
          color: colors.whitetext,
          backgroundColor: colors.darkback,
          borderRadius: 20,
          paddingLeft: 15,
          paddingRight: 10,
          lineHeight: 30,
          //   borderWidth: 1,
          alignItems: "center",
          backgroundColor: colors.somewhatlightback,
          marginBottom: 0,
          marginRight: 5,
        }}
        placeholderTextColor={colors.coolback}
      />
    );
  };

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View
          style={{
            marginRight: 10,
            // marginBottom: 10,
            padding: 10,
            borderRadius: 200,
            backgroundColor: colors.complementary,
            alignSelf: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={require("../../assets/icons/send.png")}
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
            width: 36,
            height: 36,
            borderRadius: 100,
            // borderWidth: 1,
            // borderColor: colors.whitetext,
            // marginLeft: 5,
            // marginBottom: 5,
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
        <View>
          <Text
            style={{
              color: colors.whitetext,
              fontWeight: "bold",
              fontSize: 18,
            }}
          >
            {userRole === "patient" ? doctorName : patientName}
          </Text>
          {isTyping && typingUser !== userId ? (
            <View style={{ flexDirection: "row" }}>
              <Text style={{ color: colors.whitetext }}>Typing</Text>
              <TypingAnimation
                dotColor="white"
                dotMargin={5}
                dotAmplitude={3}
                dotRadius={2.2}
                dotX={12}
                dotY={12}
              />
            </View>
          ) : null}
          {/* <View style={{ flexDirection: "row" }}>
            <Text style={{ color: colors.whitetext }}>Typing</Text>
            <TypingAnimation
              dotColor="white"
              dotMargin={5}
              dotAmplitude={3}
              dotRadius={2.2}
              dotX={12}
              dotY={0}
            />
          </View> */}
        </View>
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
          onInputTextChanged={(text) => handleTyping(text)}
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
          renderFooter={() => <View style={{ height: 12 }} />}
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
