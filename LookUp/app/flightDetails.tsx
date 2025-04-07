import React from 'react';
import { View, StyleSheet } from 'react-native'; // Import StyleSheet
import FlightDetails from '../components/FlightDetails';

const App: React.FC = () => {
    return (
        <View style={styles.container}>
            <FlightDetails />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, // Make the View take up the entire screen
    },
});

export default App;