import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import { BlurView } from 'expo-blur';

// Get the screen width
const screenWidth = Dimensions.get('window').width;
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useBouncingBox } from '@/hooks/useBouncingBox'; // bouncing red box for debugging overlays

export default function MapScreen() {

  // Default to false for mixed reality mode iniitally for load on phones
  const [isMixedReality, setIsMixedReality] = useState(false);

  // uses the built-in permission hook from expo-camera for camera usage
  const [permission, requestPermission] = useCameraPermissions();

  // set the default camera facing to back
  const [facing, setFacing] = useState<CameraType>('back');

  // Function for button to swap between camera and MxR
  const toggleMode = () => setIsMixedReality(!isMixedReality);

  // Call our hook for the placeholder bouncing box
  // in the final version, this will wrap around planes in the MxR view, and change size dynamically
  const bouncingPosition = useBouncingBox(240); // (size: 240)

  // get the screen width
  const [placement, setPlacement] = useState<'left' | 'right'>('right');

  // Tooltip Init
  const tooltipOffset = useRef(new Animated.Value(250)).current; // default on the right side
  const lastSide = useRef<'left' | 'right'>('right'); // track last position of tooltip

  // Edge detection listener for tooltip. If the box is on the left side, move the tooltip to the right, and vice versa.
  useEffect(() => {
    const listenerId = bouncingPosition.x.addListener(({ value }) => {
      if (value > screenWidth - 450 && lastSide.current !== 'left') {
        lastSide.current = 'left';
        Animated.timing(tooltipOffset, {
          toValue: -250, // flip to left
          duration: 200,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: false,
        }).start();
      } else if (value < 240 && lastSide.current !== 'right') {
        lastSide.current = 'right';
        Animated.timing(tooltipOffset, {
          toValue: 250, // flip to right
          duration: 200,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: false,
        }).start();
      }
    });
  
    return () => {
      bouncingPosition.x.removeListener(listenerId);
    };
  }, []);

  // ========================= CAMERA DISPLAY && CONTROL: =========================
  // 1. check if we have permission to use the camera
  // 2. if we do, show the camera view
  // 2a. if we're on camera view, show the bouncing box
  // 3. if we don't, show a message saying we need permission, and display a holding screen
  // 4. if we are in MxR mode, and they press the button, switch to map mode, with map placeholder view.
  return (
    <View style={styles.container}>
      {isMixedReality ? (
        permission?.status === 'granted' ? ( // 1. If we're in MxR and we have permission to use the camera, show the camera view
          <>
            <CameraView style={styles.camera} />
              <Animated.View
                style={[
                  styles.redBox,
                  {
                    transform: bouncingPosition.getTranslateTransform(),
                  },
                ]}
              />
              <Animated.View
              style={[
                styles.infoBubble,
                {
                  top: Animated.add(bouncingPosition.y, new Animated.Value(10)),

                  // Position the tooltip relative to the box’s X
                  left: Animated.add(bouncingPosition.x, tooltipOffset),
                },
              ]}
            >
              <BlurView intensity={50} tint="dark" style={styles.flightCard}>
                <Text style={styles.flightTitle}>Flight 12812 ⭐</Text>
                <Text style={styles.route}>JP → NY</Text>
                <Text style={styles.arrival}>Estimated Arrival: 8:00PM EST</Text>
                <View style={styles.detailsButton}>
                  <Text style={styles.detailsText}>See details</Text>
                </View>
              </BlurView>
            </Animated.View>
          </>
        ) : (
          <View style={styles.permissionContainer}>
            {/* 3. If we don't have permission, show a message and a button to request permission */}
            <Text>No access to camera</Text>  
            <Button title="Grant Permission" onPress={requestPermission} /> 
          </View>
        )
      ) : (
        <View style={styles.mapContainer}>
          {/* 4. If we're not in MxR mode, show the map placeholder */}
          <Text style={styles.placeholderText}>Map Placeholder</Text>
        </View>
      )}

      {/* Button to toggle between modes, we ensure that it's always in the same place, regardless of mode. */}
      <View style={styles.buttonContainer}>
        <Button
          title={isMixedReality ? 'Switch to Map' : 'Switch to Mixed Reality'} // if we're in MxR, show the map button, otherwise show the MxR button
          onPress={toggleMode}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#d0e0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: { 
    fontSize: 20, 
    color: '#555' 
  },
  camera: { 
    flex: 1 
  },
  permissionContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  buttonContainer: {
    position: 'absolute',
    bottom: '10%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  redBox: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderColor: 'red',
    borderWidth: 3,
    borderRadius: 8,
    backgroundColor: 'transparent',
    zIndex: 99,
  },
  infoBubble: {
    position: 'absolute',
    zIndex: 100,
  },
  flightCard: {
    borderRadius: 16,
    overflow: 'hidden', // required for BlurView to respect borders
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.21)',
    backgroundColor: 'rgba(255, 255, 255, 0.27)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 8, // Android shadow
    padding: 16,
    zIndex: 99,
  },
  flightTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  route: {
    color: 'white',
    fontSize: 16,
    marginBottom: 4,
  },
  arrival: {
    color: '#eee',
    fontSize: 14,
    marginBottom: 8,
  },
  detailsButton: {
    backgroundColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: 'center',
  },
  detailsText: {
    color: '#000',
    fontWeight: '600',
  },
  
});
