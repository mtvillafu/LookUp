import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import MenuButton from "../components/MenuButton";
import DropdownMenu from "../components/DropdownMenu";

export default function HomeScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const menuAnimation = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    if (menuVisible) {
      Animated.timing(menuAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      Animated.timing(menuAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => menuVisible && toggleMenu()}>
      <View style={styles.container}>
        {menuVisible && (
          <DropdownMenu
            isVisible={menuVisible}
            animation={menuAnimation}
            closeMenu={toggleMenu}
          />
        )}

        <MenuButton onPress={toggleMenu} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    opacity: 0.76,
  },
});
