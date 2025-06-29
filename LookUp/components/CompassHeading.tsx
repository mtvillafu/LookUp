import React, { useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { Accelerometer } from 'expo-sensors';
import { useCompassHeading } from '@/hooks/useCompassHeading';

export default function CompassHeading() {
  const { rawHeading, pitch } = useCompassHeading();

  return (
    <View style={styles.container}>
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