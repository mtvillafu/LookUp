import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; // Import useRouter for navigation

const FlightDetails = () => {
    const router = useRouter(); // Initialize router for navigation

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => router.push('/')} // Navigate back to the tabs
                >
                    <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Flight #1290</Text>
                <TouchableOpacity style={styles.favoriteButton}>
                    <Text style={styles.star}>⭐</Text>
                </TouchableOpacity>
            </View>

            {/* Origin Section */}
            <View style={styles.section}>
                <Text style={styles.label}>Origin:</Text>
                <View style={styles.row}>
                    <Text style={styles.value}>Osaka, Japan</Text>
                    <Image
                        source={{ uri: 'https://flagcdn.com/w320/jp.png' }}
                        style={styles.flag}
                    />
                </View>
                <Text style={styles.subValue}>Est Departure: 18:30 EST</Text>
                <Text style={styles.subValue}>From Gate: A63</Text>
            </View>

            {/* Destination Section */}
            <View style={styles.section}>
                <Text style={styles.label}>Destination:</Text>
                <View style={styles.row}>
                    <Text style={styles.value}>New York, New York</Text>
                    <Image
                        source={{ uri: 'https://flagcdn.com/w320/us.png' }}
                        style={styles.flag}
                    />
                </View>
                <Text style={styles.subValue}>Est Arrival: 04:30 EST</Text>
                <Text style={styles.subValue}>To Gate: A65</Text>
            </View>

            {/* Status Section */}
            <View style={styles.section}>
                <Text style={styles.label}>Status:</Text>
                <View style={styles.statusContainer}>
                    <Text style={styles.status}>On Time</Text>
                </View>
                <Text style={styles.subValue}>Current Height: xxxxFT</Text>
                <Text style={styles.subValue}>Current Speed: xxxxMPH</Text>
                <Text style={styles.subValue}>Total Distance: xxxxMi</Text>
            </View>

            {/* Aircraft Info Section */}
            <View style={styles.section}>
                <Text style={styles.label}>Air Craft Info:</Text>
                <Text style={styles.subValue}>Airline: Delta</Text>
                <Text style={styles.subValue}>Type: BOEING 767-300 (twin-jet)</Text>
                <Text style={styles.subValue}>Year: 1999</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1E1E',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        paddingVertical: 55,
        paddingHorizontal: 20,
        zIndex: 999,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    favoriteButton: {
        padding: 10,
    },
    star: {
        fontSize: 24,
        color: '#FFD700',
    },
    closeButton: {
        padding: 10,
    },
    closeText: {
        fontSize: 24,
        color: '#fff',
    },
    section: {
        backgroundColor: '#333',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    label: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    value: {
        fontSize: 18,
        color: '#fff',
        flex: 1,
    },
    subValue: {
        fontSize: 18,
        color: '#ccc',
        marginTop: 5,
    },
    flag: {
        width: 40,
        height: 25,
        marginLeft: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    statusContainer: {
        backgroundColor: 'green',
        padding: 8,
        borderRadius: 5,
        marginTop: 5,
        alignSelf: 'flex-start',
    },
    status: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
});

export default FlightDetails;