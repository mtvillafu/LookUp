import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export interface FlightCardProps {
  ident: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  airline: string;
  onPress: () => void;
}

const FlightCard: React.FC<FlightCardProps> = ({
  ident,
  origin,
  destination,
  departureTime,
  arrivalTime,
  airline,
  onPress,
}) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={styles.row}>
      <Text style={styles.ident}>{ident}</Text>
      <Text style={styles.airline}>{airline}</Text>
    </View>
    <Text style={styles.route}>
      {origin} → {destination}
    </Text>
    <View style={styles.times}>
      <Text style={styles.time}>{new Date(departureTime).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}</Text>
      <Text style={styles.time}>{new Date(arrivalTime).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#2A2A2A",
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ident: { color: "white", fontSize: 16, fontWeight: "bold" },
  airline: { color: "#ccc", fontSize: 14 },
  route: { color: "white", marginTop: 5 },
  times: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  time: { color: "white" },
});

export default FlightCard;
