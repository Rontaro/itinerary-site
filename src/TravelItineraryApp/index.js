import React, {useState, useEffect} from 'react';
import {
    Alert, AlertContent, AlertRoot,
    Box,
    Button,
    ChakraProvider,
    createSystem,
    defaultConfig,
    DialogBackdrop,
    DialogBody,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    Input,
    Text,
    VStack
} from '@chakra-ui/react';
import 'leaflet/dist/leaflet.css';
import Homepage from "../Homepage";
import TripOverview from "../TripOverview";
import { useTrips } from "../hooks/useTrips";

const STORAGE_KEY = 'travel_trips_data';
const STORAGE_PASSWORD_KEY = 'travel_trips_password';

// Crea il sistema Chakra UI con tema scuro
const system = createSystem(defaultConfig, {
    theme: {
        tokens: {
            colors: {
                // Palette personalizzata più soft
            }
        }
    }
});

export default function TravelItineraryApp() {
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [password, setPassword] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isStartupDialogOpen, setIsStartupDialogOpen] = useState(true);
    const [startupPassword, setStartupPassword] = useState('');
    const [authenticatedPassword, setAuthenticatedPassword] = useState(() => {
        // Carica la password salvata da localStorage
        try {
            return localStorage.getItem(STORAGE_PASSWORD_KEY) || '';
        } catch {
            return '';
        }
    });
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Carica il valore salvato da sessionStorage o di default false
        const saved = sessionStorage.getItem('darkMode');
        return saved ? JSON.parse(saved) : false;
    });

    // Usa il custom hook per recuperare i trips
    const { trips, loading, error } = useTrips(authenticatedPassword, setIsStartupDialogOpen, setAuthenticatedPassword);

    // Carica i dati salvati da localStorage all'avvio
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            const savedPassword = localStorage.getItem(STORAGE_PASSWORD_KEY);
            
            if (saved && savedPassword) {
                // Se ci sono dati salvati, usa la password salvata per ricaricare
                setAuthenticatedPassword(savedPassword);
                setIsStartupDialogOpen(false);
            }
        } catch (err) {
            console.error('Errore nel caricamento dei dati salvati:', err);
        }
    }, []);

    // Salva i trips in localStorage quando cambiano
    useEffect(() => {
        if (trips && trips.length > 0) {
            try {
                const dataToStore = { trips };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
            } catch (err) {
                console.error('Errore nel salvataggio dei dati:', err);
            }
        }
    }, [trips]);

    // Salva la preferenza in sessionStorage quando cambia
    useEffect(() => {
        sessionStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    // Gestisce il submit della password all'avvio
    const handleStartupPasswordSubmit = () => {
        if (!startupPassword.trim()) {
            return;
        }
        // Imposta la password autenticata, che triggerà il fetch tramite useTrips
        setAuthenticatedPassword(startupPassword);
        localStorage.setItem(STORAGE_PASSWORD_KEY, startupPassword);
        setStartupPassword('');
    };

    const handleSelectTrip = (trip) => {
        if (trip.isPrivate && !isUnlocked) {
            setSelectedTrip(trip);
            setIsDialogOpen(true);
        } else {
            setSelectedTrip(trip);
            setIsUnlocked(false);
        }
    };

    const handleUnlock = () => {
        if (password === selectedTrip.password) {
            setIsUnlocked(true);
            setIsDialogOpen(false);
            setPassword('');
        } else {
            alert('Password errata!');
        }
    };

    const handleBack = () => {
        setSelectedTrip(null);
        setIsUnlocked(false);
        setPassword('');
    };

    return (
        <ChakraProvider value={system}>
            <Box bg={isDarkMode ? "gray.800" : "gray.50"} minH="100vh" display="flex" flexDirection="column">
                {/* Dialog password all'avvio */}
                {(!authenticatedPassword || loading) && <DialogRoot
                    open={isStartupDialogOpen} 
                    onOpenChange={(e) => {
                        // Impedisci la chiusura se non ci sono dati caricati
                        if (!authenticatedPassword || loading || trips.length === 0) {
                            return;
                        }
                        setIsStartupDialogOpen(e.open);
                    }}
                >
                    <DialogBackdrop />
                    <DialogContent bg={isDarkMode ? "gray.700" : "white"} borderColor={isDarkMode ? "gray.600" : "gray.300"}>
                        <DialogHeader borderBottomColor={isDarkMode ? "gray.600" : "gray.200"}>
                            <DialogTitle color={isDarkMode ? "white" : "gray.900"}>🔒 Accesso Itinerari</DialogTitle>
                        </DialogHeader>
                        <DialogBody>
                            <VStack gap={4} align="stretch">
                                <Text color={isDarkMode ? "gray.300" : "gray.600"}>
                                    Inserisci la password per accedere agli itinerari di viaggio:
                                </Text>
                                {error && (
                                    <AlertRoot status="error" bg={isDarkMode ? "red.900" : undefined}>
                                        <AlertContent >
                                            <Text color={isDarkMode ? "red.200" : undefined}>{error}</Text>
                                        </AlertContent>
                                    </AlertRoot>
                                )}
                                {loading && (
                                    <AlertRoot status="info" bg={isDarkMode ? "blue.900" : undefined}>
                                        <AlertContent >
                                            <Text color={isDarkMode ? "blue.200" : undefined}>Caricamento in corso...</Text>
                                        </AlertContent>
                                    </AlertRoot>
                                )}
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    value={startupPassword}
                                    onChange={(e) => {
                                        setStartupPassword(e.target.value);
                                    }}
                                    onKeyPress={(e) => e.key === 'Enter' && !loading && handleStartupPasswordSubmit()}
                                    disabled={loading}
                                    bg={isDarkMode ? "gray.600" : "white"}
                                    color={isDarkMode ? "white" : "gray.900"}
                                    borderColor={isDarkMode ? "gray.500" : "gray.300"}
                                />
                            </VStack>
                        </DialogBody>
                        <DialogFooter borderTopColor={isDarkMode ? "gray.600" : "gray.200"}>
                            <Button
                                colorPalette="teal"
                                onClick={handleStartupPasswordSubmit}
                                isLoading={loading}
                                loadingText="Caricamento..."
                                disabled={loading || !startupPassword.trim()}
                                bg={isDarkMode ? "teal.600" : undefined}
                                color={isDarkMode ? "white" : undefined}
                                _hover={{
                                    bg: isDarkMode ? "teal.700" : undefined
                                }}
                            >
                                Accedi
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </DialogRoot>}

                {/* Contenuto principale - mostra solo se i dati sono caricati */}
                {authenticatedPassword && !loading && trips.length > 0 && (
                    <Box flex="1" pb="80px">
                        {!selectedTrip || (selectedTrip.isPrivate && !isUnlocked) ? (
                            <Homepage 
                                onSelectTrip={handleSelectTrip} 
                                isDarkMode={isDarkMode}
                                tripsData={{ trips }}
                                setAuthenticatedPassword={setAuthenticatedPassword}
                            />
                        ) : (
                            <TripOverview trip={selectedTrip} onBack={handleBack} isDarkMode={isDarkMode} />
                        )}
                    </Box>
                )}

                {/* Mostra messaggio se non ci sono trips dopo il caricamento */}
                {authenticatedPassword && !loading && trips.length === 0 && !error && (
                    <Box flex="1" pb="80px" display="flex" alignItems="center" justifyContent="center">
                        <Text color={isDarkMode ? "gray.300" : "gray.600"}>
                            Nessun itinerario disponibile per questa password.
                        </Text>
                    </Box>
                )}

                {/* Pulsante Dark Mode - Fisso in basso a destra */}
                <Box position="fixed" bottom={4} right={4} zIndex={10}>
                    <Button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        colorPalette={isDarkMode ? "yellow" : "blue"}
                        variant="outline"
                    >
                        {isDarkMode ? "☀️ Light" : "🌙 Dark"}
                    </Button>
                </Box>


                <DialogRoot open={isDialogOpen} onOpenChange={(e) => setIsDialogOpen(e.open)}>
                    <DialogBackdrop />
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>🔒 Viaggio Privato</DialogTitle>
                        </DialogHeader>
                        <DialogBody>
                            <VStack gap={4} align="stretch">
                                <Text>Inserisci la password per accedere a questo viaggio:</Text>
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleUnlock()}
                                />
                            </VStack>
                        </DialogBody>
                        <DialogFooter>
                            <Button variant="ghost" mr={3} onClick={() => setIsDialogOpen(false)}>
                                Annulla
                            </Button>
                            <Button colorPalette="teal" onClick={handleUnlock}>
                                Sblocca
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </DialogRoot>
            </Box>
        </ChakraProvider>
    );
}