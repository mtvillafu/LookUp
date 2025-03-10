import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SearchMenuProps {
  closeSearch: () => void;
}

const SearchMenu: React.FC<SearchMenuProps> = ({ closeSearch }) => {
  const flights = Array(8).fill("#1111 JP → NY 02/12");

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Search Flight #"
          placeholderTextColor="#ccc"
        />
      </View>

      <FlatList
        data={flights}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Ionicons
              name="airplane"
              size={24}
              color="white"
              style={styles.icon}
            />
            <Text style={styles.text}>{item}</Text>

            <View style={styles.arrowContainer}>
              <Ionicons name="arrow-forward" size={20} color="black" />
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.closeButton} onPress={closeSearch}>
        <Ionicons name="close" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#1E1E1E",
    paddingVertical: 40,
    paddingHorizontal: 20,
    zIndex: 999,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    marginTop: 30,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    color: "white",
    fontSize: 16,
    paddingHorizontal: 10,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    padding: 15,
    borderRadius: 30,
    marginVertical: 5,
  },
  text: {
    flex: 1,
    color: "white",
    fontSize: 16,
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  arrowContainer: {
    width: 40,
    height: 40,
    borderRadius: 100,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    padding: 15,
    borderRadius: 30,
    backgroundColor: "#333",
  },
});

export default SearchMenu;
