// app/favorites.tsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
  ActionSheetIOS,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLoginModal } from "@/context/LoginModalContext";
import { useRouter } from "expo-router";
import FlightCard from "../../components/FlightCard";

interface FavoriteProps {
  closeSearch?: () => void;
}

const TIME_RANGES = [
  { label: "Morning (00:00 - 12:00)", value: "morning" },
  { label: "Afternoon (12:00 - 18:00)", value: "afternoon" },
  { label: "Evening (18:00 - 23:59)", value: "evening" },
];

// Replace this with your real favorites store/API when ready
const initialFavorites = [
  { id: "1", ident: "AA1234", origin: "JFK", destination: "LAX", departureTime: "2025-06-24T06:15:00Z", arrivalTime: "2025-06-24T09:45:00Z", airline: "American Airlines" },
  { id: "2", ident: "BA5678", origin: "LHR", destination: "SFO", departureTime: "2025-06-24T11:00:00Z", arrivalTime: "2025-06-24T14:30:00Z", airline: "British Airways" },
  { id: "3", ident: "DL9876", origin: "ATL", destination: "ORD", departureTime: "2025-06-24T13:30:00Z", arrivalTime: "2025-06-24T15:00:00Z", airline: "Delta Airlines" },
  { id: "4", ident: "UA2468", origin: "MIA", destination: "SEA", departureTime: "2025-06-24T17:45:00Z", arrivalTime: "2025-06-24T21:15:00Z", airline: "United Airlines" },
  { id: "5", ident: "SW1122", origin: "DAL", destination: "HOU", departureTime: "2025-06-24T07:50:00Z", arrivalTime: "2025-06-24T08:50:00Z", airline: "Southwest" },
  { id: "6", ident: "AF3344", origin: "CDG", destination: "JFK", departureTime: "2025-06-24T19:05:00Z", arrivalTime: "2025-06-24T22:30:00Z", airline: "Air France" },
  { id: "7", ident: "LH7788", origin: "FRA", destination: "LAX", departureTime: "2025-06-24T05:00:00Z", arrivalTime: "2025-06-24T08:30:00Z", airline: "Lufthansa" },
  { id: "8", ident: "EK9999", origin: "DXB", destination: "SYD", departureTime: "2025-06-24T22:15:00Z", arrivalTime: "2025-06-25T06:45:00Z", airline: "Emirates" },
  { id: "9", ident: "QF4321", origin: "SYD", destination: "AKL", departureTime: "2025-06-24T14:20:00Z", arrivalTime: "2025-06-24T19:00:00Z", airline: "Qantas" },
  { id: "10", ident: "JL5566", origin: "NRT", destination: "SFO", departureTime: "2025-06-24T09:00:00Z", arrivalTime: "2025-06-24T17:00:00Z", airline: "Japan Airlines" },
];

const FavoritesMenu: React.FC<FavoriteProps> = () => {
  const { showLoginModal } = useLoginModal();
  const router = useRouter();

  // filter/search state
  const [searchQuery, setSearchQuery] = useState("");
  const [filtered, setFiltered] = useState(initialFavorites);
  const [modalVisible, setModalVisible] = useState(false);

  // advanced filter state
  const [originFilter, setOriginFilter] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("");
  const [airlineFilter, setAirlineFilter] = useState("");
  const [departureRange, setDepartureRange] = useState("");
  const [arrivalRange, setArrivalRange] = useState("");

  // whenever anything changes, re-run filter logic
  useEffect(() => {
    const s = searchQuery.toLowerCase();

    const result = initialFavorites.filter((f) => {
      const ms =
        f.ident.toLowerCase().includes(s) ||
        f.origin.toLowerCase().includes(s) ||
        f.destination.toLowerCase().includes(s);

      const mo = f.origin.toLowerCase().includes(originFilter.toLowerCase());
      const md = f.destination
        .toLowerCase()
        .includes(destinationFilter.toLowerCase());
      const ma = f.airline.toLowerCase().includes(airlineFilter.toLowerCase());

      const depHr = new Date(f.departureTime).getHours();
      const arrHr = new Date(f.arrivalTime).getHours();

      const inRange = (rng: string, hr: number) => {
        if (!rng) return true;
        if (rng === "morning") return hr >= 0 && hr < 12;
        if (rng === "afternoon") return hr >= 12 && hr < 18;
        if (rng === "evening") return hr >= 18 && hr <= 23;
        return true;
      };

      return (
        ms &&
        mo &&
        md &&
        ma &&
        inRange(departureRange, depHr) &&
        inRange(arrivalRange, arrHr)
      );
    });

    setFiltered(result);
  }, [
    searchQuery,
    originFilter,
    destinationFilter,
    airlineFilter,
    departureRange,
    arrivalRange,
  ]);

  const showTimeRangePicker = (
    title: string,
    setter: (v: string) => void
  ) => {
    const options = TIME_RANGES.map((t) => t.label).concat("Cancel");
    ActionSheetIOS.showActionSheetWithOptions(
      { title, options, cancelButtonIndex: options.length - 1 },
      (idx) => {
        if (idx < TIME_RANGES.length) setter(TIME_RANGES[idx].value);
      }
    );
  };

  return (
    <View style={styles.container}>
      {/* title + login */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Favorites</Text>
        <TouchableOpacity
          style={styles.userButton}
          onPress={showLoginModal}
        >
          <Ionicons name="person" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* search + filter button */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Search Favorites"
          placeholderTextColor="#ccc"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="options-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* list */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FlightCard
            ident={item.ident}
            origin={item.origin}
            destination={item.destination}
            departureTime={item.departureTime}
            arrivalTime={item.arrivalTime}
            airline={item.airline}
            onPress={() =>
              router.push({
                pathname: "/flightDetails",
                params: { ...item },
              })
            }
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No favorites found.</Text>
        }
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
      />

      {/* advanced filter modal */}
      <Modal
        animationType="slide"
        transparent
        presentationStyle="overFullScreen"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.filterTitle}>Advanced Filters</Text>

            <TextInput
              style={styles.filterInput}
              placeholder="Filter by Origin"
              placeholderTextColor="#ccc"
              value={originFilter}
              onChangeText={setOriginFilter}
            />

            <TextInput
              style={styles.filterInput}
              placeholder="Filter by Destination"
              placeholderTextColor="#ccc"
              value={destinationFilter}
              onChangeText={setDestinationFilter}
            />

            <TextInput
              style={styles.filterInput}
              placeholder="Filter by Airline"
              placeholderTextColor="#ccc"
              value={airlineFilter}
              onChangeText={setAirlineFilter}
            />

            <Text style={styles.filterSubtitle}>Departure Time Range</Text>
            <Pressable
              style={styles.selectInput}
              onPress={() =>
                showTimeRangePicker(
                  "Select Departure Range",
                  setDepartureRange
                )
              }
            >
              <Text
                style={
                  departureRange
                    ? styles.selectedText
                    : styles.placeholderText
                }
              >
                {departureRange
                  ? TIME_RANGES.find((t) => t.value === departureRange)!.label
                  : "Select Departure Time Range"}
              </Text>
            </Pressable>

            <Text style={styles.filterSubtitle}>Arrival Time Range</Text>
            <Pressable
              style={styles.selectInput}
              onPress={() =>
                showTimeRangePicker("Select Arrival Range", setArrivalRange)
              }
            >
              <Text
                style={
                  arrivalRange
                    ? styles.selectedText
                    : styles.placeholderText
                }
              >
                {arrivalRange
                  ? TIME_RANGES.find((t) => t.value === arrivalRange)!.label
                  : "Select Arrival Time Range"}
              </Text>
            </Pressable>

            <Pressable
              style={styles.clearButton}
              onPress={() => {
                setOriginFilter("");
                setDestinationFilter("");
                setAirlineFilter("");
                setDepartureRange("");
                setArrivalRange("");
              }}
            >
              <Text style={styles.clearButtonText}>Clear Filters</Text>
            </Pressable>

            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  titleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  userButton: {
    position: "absolute",
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    color: "white",
    fontSize: 16,
    paddingHorizontal: 10,
  },
  filterButton: {
    marginLeft: 10,
  },
  emptyText: {
    color: "white",
    textAlign: "center",
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 20,
    overflow: "visible",
  },
  filterTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  filterSubtitle: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
  },
  filterInput: {
    backgroundColor: "#555",
    color: "white",
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  selectInput: {
    backgroundColor: "#555",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  placeholderText: {
    color: "#ccc",
    fontSize: 16,
  },
  selectedText: {
    color: "white",
    fontSize: 16,
  },
  clearButton: {
    borderColor: "white",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  clearButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
    alignItems: "center",
  },
  closeButtonText: {
    color: "black",
    fontWeight: "bold",
  },
});

export default FavoritesMenu;
