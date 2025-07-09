// app/flightDetails.tsx

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
 
type Params = {
  ident?: string;
  origin?: string;
  destination?: string;
  departureTime?: string;
  arrivalTime?: string;
  airline?: string;
};

// Map of IATA airport codes to ISO 3166-1 alpha-2 country codes
const AIRPORT_TO_COUNTRY: Record<string, string> = {
  JFK: "us",
  LAX: "us",
  LHR: "gb",
  SFO: "us",
  ATL: "us",
  ORD: "us",
  MIA: "us",
  SEA: "us",
  DAL: "us",
  HOU: "us",
  CDG: "fr",
  FRA: "de",
  DXB: "ae",
  SYD: "au",
  AKL: "nz",
  NRT: "jp",
  // add more mappings as needed...
};

const FlightDetails: React.FC = () => {
  const router = useRouter();
  const {
    ident,
    origin,
    destination,
    departureTime,
    arrivalTime,
    airline,
  } = useLocalSearchParams<Params>();

  // Helper to format ISO time strings
  const fmtTime = (iso?: string) =>
    iso
      ? new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "—";

  // Get country code from airport IATA
  const originCountry = origin ? AIRPORT_TO_COUNTRY[origin.toUpperCase()] : undefined;
  const destCountry = destination ? AIRPORT_TO_COUNTRY[destination.toUpperCase()] : undefined;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Flight #{ident ?? "—"}</Text>
        <View style={styles.spacer} />
      </View>

      {/* Origin */}
      <View style={styles.section}>
        <Text style={styles.label}>Origin</Text>
        <View style={styles.row}>
          <Text style={styles.value}>{origin ?? "—"}</Text>
          {originCountry && (
            <Image
              source={{ uri: `https://flagcdn.com/w80/${originCountry}.png` }}
              style={styles.flag}
            />
          )}
        </View>
        <Text style={styles.subValue}>
          Est. Departure: {fmtTime(departureTime)}
        </Text>
      </View>

      {/* Destination */}
      <View style={styles.section}>
        <Text style={styles.label}>Destination</Text>
        <View style={styles.row}>
          <Text style={styles.value}>{destination ?? "—"}</Text>
          {destCountry && (
            <Image
              source={{ uri: `https://flagcdn.com/w80/${destCountry}.png` }}
              style={styles.flag}
            />
          )}
        </View>
        <Text style={styles.subValue}>
          Est. Arrival: {fmtTime(arrivalTime)}
        </Text>
      </View>

      {/* Status */}
      <View style={styles.section}>
        <Text style={styles.label}>Status</Text>
        <View style={styles.statusContainer}>
          <Text style={styles.status}>On Time</Text>
        </View>
      </View>

      {/* Airline */}
      <View style={styles.section}>
        <Text style={styles.label}>Airline</Text>
        <Text style={styles.subValue}>{airline ?? "—"}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    paddingVertical: 55,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  closeButton: {
    padding: 10,
  },
  closeText: {
    color: "#fff",
    fontSize: 24,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  spacer: {
    width: 34,
  },
  section: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  label: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  value: {
    color: "#fff",
    fontSize: 18,
  },
  subValue: {
    color: "#ccc",
    fontSize: 16,
    marginTop: 5,
  },
  statusContainer: {
    backgroundColor: "green",
    padding: 8,
    borderRadius: 5,
    alignSelf: "flex-start",
    marginTop: 5,
  },
  status: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  flag: {
    width: 40,
    height: 25,
    marginLeft: 10,
    borderRadius: 3,
  },
});

export default FlightDetails;
