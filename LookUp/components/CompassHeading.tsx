import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import * as Location from 'expo-location';

export default function CompassHeading() {
  const [heading, setHeading] = useState<number | null>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setHeading(null);
        return;
      }
      subscription = await Location.watchHeadingAsync((data) => {
        setHeading(data.trueHeading ?? data.magHeading);
      });
    })();

    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {heading !== null ? `${heading.toFixed(0)}°` : 'N/A'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 24, color: '#fff' },
});