/**
 * Hook personalizzato per gestire localStorage con hydration
 * Previene race conditions tra lettura e scrittura
 */
import { useEffect, useState } from 'react';

export function useLocalStorage(key, initialValue = {}) {
    const [value, setValue] = useState(initialValue);
    const [isHydrated, setIsHydrated] = useState(false);

    // Carica i dati da localStorage al mount
    useEffect(() => {
        if (!key) return;

        try {
            const saved = localStorage.getItem(key);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed && typeof parsed === 'object') {
                    setValue(parsed);
                }
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(`Errore caricamento da localStorage (${key}):`, err);
        } finally {
            setIsHydrated(true);
        }
    }, [key]);

    // Salva i dati su localStorage quando cambiano (solo dopo hydration)
    useEffect(() => {
        if (!key || !isHydrated) return;

        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(`Errore salvataggio su localStorage (${key}):`, err);
        }
    }, [key, value, isHydrated]);

    return [value, setValue, isHydrated];
}

/**
 * Genera una chiave di localStorage stabile
 * Preferisce trip.id, altrimenti crea un fallback deterministico
 */
export function generateStorageKey(trip, prefix = 'trip_todos') {
    if (!trip) return null;
    if (trip.id) return `${prefix}_${trip.id}`;

    // Fallback: usa name/destination + date
    const base = `${trip.name || trip.destination || 'trip'}_${trip.startDate || ''}_${trip.endDate || ''}`;
    return `${prefix}_${encodeURIComponent(base)}`;
}

