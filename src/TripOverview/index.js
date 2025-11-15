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
    Tabs,
    Text,
    VStack
} from "@chakra-ui/react";
import {MapContainer, Marker, Polyline, Popup, TileLayer} from "react-leaflet";
import React, {useState} from "react";
import CityDetails from "../CityDetails";
import SafeImage from "../utils/SafeImage";

export default function TripOverview({ trip, onBack, isDarkMode }) {
    // Calcola il totalCost dai costi delle attività in cities.days
    const calculateTotalCost = () => {
        let total = 0;
        
        // Itera su tutte le città
        if (trip?.cities) {
            trip.cities.forEach(city => {
                // Itera su tutti i giorni della città
                if (city.days) {
                    city.days.forEach(day => {
                        // Itera su tutte le attività del giorno e somma i costi
                        if (day.activities) {
                            total += day.activities.reduce((sum, activity) => sum + (activity.cost || 0), 0);
                        }
                    });
                }
            });
        }

        return total;
    };

    const totalCost = calculateTotalCost();

    // Calcola la durata in giorni dalla differenza tra startDate e endDate
    const tripDays = Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)) + 1;

    const [selectedCity, setSelectedCity] = useState(null);

    return (
        <Container maxW="7xl" py={8}>
            <VStack gap={6} align="stretch">
                <Button onClick={onBack} alignSelf="flex-start" colorPalette="teal" variant="outline">
                    ← Torna ai viaggi
                </Button>

                <Box bg={isDarkMode ? "gray.700" : "blue.50"} p={6} borderRadius="lg">
                    <HStack justify="space-between" mb={4}>
                        <Heading size="2xl" color={isDarkMode ? "cyan.200" : "gray.900"}>{trip.image} {trip.name}</Heading>
                        {trip.isPrivate && <Badge colorPalette="purple" fontSize="md">🔒 Viaggio Privato</Badge>}
                    </HStack>

                    <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                        <Box>
                            <Text fontWeight="bold" color={isDarkMode ? "gray.400" : "gray.600"}>Destinazione</Text>
                            <Text fontSize="lg" color={isDarkMode ? "white" : "gray.900"}>{trip.destination}</Text>
                        </Box>
                        <Box>
                            <Text fontWeight="bold" color={isDarkMode ? "gray.400" : "gray.600"}>Periodo</Text>
                            <Text fontSize="lg" color={isDarkMode ? "white" : "gray.900"}>
                                {new Date(trip.startDate).toLocaleDateString('it-IT')} - {new Date(trip.endDate).toLocaleDateString('it-IT')}
                            </Text>
                        </Box>
                        <Box>
                            <Text fontWeight="bold" color={isDarkMode ? "gray.400" : "gray.600"}>Durata</Text>
                            <Text fontSize="lg" color={isDarkMode ? "white" : "gray.900"}>{tripDays} giorni</Text>
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
                    <Tabs.List bg={isDarkMode ? "gray.700" : "white"} borderColor={isDarkMode ? "gray.600" : "gray.300"}>
                        <Tabs.Trigger
                            value="timeline"
                            color={isDarkMode ? "white" : "gray.900"}
                            _selected={{
                                bg: isDarkMode ? "teal.700" : "teal.50",
                                color: isDarkMode ? "cyan.200" : "teal.900",
                                fontWeight: "bold"
                            }}
                        >
                            📅 Timeline
                        </Tabs.Trigger>
                        <Tabs.Trigger
                            value="details"
                            color={isDarkMode ? "white" : "gray.900"}
                            _selected={{
                                bg: isDarkMode ? "teal.700" : "teal.50",
                                color: isDarkMode ? "cyan.200" : "teal.900",
                                fontWeight: "bold"
                            }}
                        >
                            📍 Dettagli Luoghi
                        </Tabs.Trigger>
                        <Tabs.Trigger
                            value="map"
                            color={isDarkMode ? "white" : "gray.900"}
                            _selected={{
                                bg: isDarkMode ? "teal.700" : "teal.50",
                                color: isDarkMode ? "cyan.200" : "teal.900",
                                fontWeight: "bold"
                            }}
                        >
                            🗺️ Mappa
                        </Tabs.Trigger>
                    </Tabs.List>

                    <Tabs.Content value="timeline" py={4}>
                        <VStack gap={6} align="stretch">
                            {!selectedCity &&  <> <Heading size="lg" mb={4} color={isDarkMode ? "white" : "gray.900"}>Seleziona una città per vedere i dettagli</Heading>
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
                                                    bg={isDarkMode ? "gray.700" : "white"}
                                                    borderColor={isDarkMode ? "gray.600" : "gray.300"}
                                                >
                                                    <Card.Body>
                                                        <VStack align="stretch" gap={3}>
                                                            <HStack justify="space-between">
                                                                <Heading size="md" color={isDarkMode ? "white" : "gray.900"}>{cityData.name}</Heading>
                                                                <Badge colorPalette="teal">{cityDaysCount} {cityDaysCount === 1 ? 'giorno' : 'giorni'}</Badge>
                                                            </HStack>
                                                            <Text fontSize="sm" color={isDarkMode ? "gray.300" : "gray.600"}>
                                                                {new Date(startDate).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })} - {new Date(endDate).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                            </Text>
                                                            {cityData.hotel && cityData.hotel.name && cityData.hotel.address && (
                                                                <Box bg={isDarkMode ? "gray.600" : "blue.50"} p={2} borderRadius="md">
                                                                    <Text fontSize="sm" fontWeight="bold" color={isDarkMode ? "white" : "gray.900"}>🏨 {cityData.hotel.name}</Text>
                                                                    <Text fontSize="xs" color={isDarkMode ? "gray.300" : "gray.600"}>{cityData.hotel.address}</Text>
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
                            {selectedCity &&  <CityDetails trip={trip} city={selectedCity} onBack={() => setSelectedCity(null)} isDarkMode={isDarkMode}></CityDetails>}
                        </VStack>
                    </Tabs.Content>

                    <Tabs.Content value="details" py={4}>
                        <VStack gap={6} align="stretch">
                            <Box>
                                <Heading size="md" mb={4} color={isDarkMode ? "white" : "gray.900"}>🏨 Hotel</Heading>
                                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                                    <For each={trip.places.hotels}>
                                        {(hotel, i) => (
                                            <Card.Root key={i} bg={isDarkMode ? "gray.700" : "white"} borderColor={isDarkMode ? "gray.600" : "gray.300"}>
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
                                                    {hotel.name && (
                                                        <Heading size="sm" mb={2} color={isDarkMode ? "white" : "gray.900"}>{hotel.name}</Heading>
                                                    )}
                                                    {hotel.address && (
                                                        <Text fontSize="sm" color={isDarkMode ? "gray.300" : "gray.600"} mb={2}>{hotel.address}</Text>
                                                    )}
                                                    {(hotel.rating !== 0 || hotel.price !== 0) && (
                                                        <HStack justify="space-between" mb={2}>
                                                            {hotel.rating !== 0 && (
                                                                <Badge colorPalette="yellow">⭐ {hotel.rating}</Badge>
                                                            )}
                                                            {hotel.price !== 0 && (
                                                                <Text fontWeight="bold" color={isDarkMode ? "cyan.300" : "teal.700"}>€{hotel.price}/notte</Text>
                                                            )}
                                                        </HStack>
                                                    )}
                                                    {hotel.notes && (
                                                        <Text fontSize="sm" mt={2} mb={3} fontStyle="italic" color={isDarkMode ? "gray.300" : "gray.600"}>{hotel.notes}</Text>
                                                    )}
                                                    <HStack gap={2}>
                                                        {hotel.bookingLink && (
                                                            <Button
                                                                as="a"
                                                                href={hotel.bookingLink}
                                                                target="_blank"
                                                                size="sm"
                                                                colorPalette="blue"
                                                                variant={isDarkMode ? "solid" : "outline"}
                                                                flex={1}
                                                                bg={isDarkMode ? "blue.600" : undefined}
                                                                color={isDarkMode ? "white" : undefined}
                                                                _hover={{
                                                                    bg: isDarkMode ? "blue.700" : undefined,
                                                                    opacity: isDarkMode ? 1 : undefined
                                                                }}
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
                                                                variant={isDarkMode ? "solid" : "outline"}
                                                                flex={1}
                                                                bg={isDarkMode ? "green.600" : undefined}
                                                                color={isDarkMode ? "white" : undefined}
                                                                _hover={{
                                                                    bg: isDarkMode ? "green.700" : undefined,
                                                                    opacity: isDarkMode ? 1 : undefined
                                                                }}
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
                                <Heading size="md" mb={4} color={isDarkMode ? "white" : "gray.900"}>🍽️ Ristoranti</Heading>
                                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                                    <For each={trip.places.restaurants}>
                                        {(rest, i) => (
                                            <Card.Root key={i} bg={isDarkMode ? "gray.700" : "white"} borderColor={isDarkMode ? "gray.600" : "gray.300"}>
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
                                                    {rest.name && (
                                                        <Heading size="sm" mb={2} color={isDarkMode ? "white" : "gray.900"}>{rest.name}</Heading>
                                                    )}
                                                    {rest.address && (
                                                        <Text fontSize="sm" color={isDarkMode ? "gray.300" : "gray.600"} mb={2}>{rest.address}</Text>
                                                    )}
                                                    {rest.specialty && (
                                                        <Text fontSize="sm" mb={2} color="orange.600" fontWeight="bold">{rest.specialty}</Text>
                                                    )}
                                                    {(rest.rating !== 0 || rest.price !== 0) && (
                                                        <HStack justify="space-between" mb={2}>
                                                            {rest.rating !== 0 && (
                                                                <Badge colorPalette="yellow">⭐ {rest.rating}</Badge>
                                                            )}
                                                            {rest.price !== 0 && (
                                                                <Text fontWeight="bold" color={isDarkMode ? "cyan.300" : "teal.700"}>€{rest.price}</Text>
                                                            )}
                                                        </HStack>
                                                    )}
                                                    {rest.notes && (
                                                        <Text fontSize="sm" mt={2} mb={3} fontStyle="italic" color={isDarkMode ? "gray.300" : "gray.600"}>{rest.notes}</Text>
                                                    )}
                                                    {rest.link && (
                                                        <Button
                                                            as="a"
                                                            href={rest.link}
                                                            target="_blank"
                                                            size="sm"
                                                            colorPalette="blue"
                                                            variant={isDarkMode ? "solid" : "outline"}
                                                            w="full"
                                                            bg={isDarkMode ? "blue.600" : undefined}
                                                            color={isDarkMode ? "white" : undefined}
                                                            _hover={{
                                                                bg: isDarkMode ? "blue.700" : undefined,
                                                                opacity: isDarkMode ? 1 : undefined
                                                            }}
                                                        >
                                                            🔗 Sito web
                                                        </Button>
                                                    )}
                                                    {rest.mapsLink && (
                                                        <Button
                                                            as="a"
                                                            href={rest.mapsLink}
                                                            target="_blank"
                                                            size="sm"
                                                            colorPalette="green"
                                                            variant={isDarkMode ? "solid" : "outline"}
                                                            w="full"
                                                            bg={isDarkMode ? "green.600" : undefined}
                                                            color={isDarkMode ? "white" : undefined}
                                                            _hover={{
                                                                bg: isDarkMode ? "green.700" : undefined,
                                                                opacity: isDarkMode ? 1 : undefined
                                                            }}
                                                        >
                                                            🗺️ Maps
                                                        </Button>
                                                    )}
                                                </Card.Body>
                                            </Card.Root>
                                        )}
                                    </For>
                                </SimpleGrid>
                            </Box>

                            <Box>
                                <Heading size="md" mb={4} color={isDarkMode ? "white" : "gray.900"}>🏛️ Attrazioni</Heading>
                                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                                    <For each={trip.places.attractions}>
                                        {(attr, i) => (
                                            <Card.Root key={i} bg={isDarkMode ? "gray.700" : "white"} borderColor={isDarkMode ? "gray.600" : "gray.300"}>
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
                                                    {attr.name && (
                                                        <Heading size="sm" mb={2} color={isDarkMode ? "white" : "gray.900"}>{attr.name}</Heading>
                                                    )}
                                                    {attr.address && (
                                                        <Text fontSize="sm" color={isDarkMode ? "gray.300" : "gray.600"} mb={2}>{attr.address}</Text>
                                                    )}
                                                    {attr.hours && (
                                                        <Text fontSize="sm" mb={2} color="blue.600">🕐 {attr.hours}</Text>
                                                    )}
                                                    {(attr.rating !== 0 || attr.price !== 0) && (
                                                        <HStack justify="space-between" mb={2}>
                                                            {attr.rating !== 0 && (
                                                                <Badge colorPalette="yellow">⭐ {attr.rating}</Badge>
                                                            )}
                                                            {attr.price !== 0 && (
                                                                <Text fontWeight="bold" color={isDarkMode ? "cyan.300" : attr.price === 0 ? "green.600" : "teal.700"}>
                                                                    {attr.price === 0 ? "Gratuito" : `€${attr.price}`}
                                                                </Text>
                                                            )}
                                                        </HStack>
                                                    )}
                                                    {attr.notes && (
                                                        <Text fontSize="sm" mt={2} mb={3} fontStyle="italic" color={isDarkMode ? "gray.300" : "gray.600"}>{attr.notes}</Text>
                                                    )}
                                                    {attr.link && (
                                                        <Button
                                                            as="a"
                                                            href={attr.link}
                                                            target="_blank"
                                                            size="sm"
                                                            colorPalette="blue"
                                                            variant={isDarkMode ? "solid" : "outline"}
                                                            w="full"
                                                            bg={isDarkMode ? "blue.600" : undefined}
                                                            color={isDarkMode ? "white" : undefined}
                                                            _hover={{
                                                                bg: isDarkMode ? "blue.700" : undefined,
                                                                opacity: isDarkMode ? 1 : undefined
                                                            }}
                                                        >
                                                            🔗 Sito web
                                                        </Button>
                                                    )}
                                                    {attr.mapsLink && (
                                                        <Button
                                                            as="a"
                                                            href={attr.mapsLink}
                                                            target="_blank"
                                                            size="sm"
                                                            colorPalette="green"
                                                            variant={isDarkMode ? "solid" : "outline"}
                                                            w="full"
                                                            bg={isDarkMode ? "green.600" : undefined}
                                                            color={isDarkMode ? "white" : undefined}
                                                            _hover={{
                                                                bg: isDarkMode ? "green.700" : undefined,
                                                                opacity: isDarkMode ? 1 : undefined
                                                            }}
                                                        >
                                                            🗺️ Maps
                                                        </Button>
                                                    )}
                                                </Card.Body>
                                            </Card.Root>
                                        )}
                                    </For>
                                </SimpleGrid>
                            </Box>

                            <Box>
                                <Heading size="md" mb={4} color={isDarkMode ? "white" : "gray.900"}>🏛️ Escursioni</Heading>
                                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                                    <For each={trip.places.excursions}>
                                        {(esc, i) => (
                                            <Card.Root key={i} bg={isDarkMode ? "gray.700" : "white"} borderColor={isDarkMode ? "gray.600" : "gray.300"}>
                                                {esc.image && (
                                                    <Box overflow="hidden">
                                                        <SafeImage
                                                            src={esc.image}
                                                            alt={esc.name}
                                                            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                                        />
                                                    </Box>
                                                )}
                                                <Card.Body>
                                                    {esc.name && (
                                                        <Heading size="sm" mb={2} color={isDarkMode ? "white" : "gray.900"}>{esc.name}</Heading>
                                                    )}
                                                    {esc.address && (
                                                        <Text fontSize="sm" color={isDarkMode ? "gray.300" : "gray.600"} mb={2}>{esc.address}</Text>
                                                    )}
                                                    {esc.hours && (
                                                        <Text fontSize="sm" mb={2} color="blue.600">🕐 {esc.hours}</Text>
                                                    )}
                                                    {(esc.rating !== 0 || esc.price !== 0) && (
                                                        <HStack justify="space-between" mb={2}>
                                                            {esc.rating !== 0 && (
                                                                <Badge colorPalette="yellow">⭐ {esc.rating}</Badge>
                                                            )}
                                                            {esc.price !== 0 && (
                                                                <Text fontWeight="bold" color={isDarkMode ? "cyan.300" : esc.price === 0 ? "green.600" : "teal.700"}>
                                                                    {esc.price === 0 ? "Gratuito" : `€${esc.price}`}
                                                                </Text>
                                                            )}
                                                        </HStack>
                                                    )}
                                                    {esc.notes && (
                                                        <Text fontSize="sm" mt={2} mb={3} fontStyle="italic" color={isDarkMode ? "gray.300" : "gray.600"}>{esc.notes}</Text>
                                                    )}
                                                    {esc.link && (
                                                        <Button
                                                            as="a"
                                                            href={esc.link}
                                                            target="_blank"
                                                            size="sm"
                                                            colorPalette="blue"
                                                            variant={isDarkMode ? "solid" : "outline"}
                                                            w="full"
                                                            bg={isDarkMode ? "blue.600" : undefined}
                                                            color={isDarkMode ? "white" : undefined}
                                                            _hover={{
                                                                bg: isDarkMode ? "blue.700" : undefined,
                                                                opacity: isDarkMode ? 1 : undefined
                                                            }}
                                                        >
                                                            🔗 Sito web
                                                        </Button>
                                                    )}
                                                    {esc.mapsLink && (
                                                        <Button
                                                            as="a"
                                                            href={esc.mapsLink}
                                                            target="_blank"
                                                            size="sm"
                                                            colorPalette="green"
                                                            variant={isDarkMode ? "solid" : "outline"}
                                                            w="full"
                                                            bg={isDarkMode ? "green.600" : undefined}
                                                            color={isDarkMode ? "white" : undefined}
                                                            _hover={{
                                                                bg: isDarkMode ? "green.700" : undefined,
                                                                opacity: isDarkMode ? 1 : undefined
                                                            }}
                                                        >
                                                            🗺️ Maps
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