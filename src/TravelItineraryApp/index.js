import React, {useState} from 'react';
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
    VStack
} from '@chakra-ui/react';
import 'leaflet/dist/leaflet.css';
import Homepage from "../Homepage";
import TripOverview from "../TripOverview";

// Crea il sistema Chakra UI
const system = createSystem(defaultConfig);


export default function TravelItineraryApp() {
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [password, setPassword] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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
            <Box bg="gray.50" minH="100vh">
                {!selectedTrip || (selectedTrip.isPrivate && !isUnlocked) ? (
                    <Homepage onSelectTrip={handleSelectTrip} />
                ) : (
                    <TripOverview trip={selectedTrip} onBack={handleBack} />
                )}

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