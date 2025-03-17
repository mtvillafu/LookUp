import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

export default function MapScreen() {
  // default to false for mixed reality mode initially for easier load on phones
  const [isMixedReality, setIsMixedReality] = useState(false);
  
  // Uses the built-in permission hook from expo-camera for camera usage
  const [permission, requestPermission] = useCameraPermissions(); 
  
  // set the default camera to the back camera.
  const [facing, setFacing] = useState<CameraType>('back'); 

  const toggleMode = () => setIsMixedReality(!isMixedReality); // function for button to swap between camera and MxR

  // thinking:
  // 1. check if we have permission to use the camera
  // 2. if we do, show the camera view
  // 3. if we don't, show a message saying we need permission, and display a holding screen
  // 4. if we are in MxR mode, and they press the button, switch to map mode, with map placeholder view.
  return (
    <View style={styles.container}>
      // 1.
      {isMixedReality ? ( 
        permission?.status === 'granted' ? (
          
          // 2.
          <CameraView style={styles.camera}> 
            {/* Camera Mode */} 
          </CameraView>
        ) : 
        // 3.
        (
          <View style={styles.permissionContainer}> 
            <Text>No access to camera</Text>
            <Button title="Grant Permission" onPress={requestPermission} />
          </View>
        )
      ) : (
        <View style={styles.mapContainer}>
          {/* Map Mode */}
          <Text style={styles.placeholderText}>Map Placeholder</Text>
        </View>
      )}

      {/* Ensure the button is ALWAYS in the same place, regardless of the mode */}
      <View style={styles.buttonContainer}>
        <Button
          title={isMixedReality ? 'Switch to Map' : 'Switch to Mixed Reality'} // 4.
          onPress={toggleMode}
        />
      </View>
    </View>
  );
}

// general styles
const styles = StyleSheet.create({
  container: 
    { 
      flex: 1 
    },
  mapContainer: 
    { 
      // make map view take up whole screen
      flex: 1, 
      backgroundColor: '#d0e0f0', 
      justifyContent: 'center', 
      alignItems: 'center' 
    },
  placeholderText: 
  { 
    fontSize: 20, 
    color: '#555' 
  },
  camera: 
  { 
    // make camera view take up whole screen
    flex: 1 
  },
  overlay: 
  { 
    position: 'absolute', 
    bottom: 50, 
    alignSelf: 'center', 
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    padding: 10, 
    borderRadius: 5 
  },
  permissionContainer: 
  { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  buttonContainer: {
    position: 'absolute',
    bottom: '10%', // Adjusts based on screen size (avoids navigation bar issues)
    left: 0,
    right: 0,
    alignItems: 'center', // Centers button horizontally
  },
});
