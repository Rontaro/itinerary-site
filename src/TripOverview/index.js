import {
    Badge,
    Box,
    Button,
    Card,
    Container,
    For,
    Heading,
    HStack,
    Separator,
    SimpleGrid,
    Stat,
    Table,
    Tabs,
    Text,
    VStack
} from "@chakra-ui/react";
import {MapContainer, Marker, Polyline, Popup, TileLayer} from "react-leaflet";
import React, {useState} from "react";
import CityDetails from "../CityDetails";
import SafeImage from "../utils/SafeImage";

export default function TripOverview({ trip, onBack }) {
    const totalCost = trip.days.reduce((sum, day) => {
        const dayCost = day.activities.reduce((s, a) => s + a.cost, 0);
        const transportCost = day.transport ? day.transport.cost : 0;
        return sum + dayCost + transportCost;
    }, 0); // TODO: change to take costs from cities.activities instead

    const [selectedCity, setSelectedCity] = useState(null);

    return (
        <Container maxW="7xl" py={8}>
            <VStack gap={6} align="stretch">
                <Button onClick={onBack} alignSelf="flex-start" colorPalette="teal" variant="outline">
                    ← Torna ai viaggi
                </Button>

                <Box bg="teal.50" p={6} borderRadius="lg">
                    <HStack justify="space-between" mb={4}>
                        <Heading size="2xl">{trip.image} {trip.name}</Heading>
                        {trip.isPrivate && <Badge colorPalette="purple" fontSize="md">🔒 Viaggio Privato</Badge>}
                    </HStack>

                    <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                        <Box>
                            <Text fontWeight="bold" color="gray.600">Destinazione</Text>
                            <Text fontSize="lg">{trip.destination}</Text>
                        </Box>
                        <Box>
                            <Text fontWeight="bold" color="gray.600">Periodo</Text>
                            <Text fontSize="lg">
                                {new Date(trip.startDate).toLocaleDateString('it-IT')} - {new Date(trip.endDate).toLocaleDateString('it-IT')}
                            </Text>
                        </Box>
                        <Box>
                            <Text fontWeight="bold" color="gray.600">Durata</Text>
                            <Text fontSize="lg">{trip.days.length} giorni</Text>
                        </Box>
                    </SimpleGrid>

                    {trip.budget !== 0 && <Separator my={4} />}

                    {trip.budget !== 0 && <HStack gap={8}>
                        <Stat.Root>
                            <Stat.Label>Budget Previsto</Stat.Label>
                            <Stat.ValueText>€{trip.budget}</Stat.ValueText>
                        </Stat.Root>
                        <Stat.Root>
                            <Stat.Label>Spesa Stimata</Stat.Label>
                            <Stat.ValueText color={totalCost > trip.budget ? "red.500" : "green.500"}>
                                €{totalCost.toFixed(2)}
                            </Stat.ValueText>
                        </Stat.Root>
                        <Stat.Root>
                            <Stat.Label>Differenza</Stat.Label>
                            <Stat.ValueText color={totalCost > trip.budget ? "red.500" : "green.500"}>
                                €{(trip.budget - totalCost).toFixed(2)}
                            </Stat.ValueText>
                        </Stat.Root>
                    </HStack>}
                </Box>

                <Tabs.Root defaultValue="timeline" variant="enclosed" colorPalette="teal">
                    <Tabs.List>
                        <Tabs.Trigger value="timeline">📅 Timeline</Tabs.Trigger>
                        <Tabs.Trigger value="details">📍 Dettagli Luoghi</Tabs.Trigger>
                        <Tabs.Trigger value="map">🗺️ Mappa</Tabs.Trigger>
                    </Tabs.List>

                    <Tabs.Content value="timeline" py={4}>
                        <VStack gap={6} align="stretch">
                            {!selectedCity &&  <> <Heading size="lg" mb={4}>Seleziona una città per vedere i dettagli</Heading>
                            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
                                <For each={trip.cities}>
                                        {(cityData) => {
                                            const startDate = cityData.days[0].date;
                                            const endDate = cityData.days[cityData.days.length - 1].date;
                                            const cityDaysCount = cityData.days.length;

                                            return (
                                                <Card.Root
                                                    key={cityData.name}
                                                    cursor="pointer"
                                                    onClick={() => setSelectedCity(cityData)}
                                                    _hover={{ transform: 'scale(1.02)', shadow: 'lg' }}
                                                    transition="all 0.2s"
                                                    bg="white"
                                                >
                                                    <Card.Body>
                                                        <VStack align="stretch" gap={3}>
                                                            <HStack justify="space-between">
                                                                <Heading size="md">{cityData.name}</Heading>
                                                                <Badge colorPalette="teal">{cityDaysCount} {cityDaysCount === 1 ? 'giorno' : 'giorni'}</Badge>
                                                            </HStack>
                                                            <Text fontSize="sm" color="gray.600">
                                                                {new Date(startDate).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })} - {new Date(endDate).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                            </Text>
                                                            {cityData.hotel && (
                                                                <Box bg="blue.50" p={2} borderRadius="md">
                                                                    <Text fontSize="sm" fontWeight="bold">🏨 {cityData.hotel.name}</Text>
                                                                    <Text fontSize="xs" color="gray.600">{cityData.hotel.address}</Text>
                                                                </Box>
                                                            )}
                                                            <Button size="sm" colorPalette="teal" variant="outline">
                                                                Vedi dettagli →
                                                            </Button>
                                                        </VStack>
                                                    </Card.Body>
                                                </Card.Root>
                                            );
                                        }}
                                    </For>
                            </SimpleGrid></>}
                            {selectedCity &&  <CityDetails trip={trip} city={selectedCity} onBack={() => setSelectedCity(null)}></CityDetails>}
                        </VStack>
                    </Tabs.Content>

                    <Tabs.Content value="details" py={4}>
                        <VStack gap={6} align="stretch">
                            <Box>
                                <Heading size="md" mb={4}>🏨 Hotel</Heading>
                                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                                    <For each={trip.places.hotels}>
                                        {(hotel, i) => (
                                            <Card.Root key={i}>
                                                {hotel.image && (
                                                    <Box overflow="hidden">
                                                        <SafeImage
                                                            src={hotel.image}
                                                            alt={hotel.name}
                                                            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                                        />
                                                    </Box>
                                                )}
                                                <Card.Body>
                                                    <Heading size="sm" mb={2}>{hotel.name}</Heading>
                                                    <Text fontSize="sm" color="gray.600" mb={2}>{hotel.address}</Text>
                                                    <HStack justify="space-between" mb={2}>
                                                        <Badge colorPalette="yellow">⭐ {hotel.rating}</Badge>
                                                        <Text fontWeight="bold" color="teal.600">€{hotel.price}/notte</Text>
                                                    </HStack>
                                                    {hotel.notes && (
                                                        <Text fontSize="sm" mt={2} mb={3} fontStyle="italic" color="gray.600">{hotel.notes}</Text>
                                                    )}
                                                    <HStack gap={2}>
                                                        {hotel.bookingLink && (
                                                            <Button
                                                                as="a"
                                                                href={hotel.bookingLink}
                                                                target="_blank"
                                                                size="sm"
                                                                colorPalette="blue"
                                                                flex={1}
                                                            >
                                                                📅 Booking
                                                            </Button>
                                                        )}
                                                        {hotel.mapsLink && (
                                                            <Button
                                                                as="a"
                                                                href={hotel.mapsLink}
                                                                target="_blank"
                                                                size="sm"
                                                                colorPalette="green"
                                                                flex={1}
                                                            >
                                                                🗺️ Maps
                                                            </Button>
                                                        )}
                                                    </HStack>
                                                </Card.Body>
                                            </Card.Root>
                                        )}
                                    </For>
                                </SimpleGrid>
                            </Box>

                            <Box>
                                <Heading size="md" mb={4}>🍽️ Ristoranti</Heading>
                                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                                    <For each={trip.places.restaurants}>
                                        {(rest, i) => (
                                            <Card.Root key={i}>
                                                {rest.image && (
                                                    <Box overflow="hidden">
                                                        <SafeImage
                                                            src={rest.image}
                                                            alt={rest.name}
                                                            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                                        />
                                                    </Box>
                                                )}
                                                <Card.Body>
                                                    <Heading size="sm" mb={2}>{rest.name}</Heading>
                                                    <Text fontSize="sm" color="gray.600" mb={2}>{rest.address}</Text>
                                                    <Text fontSize="sm" mb={2} color="orange.600" fontWeight="bold">{rest.specialty}</Text>
                                                    <HStack justify="space-between" mb={2}>
                                                        <Badge colorPalette="yellow">⭐ {rest.rating}</Badge>
                                                        <Text fontWeight="bold" color="teal.600">€{rest.price}</Text>
                                                    </HStack>
                                                    {rest.notes && (
                                                        <Text fontSize="sm" mt={2} mb={3} fontStyle="italic" color="gray.600">{rest.notes}</Text>
                                                    )}
                                                    {rest.link && (
                                                        <Button
                                                            as="a"
                                                            href={rest.link}
                                                            target="_blank"
                                                            size="sm"
                                                            colorPalette="blue"
                                                            variant="outline"
                                                            w="full"
                                                        >
                                                            🔗 Sito web
                                                        </Button>
                                                    )}
                                                </Card.Body>
                                            </Card.Root>
                                        )}
                                    </For>
                                </SimpleGrid>
                            </Box>

                            <Box>
                                <Heading size="md" mb={4}>🏛️ Attrazioni</Heading>
                                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                                    <For each={trip.places.attractions}>
                                        {(attr, i) => (
                                            <Card.Root key={i}>
                                                {attr.image && (
                                                    <Box overflow="hidden">
                                                        <SafeImage
                                                            src={attr.image}
                                                            alt={attr.name}
                                                            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                                        />
                                                    </Box>
                                                )}
                                                <Card.Body>
                                                    <Heading size="sm" mb={2}>{attr.name}</Heading>
                                                    <Text fontSize="sm" color="gray.600" mb={2}>{attr.address}</Text>
                                                    <Text fontSize="sm" mb={2} color="blue.600">🕐 {attr.hours}</Text>
                                                    <HStack justify="space-between" mb={2}>
                                                        <Badge colorPalette="yellow">⭐ {attr.rating}</Badge>
                                                        <Text fontWeight="bold" color={attr.price === 0 ? "green.600" : "teal.600"}>
                                                            {attr.price === 0 ? "Gratuito" : `€${attr.price}`}
                                                        </Text>
                                                    </HStack>
                                                    {attr.notes && (
                                                        <Text fontSize="sm" mt={2} mb={3} fontStyle="italic" color="gray.600">{attr.notes}</Text>
                                                    )}
                                                    {attr.link && (
                                                        <Button
                                                            as="a"
                                                            href={attr.link}
                                                            target="_blank"
                                                            size="sm"
                                                            colorPalette="blue"
                                                            variant="outline"
                                                            w="full"
                                                        >
                                                            🔗 Sito web
                                                        </Button>
                                                    )}
                                                </Card.Body>
                                            </Card.Root>
                                        )}
                                    </For>
                                </SimpleGrid>
                            </Box>
                        </VStack>
                    </Tabs.Content>

                    <Tabs.Content value="map" py={4}>
                        <Box h="500px" borderRadius="lg" overflow="hidden">
                            <MapContainer
                                center={trip.mapData.center}
                                zoom={12}
                                style={{ height: '100%', width: '100%' }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                />
                                <For each={trip.mapData.markers}>
                                    {(marker, i) => (
                                        <Marker key={i} position={marker.position}>
                                            <Popup>{marker.label}</Popup>
                                        </Marker>
                                    )}
                                </For>
                                <For each={trip.mapData.routes}>
                                    {(route, i) => (
                                        <Polyline key={i} positions={route} color="blue" />
                                    )}
                                </For>
                            </MapContainer>
                        </Box>
                    </Tabs.Content>
                </Tabs.Root>
            </VStack>
        </Container>
    );
}