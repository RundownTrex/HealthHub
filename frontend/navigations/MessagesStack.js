import React from "react";
import { enableScreens } from "react-native-screens";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Messages from "../screens/Patient/Messages";
import DoctorChat from "../screens/Patient/DoctorChat";
import VideoCall from "../components/VideoCall";
import VoiceCall from "../components/VoiceCall";

import {
  StreamVideoClient,
  StreamVideo,
} from "@stream-io/video-react-native-sdk";

const apiKey = "6a8qhywws3sz";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiR2VuZXJhbF9Eb2Rvbm5hIn0.CbaVdGaIvA7ziJXjj55aaKncqvi0zTP85GrcfI-sPYk";
const userId = "General_Dodonna";

const user = {
  id: userId,
  name: "Da Wei",
  image: "https://robohash.org/John",
};
const client = new StreamVideoClient({ apiKey, user, token });

enableScreens();
const Stack = createNativeStackNavigator();

export default function MessagesStack() {
  return (
    <StreamVideo client={client}>
      <Stack.Navigator
        initialRouteName="Messages"
        screenOptions={{
          headerShown: false,
          animation: "ios",
          gestureEnabled: false,
        }}
      >
        <Stack.Screen name="Messages" component={Messages} />
        <Stack.Screen name="DoctorChat" component={DoctorChat} />
        <Stack.Screen name="VideoCall" component={VideoCall} />
        <Stack.Screen name="VoiceCall" component={VoiceCall} />
      </Stack.Navigator>
    </StreamVideo>
  );
}
