import { useState, useEffect } from "react";
import { View, Text, StyleSheet, BackHandler } from "react-native";
import {
  StreamCall,
  useStreamVideoClient,
  CallingState,
  CallContent,
} from "@stream-io/video-react-native-sdk";
import colors from "../utils/colors";

export default function VideoCall({ navigation, route }) {
  const { callId } = route.params;
  const [call, setCall] = useState(null);
  const client = useStreamVideoClient();

  useEffect(() => {
    const _call = client?.call("default", callId);
    _call?.join({ create: true }).then(() => setCall(_call));
  }, [client, callId]);

  useEffect(() => {
    const handleBackPress = () => {
      // Leave the call and navigate back
      if (call) {
        call.leave().then(() => {
          navigation.pop();
        });
      } else {
        navigation.pop(); // Navigate back if no call is active
      }
      return true; // Prevent default back action
    };

    BackHandler.addEventListener("hardwareBackPress", handleBackPress);

    return () => {
      // Cleanup the back handler and leave the call if needed
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
      if (call?.state.callingState !== CallingState.LEFT) {
        call?.leave();
      }
    };
  }, [call, navigation]);

  useEffect(() => {
    return () => {
      // Cleanup the call on unmount if the call was not left already
      if (call?.state.callingState !== CallingState.LEFT) {
        call?.leave();
      }
    };
  }, [call]);

  if (!call) {
    return (
      <View style={styles.container}>
        <Text style={[styles.text, { alignSelf: "center" }]}>
          Joining call...
        </Text>
      </View>
    );
  }

  return (
    <StreamCall call={call}>
      <View style={styles.container}>
        <CallContent onHangupCallHandler={() => navigation.pop()} />
      </View>
    </StreamCall>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.darkback,
  },
});
