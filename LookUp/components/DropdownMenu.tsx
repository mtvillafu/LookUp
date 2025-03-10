import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
  StatusBar,
  TouchableWithoutFeedback,
} from "react-native";
import { Link } from "expo-router";
import SearchMenu from "../app/(tabs)/SearchMenu"; // Import SearchMenu
import FavoritesMenu from "../app/(tabs)/FavoritesMenu"; // Import FavoritesMenu

interface DropdownMenuProps {
  isVisible: boolean;
  animation: Animated.Value;
  closeMenu: () => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  isVisible,
  animation,
  closeMenu,
}) => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [favoritesVisible, setFavoritesVisible] = useState(false);

  if (searchVisible) {
    return <SearchMenu closeSearch={() => setSearchVisible(false)} />;
  }

  if (favoritesVisible) {
    return <FavoritesMenu closeFavorites={() => setFavoritesVisible(false)} />;
  }

  return (
    isVisible && (
      <TouchableWithoutFeedback onPress={closeMenu}>
        <Animated.View
          style={[
            styles.menuDropdown,
            {
              transform: [
                {
                  translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-300, 0],
                  }),
                },
              ],
              opacity: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
            },
          ]}
        >
          <TouchableWithoutFeedback onPress={() => setSearchVisible(true)}>
            <Text style={styles.menuItem}>Search</Text>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => setFavoritesVisible(true)}>
            <Text style={styles.menuItem}>Favorites</Text>
          </TouchableWithoutFeedback>
          <Link href="/map" style={styles.menuItem}>
            Map
          </Link>
          <Text style={styles.menuItem}>Account</Text>
          <Text style={styles.menuItem}>Settings</Text>
        </Animated.View>
      </TouchableWithoutFeedback>
    )
  );
};

const styles = StyleSheet.create({
  menuDropdown: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "auto",
    backgroundColor: "#1E1E1E",
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) + 30 : 80,
    zIndex: 999,
  },
  menuItem: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 6,
    padding: 6,
  },
});

export default DropdownMenu;
