import React, {useRef, useState, useEffect} from 'react';
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

// Fix per icone Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Componente Homepage
export default function Homepage({ onSelectTrip, isDarkMode, tripsData, setAuthenticatedPassword }) {
    const [data, setData] = useState(tripsData || { trips: [] });
    const [openDialog, setOpenDialog] = useState(false);
    const [jsonText, setJsonText] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const fileInputRef = useRef(null);

    // Aggiorna i dati quando cambia tripsData
    useEffect(() => {
        if (tripsData) {
            setData(tripsData);
        }
    }, [tripsData]);

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
                <Heading size="4xl" textAlign="center" color={isDarkMode ? "cyan.200" : "teal.700"}>
                    I Miei Itinerari di Viaggio
                </Heading>
                <Text textAlign="center" fontSize="lg" color={isDarkMode ? "gray.300" : "gray.500"}>
                    Seleziona un viaggio per visualizzare i dettagli
                </Text>

                <Button
                    colorPalette="teal"
                    variant="outline"
                    width="fit-content"
                    mx="auto"
                    onClick={() => {
                        setAuthenticatedPassword('');
                    }}
                >
                    Oppure cambia password per altri viaggi
                </Button>

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
                    <DialogContent bg={isDarkMode ? "gray.700" : "white"} borderColor={isDarkMode ? "gray.600" : "gray.300"}>
                        <DialogHeader borderBottomColor={isDarkMode ? "gray.600" : "gray.200"}>
                            <DialogTitle color={isDarkMode ? "white" : "gray.900"}>Carica un JSON personalizzato</DialogTitle>
                        </DialogHeader>

                        <DialogBody>
                            <VStack gap={4} align="stretch">
                                {errorMessage && (
                                    <Alert status="error" bg={isDarkMode ? "red.900" : undefined}>
                                        <Text color={isDarkMode ? "red.200" : undefined}>{errorMessage}</Text>
                                    </Alert>
                                )}

                                <Tabs.Root defaultValue="upload">
                                    <Tabs.List bg={isDarkMode ? "gray.600" : "white"} borderColor={isDarkMode ? "gray.500" : "gray.300"}>
                                        <Tabs.Trigger
                                            value="upload"
                                            color={isDarkMode ? "white" : "gray.900"}
                                            _selected={{
                                                bg: isDarkMode ? "teal.700" : "teal.50",
                                                color: isDarkMode ? "cyan.200" : "teal.900",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            Carica File
                                        </Tabs.Trigger>
                                        <Tabs.Trigger
                                            value="text"
                                            color={isDarkMode ? "white" : "gray.900"}
                                            _selected={{
                                                bg: isDarkMode ? "teal.700" : "teal.50",
                                                color: isDarkMode ? "cyan.200" : "teal.900",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            Scrivi Testo
                                        </Tabs.Trigger>
                                    </Tabs.List>

                                    <Tabs.Content value="upload">
                                        <VStack gap={4} align="stretch" py={4}>
                                            <Text color={isDarkMode ? "gray.300" : "gray.600"}>
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
                                                bg={isDarkMode ? "teal.600" : undefined}
                                                color={isDarkMode ? "white" : undefined}
                                                _hover={{
                                                    bg: isDarkMode ? "teal.700" : undefined
                                                }}
                                            >
                                                Seleziona File JSON
                                            </Button>
                                        </VStack>
                                    </Tabs.Content>

                                    <Tabs.Content value="text">
                                        <VStack gap={4} align="stretch" py={4}>
                                            <Text color={isDarkMode ? "gray.300" : "gray.600"}>
                                                Incolla o scrivi il tuo JSON qui
                                            </Text>
                                            <Textarea
                                                value={jsonText}
                                                onChange={(e) => setJsonText(e.target.value)}
                                                placeholder='{"trips": [...]}'
                                                minH="300px"
                                                fontFamily="monospace"
                                                fontSize="sm"
                                                bg={isDarkMode ? "gray.600" : "white"}
                                                color={isDarkMode ? "white" : "gray.900"}
                                                borderColor={isDarkMode ? "gray.500" : "gray.300"}
                                                _placeholder={{
                                                    color: isDarkMode ? "gray.400" : "gray.400"
                                                }}
                                            />
                                        </VStack>
                                    </Tabs.Content>
                                </Tabs.Root>
                            </VStack>
                        </DialogBody>

                        <DialogFooter borderTopColor={isDarkMode ? "gray.600" : "gray.200"}>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setOpenDialog(false);
                                    setJsonText('');
                                    setErrorMessage('');
                                }}
                                color={isDarkMode ? "white" : undefined}
                                borderColor={isDarkMode ? "gray.500" : undefined}
                                _hover={{
                                    bg: isDarkMode ? "gray.600" : undefined
                                }}
                            >
                                Annulla
                            </Button>
                            <Button
                                colorPalette="teal"
                                onClick={handleTextSubmit}
                                bg={isDarkMode ? "teal.600" : undefined}
                                color={isDarkMode ? "white" : undefined}
                                _hover={{
                                    bg: isDarkMode ? "teal.700" : undefined
                                }}
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
                                bg={isDarkMode ? "gray.700" : "white"}
                                borderColor={isDarkMode ? "gray.600" : "gray.300"}
                                borderWidth="1px"
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
                                         <Heading size="md" color={isDarkMode ? "white" : "gray.900"}>{trip.name}</Heading>
                                         <Text color={isDarkMode ? "gray.300" : "gray.600"}>{trip.destination}</Text>
                                         <HStack>
                                             <Badge colorPalette="blue">
                                                 {new Date(trip.startDate).toLocaleDateString('it-IT')}
                                             </Badge>
                                             <Text color={isDarkMode ? "gray.400" : "gray.600"}>→</Text>
                                             <Badge colorPalette="blue">
                                                 {new Date(trip.endDate).toLocaleDateString('it-IT')}
                                             </Badge>
                                         </HStack>
                                         {trip.budget !== 0 && <Text fontWeight="bold" color={isDarkMode ? "cyan.300" : "teal.700"}>
                                             Budget: {trip.currency || "€"}{trip.budget}
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
