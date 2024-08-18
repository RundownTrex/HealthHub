import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export const CallScreen = ({ goToHomeScreen, callId }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Here we will add Video Calling UI</Text>
      <Button title="Go back" onPress={goToHomeScreen} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  text: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});
