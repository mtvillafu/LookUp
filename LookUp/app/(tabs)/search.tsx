// app/search.tsx

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
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router"; // Import useRouter for navigation

import FlightCard from "../../components/FlightCard";
import { useFlights, Flight } from "../../hooks/useFlights";

const DEFAULT_BOUNDS = "50.682,46.218,14.422,22.243";  // your region

const TIME_RANGES = [
  { label: "Morning (00:00 - 12:00)", value: "morning" },
  { label: "Afternoon (12:00 - 18:00)", value: "afternoon" },
  { label: "Evening (18:00 - 23:59)", value: "evening" },
];

const Search: React.FC = () => {
  const router = useRouter();

  const { flightNumber } = useLocalSearchParams();

  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState(
    typeof flightNumber === "string" ? flightNumber : ""
  );

  // advanced filters
  const [originFilter, setOriginFilter] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("");
  const [airlineFilter, setAirlineFilter] = useState("");
  const [departureRange, setDepartureRange] = useState("");
  const [arrivalRange, setArrivalRange] = useState("");

  // Always fetch by bounds
  const { data: flights, loading, error, refetch } = useFlights({ bounds: DEFAULT_BOUNDS }, 60000)

  // Now do ALL filtering client-side:
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  useEffect(() => {
    const s = searchQuery.toLowerCase().trim();

    setFilteredFlights(
      flights.filter((f) => {
        // 1) flight-number/origin/dest text search
        const matchesSearch =
          f.ident.toLowerCase().includes(s) ||
          f.origin.toLowerCase().includes(s) ||
          f.destination.toLowerCase().includes(s);

        // 2) advanced text filters
        const mo = f.origin
          .toLowerCase()
          .includes(originFilter.toLowerCase());
        const md = f.destination
          .toLowerCase()
          .includes(destinationFilter.toLowerCase());
        const ma = f.airline
          .toLowerCase()
          .includes(airlineFilter.toLowerCase());

        // 3) time‐of‐day filters
        const depHr = new Date(f.departureTime).getHours();
        const arrHr = new Date(f.arrivalTime).getHours();
        const inRange = (rng: string, hr: number) => {
          if (!rng) return true;
          if (rng === "morning") return hr < 12;
          if (rng === "afternoon") return hr >= 12 && hr < 18;
          if (rng === "evening") return hr >= 18;
          return true;
        };

        return (
          matchesSearch &&
          mo &&
          md &&
          ma &&
          inRange(departureRange, depHr) &&
          inRange(arrivalRange, arrHr)
        );
      })
    );
  }, [
    flights,
    searchQuery,
    originFilter,
    destinationFilter,
    airlineFilter,
    departureRange,
    arrivalRange,
  ]);

  const showTimeRangePicker = (title: string, setter: (v: string) => void) => {
    const options = TIME_RANGES.map((r) => r.label).concat("Cancel");
    ActionSheetIOS.showActionSheetWithOptions(
      { title, options, cancelButtonIndex: options.length - 1 },
      (idx) => {
        if (idx < TIME_RANGES.length) setter(TIME_RANGES[idx].value);
      }
    );
  };

  // Default to use the state for the input if the flightNumber is defined
  const [searchValue, setSearchValue] = useState(flightNumber ?? "");  

  // if the parameter changes (navigating to this screen), update the input
  useEffect(() => {
    if (typeof flightNumber === "string") setSearchQuery(flightNumber);
  }, [flightNumber]);

  return (
    <View style={styles.container}>
      {/* header */}
      <Text style={styles.title}>Search</Text>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Search Flight #, Origin, Dest…"
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

      {/* list with pull-to-refresh */}
      <FlatList
        data={filteredFlights}
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
        ListEmptyComponent={() => {
          if (loading)
            return <ActivityIndicator color="white" style={{ margin: 20 }} />;
          if (error)
            return (
              <Text style={styles.errorText}>
                Error loading flights. Pull down to retry.
              </Text>
            );
          return (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No flights match your filters.{'\n'}
                Pull down to refresh.
              </Text>
            </View>
          );
        }}
        refreshing={loading}
        onRefresh={refetch}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
      />

      {/* advanced filters modal */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        presentationStyle="overFullScreen"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.filterTitle}>Advanced Filters</Text>

            <TextInput
              style={styles.filterInput}
              placeholder="Origin"
              placeholderTextColor="#ccc"
              value={originFilter}
              onChangeText={setOriginFilter}
            />

            <TextInput
              style={styles.filterInput}
              placeholder="Destination"
              placeholderTextColor="#ccc"
              value={destinationFilter}
              onChangeText={setDestinationFilter}
            />

            <TextInput
              style={styles.filterInput}
              placeholder="Airline"
              placeholderTextColor="#ccc"
              value={airlineFilter}
              onChangeText={setAirlineFilter}
            />

            <Text style={styles.filterSubtitle}>Departure Time Range</Text>
            <Pressable
              style={styles.selectInput}
              onPress={() =>
                showTimeRangePicker("Select Departure Range", setDepartureRange)
              }
            >
              <Text
                style={
                  departureRange ? styles.selectedText : styles.placeholderText
                }
              >
                {departureRange
                  ? TIME_RANGES.find((r) => r.value === departureRange)!.label
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
                  arrivalRange ? styles.selectedText : styles.placeholderText
                }
              >
                {arrivalRange
                  ? TIME_RANGES.find((r) => r.value === arrivalRange)!.label
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

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    paddingTop: 55,
    paddingHorizontal: 20,
  },
  title: {
    color: "white",
    textAlign: "center",
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: "#ccc",
    textAlign: "center",
    fontSize: 16,
  },
  errorText: {
    color: "red",
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
export default SearchMenu;

// ================================== ROUTES SEARCH ==================================
// Temp source and destination airports, replace with user input
// const source = 'MCO';
// const destination = 'JFK';

// fetch(
//   `https://fr24api.flightradar24.com/api/live/flight-positions/full?routes=${source}-${destination}`,
//   {
//     method: 'GET',
//     headers: {
//       'Accept': 'application/json',
//       'Accept-Version': 'v1',
//       'Authorization': `Bearer 019653fd-4687-73b7-8676-2813ddad5873|UnUs6oib9b7bnbjHToIHmSovQJ8CaEujhVsFYzKS4805cff7`,
//     },
//   }
// )
//   .then((response) => response.json())
//   .then((data) => {
//     console.log(JSON.stringify(data));
//   })
//   .catch((error) => {
//     console.log(error);
//   });
// ================================== END ROUTES SEARCH ==================================


// // ================================== FLIGHT NUMBER SEARCH ==================================
// // Temp flight number, replace with user input
// const flightNum = 'UA1742';

// fetch(
//   `https://fr24api.flightradar24.com/api/live/flight-positions/full?flights=${flightNum}`,
//   {
//     method: 'GET',
//     headers: {
//       'Accept': 'application/json',
//       'Accept-Version': 'v1',
//       'Authorization': `Bearer 019653fd-4687-73b7-8676-2813ddad5873|UnUs6oib9b7bnbjHToIHmSovQJ8CaEujhVsFYzKS4805cff7`,
//     },
//   }
// )
//   .then((response) => response.json())
//   .then((data) => {
//     console.log(JSON.stringify(data));
//   })
//   .catch((error) => {
//     console.log(error);
//   });
// // ================================== END FLIGHT NUMBER SEARCH ==================================


// // ================================== FLIGHT CALLSIGN SEARCH ==================================
// // Temp flight number, replace with user input
// const callsign = 'UAL1742';

// fetch(
//   `https://fr24api.flightradar24.com/api/live/flight-positions/full?callsigns=${callsign}`,
//   {
//     method: 'GET',
//     headers: {
//       'Accept': 'application/json',
//       'Accept-Version': 'v1',
//       'Authorization': `Bearer 019653fd-4687-73b7-8676-2813ddad5873|UnUs6oib9b7bnbjHToIHmSovQJ8CaEujhVsFYzKS4805cff7`,
//     },
//   }
// )
//   .then((response) => response.json())
//   .then((data) => {
//     console.log(JSON.stringify(data));
//   })
//   .catch((error) => {
//     console.log(error);
//   });
// // ================================== END FLIGHT CALLSIGN SEARCH ==================================


// ================================== AIRPORT SEARCH ==================================
// // Temp direction. Can be 'inbound', 'outbound', or 'both'
// const direction = 'both';
// // Temp airport, replace with user input
// const airport = 'MCO';

// fetch(
//   `https://fr24api.flightradar24.com/api/live/flight-positions/full?airports=${direction}:${airport}`,
//   {
//     method: 'GET',
//     headers: {
//       'Accept': 'application/json',
//       'Accept-Version': 'v1',
//       'Authorization': `Bearer 019653fd-4687-73b7-8676-2813ddad5873|UnUs6oib9b7bnbjHToIHmSovQJ8CaEujhVsFYzKS4805cff7`,
//     },
//   }
// )
//   .then((response) => response.json())
//   .then((data) => {
//     console.log(JSON.stringify(data));
//   })
//   .catch((error) => {
//     console.log(error);
//   });
// ================================== END AIRPORT SEARCH ==================================
