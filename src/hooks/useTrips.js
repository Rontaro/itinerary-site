import { useState, useEffect } from 'react';

//const API_BASE_URL = 'https://travel-trips-api.vercel.app';
const API_BASE_URL = 'http://localhost:3000';

/**
 * Hook personalizzato per recuperare tutti i trips
 * @param {string} password - Password per autenticazione
 * @param setIsStartupDialogOpen
 * @returns {{ trips: Array, loading: boolean, error: string | null }}
 */

export function useTrips(password, setIsStartupDialogOpen, setAuthenticatedPassword) {
    const onErrorDefault = (err) => {
        setError(err.message || 'Errore nel caricamento degli itinerari');
        setIsStartupDialogOpen(true);
        setAuthenticatedPassword("");
    }

    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchTrips() {
            if (!password) {
                setTrips([]);
                setLoading(false);
                setError(null);
                setIsStartupDialogOpen(true);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch(
                    `${API_BASE_URL}/api/trips?password=${encodeURIComponent(password)}`
                );
                
                if (!response.ok) {
                    if (response.status === 401) {
                        onErrorDefault(new Error('Password non valida'));
                    }
                    onErrorDefault(new Error('Errore nel caricamento degli itinerari'));
                }
                
                const data = await response.json();
                setTrips(data.trips || []);
            } catch (err) {
                onErrorDefault(err);
                setTrips([]);
            } finally {
                setLoading(false);
            }
        }

        fetchTrips();
    }, [password]);

    return { trips, loading, error };
}

/**
 * Hook per recuperare un singolo trip
 * @param {number|string} tripId - ID del trip da recuperare
 * @param {string} password - Password per autenticazione
 * @returns {{ trip: Object | null, loading: boolean, error: string | null }}
 */
export function useTrip(tripId, password) {
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchTrip() {
            if (!tripId || !password) {
                setTrip(null);
                setLoading(false);
                setError(null);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch(
                    `${API_BASE_URL}/api/trip/${tripId}?password=${encodeURIComponent(password)}`
                );
                
                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error('Password non valida');
                    }
                    if (response.status === 403) {
                        throw new Error('Non hai accesso a questo itinerario');
                    }
                    if (response.status === 404) {
                        throw new Error('Itinerario non trovato');
                    }
                    throw new Error('Errore nel caricamento del trip');
                }
                
                const data = await response.json();
                setTrip(data);
            } catch (err) {
                setError(err.message || 'Errore nel caricamento del trip');
                setTrip(null);
            } finally {
                setLoading(false);
            }
        }

        fetchTrip();
    }, [tripId, password]);

    return { trip, loading, error };
}

