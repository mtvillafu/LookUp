import React, { useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { Accelerometer } from 'expo-sensors';


function getPitch(x: number, y: number, z: number) {
  // 0° = flat (screen up), +90° = vertical (top edge up)
  const pitchRad = Math.atan2(y, Math.sqrt(x * x + z * z));
  let pitchDeg = (pitchRad * 180) / Math.PI;
  // Clamp pitch to [-120, 120] degrees to avoid 180° flips
  // if (pitchDeg > 120) pitchDeg = 120;
  // if (pitchDeg < -120) pitchDeg = -120;
  return pitchDeg;
}

export default function CompassHeading() {
  const [rawHeading, setRawHeading] = useState<number | null>(null);
  const [pitch, setPitch] = useState<number>(0);
  const [displayHeading, setDisplayHeading] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [headingObj, setHeadingObj] = useState<Location.LocationHeadingObject | null>(null);

  // Track if we're currently locked
  const wasLocked = useRef(false);

  useEffect(() => {
    let headingSubscription: Location.LocationSubscription | null = null;
    let accelSub: any = null;

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setRawHeading(null);
        return;
      }
      headingSubscription = await Location.watchHeadingAsync((data) => {
        setHeadingObj(data);
        setRawHeading(data.trueHeading ?? data.magHeading);
      });

      accelSub = Accelerometer.addListener(({ x, y, z }) => {
        const newPitch = getPitch(x, y, z);
        setPitch(newPitch);

        // Lock if pitch crosses ±50°
        if (!wasLocked.current && Math.abs(newPitch) > 50) {
          setIsLocked(true);
          wasLocked.current = true;
        }
        // Unlock if pitch returns to less than ±50°
        if (wasLocked.current && Math.abs(newPitch) <= 50) {
          setIsLocked(false);
          wasLocked.current = false;
        }
      });
      Accelerometer.setUpdateInterval(50);
    })();

    return () => {
      if (headingSubscription) headingSubscription.remove();
      if (accelSub) accelSub.remove();
    };
  }, []);

  // Lock the display heading when locked, otherwise update live
  useEffect(() => {
    if (isLocked) {
      setDisplayHeading((prev) => (prev === null ? rawHeading : prev));
    } else {
      setDisplayHeading(rawHeading);
    }
  }, [isLocked, rawHeading]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {displayHeading !== null
          ? `${displayHeading.toFixed(0)}°${isLocked ? ' (locked)' : ''}`
          : 'N/A'}
      </Text>
      <Text style={styles.pitchText}>Pitch: {pitch.toFixed(1)}°</Text>
      <Text style={styles.pitchText}>
        Unlocked (offset 180°):{' '}
        {rawHeading !== null
          ? `${((rawHeading + 180) % 360).toFixed(0)}°`
          : 'N/A'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 24, color: '#fff' },
  pitchText: { fontSize: 14, color: '#aaa', marginTop: 4 },
});