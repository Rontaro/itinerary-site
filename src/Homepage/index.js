import React, {useRef, useState} from 'react';
import {
    Alert,
    Badge,
    Button,
    Card,
    Container,
    DialogBackdrop,
    DialogBody,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    For,
    Heading,
    HStack,
    SimpleGrid,
    Tabs,
    Text,
    Textarea,
    VStack
} from '@chakra-ui/react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import travelData from "../resources/traveldata.json";

// Fix per icone Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Componente Homepage
export default function Homepage({ onSelectTrip }) {
    const [data, setData] = useState(travelData);
    const [openDialog, setOpenDialog] = useState(false);
    const [jsonText, setJsonText] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const fileInputRef = useRef(null);

    const handleLoadJSON = (newData) => {
        try {
            setData(newData);
            setOpenDialog(false);
            setJsonText('');
            setErrorMessage('');
        } catch (error) {
            setErrorMessage('Errore nel caricamento dei dati');
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target?.result);
                handleLoadJSON(json);
            } catch {
                setErrorMessage('File JSON non valido. Controlla la sintassi.');
            }
        };
        reader.readAsText(file);
    };

    const handleTextSubmit = () => {
        try {
            const json = JSON.parse(jsonText);
            handleLoadJSON(json);
        } catch {
            setErrorMessage('JSON non valido. Controlla la sintassi.');
        }
    };

    return (
        <Container maxW="7xl" py={8}>
            <VStack gap={6} align="stretch">
                <Heading size="4xl" textAlign="center" color="teal.600">
                    I Miei Itinerari di Viaggio
                </Heading>
                <Text textAlign="center" fontSize="lg" color="gray.600">
                    Seleziona un viaggio per visualizzare i dettagli
                </Text>

                {/* Pulsante Carica JSON Personalizzato */}
                <Button
                    colorPalette="teal"
                    variant="outline"
                    width="fit-content"
                    mx="auto"
                    onClick={() => {
                        setOpenDialog(true);
                        setErrorMessage('');
                    }}
                >
                    Oppure carica un JSON personalizzato
                </Button>

                {/* Dialog Modal */}
                <DialogRoot
                    open={openDialog}
                    onOpenChange={(e) => setOpenDialog(e.open)}
                >
                    <DialogBackdrop />
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Carica un JSON personalizzato</DialogTitle>
                        </DialogHeader>

                        <DialogBody>
                            <VStack gap={4} align="stretch">
                                {errorMessage && (
                                    <Alert.Root status="error">
                                        <Alert.Indicator />
                                        <Alert.Title>{errorMessage}</Alert.Title>
                                    </Alert.Root>
                                )}

                                <Tabs.Root defaultValue="upload">
                                    <Tabs.List>
                                        <Tabs.Trigger value="upload">Carica File</Tabs.Trigger>
                                        <Tabs.Trigger value="text">Scrivi Testo</Tabs.Trigger>
                                    </Tabs.List>

                                    <Tabs.Content value="upload">
                                        <VStack gap={4} align="stretch" py={4}>
                                            <Text color="gray.600">
                                                Seleziona un file JSON dal tuo computer
                                            </Text>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept=".json"
                                                onChange={handleFileUpload}
                                                style={{ display: 'none' }}
                                            />
                                            <Button
                                                colorPalette="teal"
                                                onClick={() => fileInputRef.current?.click()}
                                                width="full"
                                            >
                                                Seleziona File JSON
                                            </Button>
                                        </VStack>
                                    </Tabs.Content>

                                    <Tabs.Content value="text">
                                        <VStack gap={4} align="stretch" py={4}>
                                            <Text color="gray.600">
                                                Incolla o scrivi il tuo JSON qui
                                            </Text>
                                            <Textarea
                                                value={jsonText}
                                                onChange={(e) => setJsonText(e.target.value)}
                                                placeholder='{"trips": [...]}'
                                                minH="300px"
                                                fontFamily="monospace"
                                                fontSize="sm"
                                            />
                                        </VStack>
                                    </Tabs.Content>
                                </Tabs.Root>
                            </VStack>
                        </DialogBody>

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setOpenDialog(false);
                                    setJsonText('');
                                    setErrorMessage('');
                                }}
                            >
                                Annulla
                            </Button>
                            <Button
                                colorPalette="teal"
                                onClick={handleTextSubmit}
                            >
                                Carica JSON
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </DialogRoot>

                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6} mt={8}>
                    <For each={data.trips}>
                        {(trip) => (
                            <Card.Root
                                key={trip.id}
                                cursor="pointer"
                                onClick={() => onSelectTrip(trip)}
                                _hover={{ transform: 'scale(1.05)', shadow: 'xl' }}
                                transition="all 0.3s"
                                bg="white"
                                borderWidth="1px"
                                borderColor="gray.200"
                            >
                                <Card.Header>
                                    <HStack justify="space-between">
                                        <Text fontSize="4xl">{trip.image}</Text>
                                        {trip.isPrivate && (
                                            <Badge colorPalette="purple">🔒 Privato</Badge>
                                        )}
                                    </HStack>
                                </Card.Header>
                                <Card.Body>
                                    <VStack align="stretch" gap={3}>
                                        <Heading size="md">{trip.name}</Heading>
                                        <Text color="gray.600">{trip.destination}</Text>
                                        <HStack>
                                            <Badge colorPalette="blue">
                                                {new Date(trip.startDate).toLocaleDateString('it-IT')}
                                            </Badge>
                                            <Text>→</Text>
                                            <Badge colorPalette="blue">
                                                {new Date(trip.endDate).toLocaleDateString('it-IT')}
                                            </Badge>
                                        </HStack>
                                        {trip.budget !== 0 && <Text fontWeight="bold" color="teal.600">
                                            Budget: €{trip.budget}
                                        </Text>}
                                    </VStack>
                                </Card.Body>
                            </Card.Root>
                        )}
                    </For>
                </SimpleGrid>
            </VStack>
        </Container>
    );
};
