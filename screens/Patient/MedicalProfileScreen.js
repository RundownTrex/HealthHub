import { act, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  Pressable,
  ScrollView,
  Keyboard,
} from "react-native";
import { TextInputMask } from "react-native-masked-text";
import { Dropdown } from "react-native-element-dropdown";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import colors from "../../utils/colors";
import { useBottomSheet } from "../../context/BottomSheetContext";
import BackIcon from "../../assets/icons/BackIcon";
import Button1 from "../../components/Button1";
import TextInput1 from "../../components/TextInput1";
import LoadingOverlay from "../../components/LoadingOverlay";
import Toast from "react-native-toast-message";

const mstatus = [
  {
    label: "Married",
    value: "married",
  },
  {
    label: "Single",
    value: "single",
  },
  {
    label: "Divorced",
    value: "divorced",
  },
];
const bgroup = [
  { label: "A+", value: "A+" },
  { label: "A-", value: "A-" },
  { label: "B+", value: "B+" },
  { label: "B-", value: "B-" },
  { label: "AB+", value: "AB+" },
  { label: "AB-", value: "AB-" },
  { label: "O+", value: "O+" },
  { label: "O-", value: "O-" },
];

const smoking = [
  { label: "Never smoked", value: "never_smoked" },
  { label: "Former smoker (quit)", value: "former_smoker" },
  { label: "Social smoker", value: "social_smoker" },
  { label: "Occasional smoker", value: "occasional_smoker" },
  { label: "Light smoker (1-10 cigarettes per day)", value: "light_smoker" },
  {
    label: "Moderate smoker (11-20 cigarettes per day)",
    value: "moderate_smoker",
  },
  { label: "Heavy smoker (21+ cigarettes per day)", value: "heavy_smoker" },
  { label: "Vaper (uses e-cigarettes)", value: "vaper" },
  { label: "Cigar smoker", value: "cigar_smoker" },
  { label: "Pipe smoker", value: "pipe_smoker" },
  { label: "Chews tobacco", value: "chews_tobacco" },
];

const drinking = [
  { label: "Never drinks", value: "never_drinks" },
  { label: "Former drinker (quit)", value: "former_drinker" },
  { label: "Social drinker", value: "social_drinker" },
  { label: "Occasional drinker", value: "occasional_drinker" },
  { label: "Light drinker (1-2 drinks per week)", value: "light_drinker" },
  {
    label: "Moderate drinker (3-7 drinks per week)",
    value: "moderate_drinker",
  },
  { label: "Heavy drinker (8+ drinks per week)", value: "heavy_drinker" },
  {
    label: "Binge drinker (5+ drinks in a single occasion)",
    value: "binge_drinker",
  },
  { label: "Non-alcoholic beverages only", value: "non_alcoholic" },
];

const activity = [
  { label: "Sedentary (little or no exercise)", value: "sedentary" },
  {
    label: "Lightly active (light exercise 1-3 days a week)",
    value: "lightly_active",
  },
  {
    label: "Moderately active (moderate exercise 3-5 days a week)",
    value: "moderately_active",
  },
  {
    label: "Very active (hard exercise 6-7 days a week)",
    value: "very_active",
  },
  {
    label: "Extremely active (intense exercise every day)",
    value: "extremely_active",
  },
  {
    label: "Athlete/Competitive (training for competitions)",
    value: "athlete",
  },
];

const diet = [
  { label: "Omnivore (eats all types of food)", value: "omnivore" },
  { label: "Vegetarian (avoids meat and fish)", value: "vegetarian" },
  { label: "Vegan (avoids all animal products)", value: "vegan" },
  { label: "Pescatarian (avoids meat but eats fish)", value: "pescatarian" },
  {
    label: "Flexitarian (primarily vegetarian, but occasionally eats meat)",
    value: "flexitarian",
  },
  {
    label: "Paleo (focuses on whole foods, avoids grains and legumes)",
    value: "paleo",
  },
  { label: "Keto (high-fat, low-carb diet)", value: "keto" },
  {
    label: "Gluten-Free (avoids gluten-containing foods)",
    value: "gluten_free",
  },
  {
    label: "Lactose-Free (avoids dairy products with lactose)",
    value: "lactose_free",
  },
  { label: "Halal (permissible under Islamic law)", value: "halal" },
  { label: "Kosher (follows Jewish dietary laws)", value: "kosher" },
  { label: "Low Carb (reduces carbohydrate intake)", value: "low_carb" },
  { label: "Low Fat (reduces fat intake)", value: "low_fat" },
  {
    label: "Whole Foods (emphasizes minimally processed foods)",
    value: "whole_foods",
  },
  { label: "Organic (prefers organically grown foods)", value: "organic" },
];

export default function MedicalProfileScreen({ navigation }) {
  const { toggleBottomSheet } = useBottomSheet();
  const [firstName, setFirstName] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [healthProfile, setHealthProfile] = useState({
    height: "",
    weight: "",
    maritalStatus: "",
    bloodGroup: "",
    allergies: "",
    injuries: "",
    chronicDiseases: "",
    pastIllnesses: "",
    currentMedications: "",
    pastMedications: "",
    previousSurgeries: "",
    emergencyContact: "",
    smokingHabits: "",
    drinkingHabits: "",
    activityLevel: "",
    foodPreference: "",
    occupation: "",
  });

  const handleInputChange = (name, value) => {
    setHealthProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log(healthProfile);

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Toast.show({
        type: "success",
        text1: "Submitted Successfully",
      });
    }, 3000);
  };

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

  // useEffect(() => {
  //   const keyboardDidShowListener = Keyboard.addListener(
  //     "keyboardDidShow",
  //     () => setKeyboardVisible(true)
  //   );
  //   const keyboardDidHideListener = Keyboard.addListener(
  //     "keyboardDidHide",
  //     () => setKeyboardVisible(false)
  //   );

  //   return () => {
  //     keyboardDidHideListener.remove();
  //     keyboardDidShowListener.remove();
  //   };
  // }, []);

  return (
    <>
      <LoadingOverlay isVisible={isLoading} />
      <View
        style={{
          height: 60,
          backgroundColor: colors.lightaccent,
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          paddingVertical: 10,
          paddingHorizontal: 16,
        }}
      >
        <Pressable style={{ padding: 5 }} onPress={() => navigation.pop()}>
          <BackIcon style={{ alignItems: "flex-start" }} />
        </Pressable>
        <Text
          style={{
            color: colors.whitetext,
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          Medical Profile
        </Text>
        <View style={{ height: 20, width: 20 }} />
      </View>
      <View style={styles.container}>
        <KeyboardAwareScrollView
          // contentContainerStyle={[
          //   styles.scrollContainer,
          //   {
          //     paddingBottom: keyboardVisible ? 85 : 85,
          //     marginBottom: 185,
          //   },
          // ]}
          style={[
            styles.scrollContainer,
            {
              marginBottom: 85,
            },
          ]}
          // enableOnAndroid={true}
          extraScrollHeight={120} // Adjust this value as needed
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.label}>Height</Text>
            <TextInputMask
              type={"custom"}
              options={{
                mask: "9'9\"",
              }}
              placeholder="X'Y''"
              placeholderTextColor={colors.lightgraytext}
              value={healthProfile.height}
              onChangeText={(value) => handleInputChange("height", value)}
              style={[styles.input, { marginTop: 5 }]}
              keyboardType="numeric"
            />
          </View>
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.label}>Weight (in Kgs)</Text>
            <TextInputMask
              type={"custom"}
              options={{
                mask: "999",
              }}
              placeholder="Ex. 60"
              placeholderTextColor={colors.lightgraytext}
              value={healthProfile.weight}
              onChangeText={(value) => handleInputChange("weight", value)}
              style={[styles.input, { marginTop: 5 }]}
              keyboardType="numeric"
              maxLength={3}
            />
          </View>

          <View style={{ marginBottom: 10 }}>
            <Text style={[styles.label]}>Blood Group</Text>
            <Dropdown
              placeholder="Blood Group"
              data={bgroup}
              maxHeight={500}
              value={healthProfile.bloodGroup}
              onChange={(item) => {
                handleInputChange("bloodGroup", item.value);
              }}
              style={{
                height: 45,
                borderColor: "gray",
                borderWidth: 1,
                paddingHorizontal: 10,
                paddingVertical: 12,
                borderRadius: 2,
                backgroundColor: colors.somewhatlightback,
                fontSize: 16,
                marginVertical: 5,
              }}
              placeholderStyle={{
                color: colors.lightgraytext,
              }}
              labelField="label"
              valueField="value"
              itemContainerStyle={{
                backgroundColor: colors.darkback,
                borderRadius: 8,
              }}
              selectedTextStyle={{
                color: colors.whitetext,
              }}
              mode="modal"
              itemTextStyle={{
                color: colors.whitetext,
              }}
              containerStyle={{
                backgroundColor: colors.darkback,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: colors.darkback,
              }}
              activeColor={colors.somewhatlightback}
              backgroundColor="#000000b3"
            />
          </View>

          <View style={{ marginBottom: 10 }}>
            <Text style={[styles.label]}>Martial Status</Text>
            <Dropdown
              placeholder="Martial Status"
              data={mstatus}
              maxHeight={500}
              value={healthProfile.maritalStatus}
              onChange={(item) => {
                handleInputChange("martialStatus", item.value);
              }}
              style={{
                height: 45,
                borderColor: "gray",
                borderWidth: 1,
                paddingHorizontal: 10,
                paddingVertical: 12,
                borderRadius: 2,
                backgroundColor: colors.somewhatlightback,
                fontSize: 16,
                marginVertical: 5,
              }}
              placeholderStyle={{
                color: colors.lightgraytext,
              }}
              labelField="label"
              valueField="value"
              itemContainerStyle={{
                backgroundColor: colors.darkback,
                borderRadius: 8,
              }}
              selectedTextStyle={{
                color: colors.whitetext,
              }}
              mode="modal"
              itemTextStyle={{
                color: colors.whitetext,
              }}
              containerStyle={{
                backgroundColor: colors.darkback,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: colors.darkback,
              }}
              activeColor={colors.somewhatlightback}
              backgroundColor="#000000b3"
            />
          </View>

          <View style={{ marginBottom: 10 }}>
            <Text style={styles.label}>
              Allergies (put 'No' if no allergies)
            </Text>
            <TextInput1
              placeholder="Ex. Food Allergy"
              value={healthProfile.allergies}
              onChangeText={(p) => handleInputChange("allergies", p)}
            />
          </View>
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.label}>Injuries (put 'No' if no injuries)</Text>
            <TextInput1
              placeholder="Ex. Fracture"
              value={healthProfile.injuries}
              onChangeText={(p) => handleInputChange("injuries", p)}
            />
          </View>
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.label}>Chronic Diseases</Text>
            <TextInput1
              placeholder="Ex. Diabetes"
              value={healthProfile.chronicDiseases}
              onChangeText={(p) => handleInputChange("chronicDiseases", p)}
            />
          </View>
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.label}>Past Illness</Text>
            <TextInput1
              placeholder="Ex. Chickenpox"
              value={healthProfile.pastIllnesses}
              onChangeText={(p) => handleInputChange("pastIllnesses", p)}
            />
          </View>
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.label}>Current Medications</Text>
            <TextInput1
              placeholder="None"
              value={healthProfile.currentMedications}
              onChangeText={(p) => handleInputChange("currentMedications", p)}
            />
          </View>
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.label}>Past Medications</Text>
            <TextInput1
              placeholder="None"
              value={healthProfile.pastMedications}
              onChangeText={(p) => handleInputChange("pastMedications", p)}
            />
          </View>

          <View style={{ marginBottom: 10 }}>
            <Text style={styles.label}>Previous Surgeries</Text>
            <TextInput1
              placeholder="None"
              value={healthProfile.previousSurgeries}
              onChangeText={(p) => handleInputChange("previousSurgeries", p)}
            />
          </View>
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.label}>Emergency Contact</Text>
            <TextInput1
              placeholder="None"
              value={healthProfile.emergencyContact}
              onChangeText={(p) => handleInputChange("emergencyContact", p)}
              kbtype={"numeric"}
              maxlen={10}
            />
          </View>

          <View style={{ marginBottom: 10 }}>
            <Text style={[styles.label]}>Smoking Habits</Text>
            <Dropdown
              placeholder="Smoking Habits"
              data={smoking}
              maxHeight={500}
              value={healthProfile.smokingHabits}
              onChange={(item) => {
                handleInputChange("smokingHabits", item.value);
              }}
              style={{
                height: 45,
                borderColor: "gray",
                borderWidth: 1,
                paddingHorizontal: 10,
                paddingVertical: 12,
                borderRadius: 2,
                backgroundColor: colors.somewhatlightback,
                fontSize: 16,
                marginVertical: 5,
              }}
              placeholderStyle={{
                color: colors.lightgraytext,
              }}
              labelField="label"
              valueField="value"
              itemContainerStyle={{
                backgroundColor: colors.darkback,
                borderRadius: 8,
              }}
              selectedTextStyle={{
                color: colors.whitetext,
              }}
              mode="modal"
              itemTextStyle={{
                color: colors.whitetext,
              }}
              containerStyle={{
                backgroundColor: colors.darkback,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: colors.darkback,
              }}
              activeColor={colors.somewhatlightback}
              backgroundColor="#000000b3"
            />
          </View>
          <View style={{ marginBottom: 10 }}>
            <Text style={[styles.label]}>Drinking Habits</Text>
            <Dropdown
              placeholder="Drinking Habits"
              data={drinking}
              maxHeight={500}
              value={healthProfile.drinkingHabits}
              onChange={(item) => {
                handleInputChange("drinkingHabits", item.value);
              }}
              style={{
                height: 45,
                borderColor: "gray",
                borderWidth: 1,
                paddingHorizontal: 10,
                paddingVertical: 12,
                borderRadius: 2,
                backgroundColor: colors.somewhatlightback,
                fontSize: 16,
                marginVertical: 5,
              }}
              placeholderStyle={{
                color: colors.lightgraytext,
              }}
              labelField="label"
              valueField="value"
              itemContainerStyle={{
                backgroundColor: colors.darkback,
                borderRadius: 8,
              }}
              selectedTextStyle={{
                color: colors.whitetext,
              }}
              mode="modal"
              itemTextStyle={{
                color: colors.whitetext,
              }}
              containerStyle={{
                backgroundColor: colors.darkback,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: colors.darkback,
              }}
              activeColor={colors.somewhatlightback}
              backgroundColor="#000000b3"
            />
          </View>
          <View style={{ marginBottom: 10 }}>
            <Text style={[styles.label]}>Activity Level</Text>
            <Dropdown
              placeholder="Activity Level"
              data={activity}
              maxHeight={500}
              value={healthProfile.activityLevel}
              onChange={(item) => {
                handleInputChange("activityLevel", item.value);
              }}
              style={{
                height: 45,
                borderColor: "gray",
                borderWidth: 1,
                paddingHorizontal: 10,
                paddingVertical: 12,
                borderRadius: 2,
                backgroundColor: colors.somewhatlightback,
                fontSize: 16,
                marginVertical: 5,
              }}
              placeholderStyle={{
                color: colors.lightgraytext,
              }}
              labelField="label"
              valueField="value"
              itemContainerStyle={{
                backgroundColor: colors.darkback,
                borderRadius: 8,
              }}
              selectedTextStyle={{
                color: colors.whitetext,
              }}
              mode="modal"
              itemTextStyle={{
                color: colors.whitetext,
              }}
              containerStyle={{
                backgroundColor: colors.darkback,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: colors.darkback,
              }}
              activeColor={colors.somewhatlightback}
              backgroundColor="#000000b3"
            />
          </View>
          <View style={{ marginBottom: 10 }}>
            <Text style={[styles.label]}>Food Preference</Text>
            <Dropdown
              placeholder="Food Preference"
              data={diet}
              maxHeight={500}
              value={healthProfile.foodPreference}
              onChange={(item) => {
                handleInputChange("foodPreference", item.value);
              }}
              style={{
                height: 45,
                borderColor: "gray",
                borderWidth: 1,
                paddingHorizontal: 10,
                paddingVertical: 12,
                borderRadius: 2,
                backgroundColor: colors.somewhatlightback,
                fontSize: 16,
                marginVertical: 5,
              }}
              placeholderStyle={{
                color: colors.lightgraytext,
              }}
              labelField="label"
              valueField="value"
              itemContainerStyle={{
                backgroundColor: colors.darkback,
                borderRadius: 8,
              }}
              selectedTextStyle={{
                color: colors.whitetext,
              }}
              mode="modal"
              itemTextStyle={{
                color: colors.whitetext,
              }}
              containerStyle={{
                backgroundColor: colors.darkback,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: colors.darkback,
              }}
              activeColor={colors.somewhatlightback}
              backgroundColor="#000000b3"
            />
          </View>

          <View style={{ marginBottom: 10 }}>
            <Text style={styles.label}>Occupation</Text>
            <TextInput1
              placeholder="Ex. Software Engineer"
              value={healthProfile.occupation}
              onChangeText={(p) => handleInputChange("occupation", p)}
            />
          </View>
        </KeyboardAwareScrollView>
        <View style={styles.bottomPanel}>
          <Button1 text="Submit Changes" onPress={handleSubmit} />
        </View>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: colors.darkback,
    // paddingBottom: 85,
  },
  container: {
    flex: 1,
    backgroundColor: colors.darkback,
    padding: 16,
    paddingBottom: 0,
  },

  bottomPanel: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: colors.darkback,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    borderTopColor: colors.tenpercent,
    borderTopWidth: 1,
  },

  label: {
    color: colors.lightgraytext,
    fontSize: 14,
  },

  input: {
    height: 45,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 2,
    color: colors.whitetext,
    backgroundColor: colors.somewhatlightback,
    fontSize: 16,
  },
});
