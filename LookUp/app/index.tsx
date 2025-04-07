import { Redirect } from 'expo-router';

// Expo expects a index file in the root of the app directory.
// This file is used to redirect the user to the map screen.
export default function Index() {
  return <Redirect href="/map" />;
}