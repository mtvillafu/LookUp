// hooks/useFlights.ts

import { useState, useEffect, useCallback } from "react";
import Constants from "expo-constants";
import axios from "axios";

export interface Flight {
  id: string;
  ident: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  airline: string;
}

type Query = {
  flightNum?: string;
  origin?: string;
  destination?: string;
  bounds?: string;
};

const BASE_URL =
  "https://fr24api.flightradar24.com/api/live/flight-positions/full";

export function useFlights(query: Query, autoRefreshMs = 60000) {
  const { flightNum, origin, destination, bounds } = query;

  const [data, setData] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFlights = useCallback(async () => {
    // Bail only if absolutely no criteria
    if (!flightNum && !(origin && destination) && !bounds) {
      setData([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    // Build URL manually to preserve commas in bounds
    let url = BASE_URL;
    if (flightNum) {
      url += `?flights=${flightNum}`;
    } else if (origin && destination) {
      url += `?routes=${origin}-${destination}`;
    } else if (bounds) {
      url += `?bounds=${bounds}`;
    }

    try {
      const resp = await axios.get(url, {
        headers: {
          Accept: "application/json",
          "Accept-Version": "v1",
          Authorization: `Bearer ${
            Constants.manifest?.extra?.FR24_API_KEY ??
            Constants.expoConfig?.extra?.FR24_API_KEY ??
            ""
          }`,
        },
      });
      setData(mapApiToFlights(resp.data));
    } catch (e: any) {
      setError(e.response?.data?.message || e.message || "Unknown error");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [flightNum, origin, destination, bounds]);

  useEffect(() => {
    fetchFlights();
  }, [fetchFlights]);

  useEffect(() => {
    const iv = setInterval(fetchFlights, autoRefreshMs);
    return () => clearInterval(iv);
  }, [fetchFlights, autoRefreshMs]);

  return { data, loading, error, refetch: fetchFlights };
}

function mapApiToFlights(apiData: any): Flight[] {
  const raw: any[] = apiData.data || [];
  return raw.map((f) => ({
    id: f.fr24_id ?? "",
    ident: f.flight ?? "",
    origin: f.orig_iata ?? "",
    destination: f.dest_iata ?? "",
    departureTime: f.timestamp ?? "",
    arrivalTime: f.eta ?? "",
    airline: f.operating_as || f.painted_as || f.callsign || "",
  }));
}
