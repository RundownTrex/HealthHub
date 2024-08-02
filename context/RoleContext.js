import React, { createContext, useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import colors from "../utils/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RoleContext = createContext();

export const UserProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedRole = await AsyncStorage.getItem("userRole");
        if (storedRole) {
          setUserRole(storedRole);
        }
      } catch (error) {
        console.log("Failed to fetch user role from storage!, ", error);
      }

      const unsub = auth().onAuthStateChanged(async (user) => {
        if (user) {
          const userDoc = await firestore()
            .collection("users")
            .doc(user.uid)
            .get();

          if (!userDoc.exists) {
            console.log("Not existing: ", userRole);
            setUserRole(null);
            await AsyncStorage.removeItem("userRole");
          }
        } else {
          console.log("Signed out: ", userRole);
          setUserRole(null);
          await AsyncStorage.removeItem("userRole");
        }
      });
      setLoading(false);

      return () => unsub();
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.lightaccent} />
      </View>
    );
  }

  return (
    <RoleContext.Provider value={{ userRole, setUserRole }}>
      {children}
    </RoleContext.Provider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.darkback,
  },
});

export default RoleContext;
