import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

import {
  Call,
  StreamCall,
  useStreamVideoClient,
  useCallStateHooks,
  CallingState,
  CallContent,
  useCall,
  useCalls,
  OutgoingCall,
  CallControls,
  HangUpCallButton,
  ToggleAudioPublishingButton,
  ToggleVideoPublishingButton,
  CallControlProps,
} from "@stream-io/video-react-native-sdk";
import colors from "../utils/colors";

export default function VoiceCall({ navigation, route }) {
  const { callId } = route.params;
  const [call, setCall] = useState(null);
  const client = useStreamVideoClient();

  const calls = useCalls();

  //   const { useCameraState } = useCallStateHooks();
  //   const { camera } = useCameraState();

  //   const disablecam = async () => {
  //     await camera.disable();
  //   };

  const CustomCallControls = (CallControlProps) => {
    const coll = useCall();
    return (
      <View style={styles.buttonContainer}>
        <ToggleAudioPublishingButton />
        <ToggleVideoPublishingButton />
        <HangUpCallButton onHangupCallHandler={() => navigation.pop()} />
      </View>
    );
  };

  //   useEffect(() => {
  //     disablecam();
  //   }, []);

  useEffect(() => {
    const _call = client?.call("Voice", callId);
    _call?.join({ create: true }).then(() => setCall(_call));
  }, [client, callId]);

  useEffect(() => {
    return () => {
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
        <CallContent
          onHangupCallHandler={() => navigation.pop()}
          CallControls={CustomCallControls}
        />
      </View>
    </StreamCall>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.darkback,
  },

  buttonContainer: {
    position: "relative",
    bottom: 0,
    paddingVertical: 15,
    width: "100%",
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "space-around",
    backgroundColor: colors.darkback,
    borderRadius: 5,
    zIndex: 5,
  },
  text: {
    color: colors.whitetext,
    fontSize: 16,
    fontWeight: "bold",
  },
});
