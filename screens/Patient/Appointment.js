import { useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import colors from "../../utils/colors";
import { Icon, Searchbar } from "react-native-paper";
import IconButton from "../../components/IconButton";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const data = [
  { id: 1, icon: require("../../assets/gp.png"), label: "General physician" },
  { id: 2, icon: require("../../assets/gp.png"), label: "Skin & Hair" },
  { id: 3, icon: require("../../assets/gp.png"), label: "Women health" },
  { id: 4, icon: require("../../assets/gp.png"), label: "Dental care" },
  { id: 5, icon: require("../../assets/gp.png"), label: "Mental wellness" },
  {
    id: 6,
    icon: require("../../assets/icons/down-arrow.png"),
    label: "View all",
  },
];

export default function Appointment({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleClick = () => {
    navigation.navigate("Providers");

  };

  return (
    <>
      <View
        style={{
          height: 60,
          backgroundColor: colors.lightaccent,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: colors.whitetext,
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          Appointments
        </Text>
      </View>
      <View style={styles.container}>
        <Searchbar
          style={{
            alignSelf: "center",
            backgroundColor: colors.superlightaccent,
            marginBottom: 16,
            // height: 45,
            // padding: 0,
          }}
          onChangeText={setSearchQuery}
          value={searchQuery}
          elevation={5}
          placeholder="Search for specialities"
        />
        <Text
          style={{ color: colors.whitetext, fontWeight: "bold", fontSize: 22 }}
        >
          Most searched specialities
        </Text>
        <View style={styles.avatarcontainer}>
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <IconButton
                icon={item.icon}
                label={item.label}
                fun={handleClick}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    padding: 16,
    backgroundColor: colors.darkback,
  },
  avatarcontainer: {
    marginTop: 10,
    flexDirection: "row",
  },
  row: {
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 16,
  },
  listContainer: {
    alignItems: "center",
  },
});
