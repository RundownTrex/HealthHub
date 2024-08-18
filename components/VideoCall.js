import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

import {
  Call,
  StreamCall,
  useStreamVideoClient,
  useCallStateHooks,
  CallingState,
  CallContent,
} from "@stream-io/video-react-native-sdk";

export default function VideoCall({ navigation, route }) {
  const { callId } = route.params;
  const [call, setCall] = useState(null);
  const client = useStreamVideoClient();

  useEffect(() => {
    const _call = client?.call("default", callId);
    _call?.join({ create: true }).then(() => setCall(_call));
  }, [client, callId]);

  useEffect(() => {
    return () => {
      // cleanup the call on unmount if the call was not left already
      if (call?.state.callingState !== CallingState.LEFT) {
        call?.leave();
      }
    };
  }, [call]);

  if (!call) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Joining call...</Text>
      </View>
    );
  }

  const ParticipantCountText = () => {
    const { useParticipantCount } = useCallStateHooks();
    const participantCount = useParticipantCount();
    return (
      <Text style={styles.text}>Call has {participantCount} participants</Text>
    );
  };

  return (
    <StreamCall call={call}>
      <View style={styles.container}>
        {/* <Text style={styles.text}>Here we will add Video Calling UI</Text>
        <ParticipantCountText />
        <Pressable title="Go back" onPress={() => navigation.pop()}>
          <Text>Leave call</Text>
        </Pressable> */}
        <CallContent onHangupCallHandler={() => navigation.pop()} />
      </View>
    </StreamCall>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    justifyContent: "center",
  },
});
