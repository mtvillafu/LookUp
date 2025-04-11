import React, { useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Slider from '@react-native-community/slider';

// to prevent highlighting text on drag of the slider on the page.
import { TapGestureHandler } from 'react-native-gesture-handler';

export default function SettingsScreen() {
  // toggles and setting variables for settings screen
  // Determines how far away flights the user is notified for, default to 10 miles.
  const [flightRadius, setFlightRadius] = useState(10); 

  // general darkmode toggle just in case we want it later on
  const [darkMode, setDarkMode] = useState(false);

  // toggle notifications for the user, if they want to recieve them or not.
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const maxDetectionRange = 25; // max range for the slider, 25 miles

  // little color change action for the slider
  const getInterpolatedColor = (value: number) => {
    const t = (value - 1) / (maxDetectionRange - 1); // normalize color from 1 to the max detection range.
    const r = Math.round(0 + t * (255 - 0)); // Red Channel
    const g = Math.round(122 - t * 122); // Green Channel
    const b = Math.round(255 - t * 255); // Blue Channel

    return `rgb(${r},${g},${b})`;
  };

  return (
    <View style= {styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Settings</ThemedText>
      </ThemedView>

      {/* Section: Appearance */}
      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Appearance</ThemedText>
        <View style={styles.item}>
          <ThemedText>Dark Mode</ThemedText>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
          />
        </View>
      </View>

      {/* Section: Notifications */}
      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Notifications</ThemedText>
        <View style={styles.item}>
          <ThemedText>Flight Alerts</ThemedText>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
        </View>
      </View>

      {/* Section: Flight Detection Radius For Alerts */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Flight Detection Radius</ThemedText>
          <ThemedText style={{ marginBottom: 12 }}>
            Set how far (in miles) to passively scan for nearby flights:
          </ThemedText>

          <ThemedText style={{ marginBottom: 8 }}>Radius: {flightRadius} miles</ThemedText>

          {/* Slider logic, this is basically just ripped directly from the documentation */}
          {/* Define Lower / upper bounds, step and color data */}
          <TapGestureHandler onActivated={() => {}}>
            <Slider
              value={flightRadius}
              onValueChange={setFlightRadius}
              minimumValue={1}
              maximumValue={maxDetectionRange}
              step={1}
              style={{ width: '100%' }}
              minimumTrackTintColor={getInterpolatedColor(flightRadius)} // turn the slider color to the left to color based on position
              maximumTrackTintColor="#ccc"
              thumbTintColor={getInterpolatedColor(flightRadius)}
            />
          </TapGestureHandler>
          <ThemedText style={{ marginTop: 12, color: getInterpolatedColor(flightRadius), fontWeight: '600' }}>
            WARNING: GREATER DETECTION RADIUS MAY INCREASE QUERY TIME
          </ThemedText>
        </View>

      {/* Section: About */}
      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>About</ThemedText>
        <View style={styles.item}>
          <ThemedText>Version</ThemedText>
          <ThemedText type="defaultSemiBold">Development Build - Semester 1</ThemedText>
        </View>
        <View style={styles.item}>
          <ThemedText>Developers</ThemedText>
          <ThemedText type="defaultSemiBold">L10 - Look Up Dev Team</ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 40,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    overflowX: 'hidden',
    overflowY: 'scroll',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: '600',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
});
