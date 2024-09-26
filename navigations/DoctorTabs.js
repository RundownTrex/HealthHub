import { useEffect, useCallback } from "react";
import { Image, View, Text, StyleSheet, StatusBar } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import auth from "@react-native-firebase/auth";
import messaging from "@react-native-firebase/messaging";
import firestore from "@react-native-firebase/firestore";
import Toast from "react-native-toast-message";



import DoctorHomeStack from "./DoctorHomeStack";
import DoctorMessagesStack from "./DoctorMessagesStack";
import DoctorProfileStack from "./DoctorProfileStack";
import colors from "../utils/colors";
import CustomTabBar from "../components/CustomTabBar";
import { BottomSheetProvider } from "../context/BottomSheetContext";

const Tab = createBottomTabNavigator();

export default function DoctorTabs() {

  const storeFCMToken = async () => {
    try {
      const user = auth().currentUser;

      if (user) {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
          await firestore().collection("users").doc(user.uid).set(
            {
              fcmToken: fcmToken,
            },
            { merge: true }
          );
          console.log("FCM Token stored in Firestore:", fcmToken);
        }
      }
    } catch (error) {
      console.error("Error storing FCM token:", error);
    }
  };

  useEffect(() => {
    storeFCMToken();

    const unsubscribe = messaging().onTokenRefresh((newToken) => {
      const user = auth().currentUser;
      if (user) {
        firestore().collection("users").doc(user.uid).update({
          fcmToken: newToken,
        });
      }
      console.log("FCM Token refreshed:", newToken);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("A new FCM message arrived!", JSON.stringify(remoteMessage));

      Toast.show({
        type: "info",
        text1: remoteMessage.notification.title,
        text2: remoteMessage.notification.body,
      });
    });

    return unsubscribe;
  }, []);

  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log("Message handled in the background!", remoteMessage);
  });
  return (
    <BottomSheetProvider>
      <Tab.Navigator
        backBehavior="firstRoute"
        initialRouteName="Home"
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={({ route }) => ({
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            ...styles.bottomtab,
          },
          tabBarShowLabel: false,
          headerTintColor: colors.lightaccent,
        })}
      >
        <Tab.Screen
          name="Home"
          component={DoctorHomeStack}
          options={{
            headerShown: false,
          }}
        />

        <Tab.Screen
          name="Message"
          component={DoctorMessagesStack}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Profiles"
          component={DoctorProfileStack}
          options={{
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    </BottomSheetProvider>
  );
}

const styles = StyleSheet.create({
  bottomtab: {
    height: 60,
    backgroundColor: colors.darkback,
    paddingTop: 0,
    marginTop: 0,
    borderTopWidth: 1,
    borderTopColor: colors.somewhatlightback,
  },
  iconContainer: {
    alignItems: "center",
  },
  label: {
    fontSize: 14,
  },

  headstyle: {
    backgroundColor: colors.lightaccent,
    height: 100,
    // overflow: "hidden",
    // backgroundColor: "transparent",
  },

  locationblock: {
    display: "flex",
    flexDirection: "row",
    gap: 6,
    marginRight: 16,
    // borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
