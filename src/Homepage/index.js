import React from 'react';
import {Badge, Card, Container, For, Heading, HStack, SimpleGrid, Text, VStack} from '@chakra-ui/react';
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
    return (
        <Container maxW="7xl" py={8}>
            <VStack gap={6} align="stretch">
                <Heading size="4xl" textAlign="center" color="teal.600">
                    I Miei Itinerari di Viaggio
                </Heading>
                <Text textAlign="center" fontSize="lg" color="gray.600">
                    Seleziona un viaggio per visualizzare i dettagli
                </Text>

                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6} mt={8}>
                    <For each={travelData.trips}>
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
