import { useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { Accelerometer } from 'expo-sensors';

function getPitch(x: number, y: number, z: number) {
  const pitchRad = Math.atan2(y, Math.sqrt(x * x + z * z));
  return (pitchRad * 180) / Math.PI;
}

export function useCompassHeading() {
  const [rawHeading, setRawHeading] = useState<number | null>(null);
  const [pitch, setPitch] = useState<number>(0);

  const headingSubscription = useRef<Location.LocationSubscription | null>(null);
  const accelSubscription = useRef<any>(null);

  async function startCompass() {
    // request permission
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;

    // watch heading
    headingSubscription.current = await Location.watchHeadingAsync((data) =>
      setRawHeading(data.trueHeading ?? data.magHeading)
    );

    // watch pitch
    accelSubscription.current = Accelerometer.addListener(({ x, y, z }) => {
      setPitch(getPitch(x, y, z));
    });
    Accelerometer.setUpdateInterval(50);
  }

  function stopCompass() {
    headingSubscription.current?.remove();
    accelSubscription.current?.remove();
    headingSubscription.current = null;
    accelSubscription.current = null;
  }

  // Optionally, remove old effect with [], so it doesn’t run automatically.

  return {
    rawHeading,
    pitch,
    startCompass,
    stopCompass
  };
}