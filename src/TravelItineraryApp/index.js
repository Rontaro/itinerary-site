import React, {useState, useEffect} from 'react';
import {
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
    VStack,
    HStack
} from '@chakra-ui/react';
import 'leaflet/dist/leaflet.css';
import Homepage from "../Homepage";
import TripOverview from "../TripOverview";

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
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Carica il valore salvato da sessionStorage o di default false
        const saved = sessionStorage.getItem('darkMode');
        return saved ? JSON.parse(saved) : false;
    });

    // Salva la preferenza in sessionStorage quando cambia
    useEffect(() => {
        sessionStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

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
                {/* Contenuto principale */}
                <Box flex="1" pb="80px">
                    {!selectedTrip || (selectedTrip.isPrivate && !isUnlocked) ? (
                        <Homepage onSelectTrip={handleSelectTrip} isDarkMode={isDarkMode} />
                    ) : (
                        <TripOverview trip={selectedTrip} onBack={handleBack} isDarkMode={isDarkMode} />
                    )}
                </Box>

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