import {
    Box,
    Button,
    Card,
    Container,
    For,
    Heading,
    HStack,
    SimpleGrid,
    Text,
    VStack,
    Tabs
} from "@chakra-ui/react";
import {MapContainer, Marker, Polyline, Popup, TileLayer} from "react-leaflet";
import React, {useState, useMemo} from "react";
import CityDetails from "../CityDetails";
import TripHeader from "../components/TripHeader";
import CityCard from "../components/CityCard";
import PlaceCard from "../components/PlaceCard";
import TodoGrid from "../components/TodoGrid";
import LinkGrid from "../components/LinkGrid";
import { useLocalStorage, generateStorageKey } from "../utils/useLocalStorage";

// Funzione utility per calcolare il costo totale del viaggio
function calculateTotalCost(trip) {
    let total = 0;
    if (trip?.cities) {
        trip.cities.forEach(city => {
            if (city.days) {
                city.days.forEach(day => {
                    if (day.activities) {
                        total += day.activities.reduce((sum, activity) => sum + (activity.cost || 0), 0);
                    }
                });
            }
        });
    }
    return total;
}

// Funzione utility per calcolare la durata del viaggio in giorni
function calculateTripDays(startDate, endDate) {
    return Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;
}

export default function TripOverview({ trip, onBack, isDarkMode }) {
    const [selectedCity, setSelectedCity] = useState(null);
    // Stato per tracciare la zona selezionata per ogni categoria
    const [selectedZone, setSelectedZone] = useState({
        hotels: null,
        restaurants: null,
        attractions: null,
        excursions: null
    });

    // Usa il custom hook per la persistenza su localStorage
    const storageKey = useMemo(() => generateStorageKey(trip), [trip]);
    const [completedTodos, setCompletedTodos] = useLocalStorage(storageKey, {});

    // Calcola valori memoizzati
    const totalCost = useMemo(() => calculateTotalCost(trip), [trip]);
    const tripDays = useMemo(() => calculateTripDays(trip.startDate, trip.endDate), [trip?.startDate, trip?.endDate]);

    // Toggle o setta esplicitamente lo stato del todo
    const toggleTodo = (todoTitle, value) => {
        setCompletedTodos(prev => ({
            ...prev,
            [todoTitle]: typeof value === 'boolean' ? value : !prev[todoTitle]
        }));
    };

    // Funzione per raggruppare i places per zone
    const groupPlacesByZone = (places) => {
        const grouped = {};
        if (!places || !Array.isArray(places)) {
            return grouped;
        }
        places.forEach(place => {
            // Accedi al campo zone direttamente dall'oggetto place
            const zone = place?.zone || 'Altro';
            if (!grouped[zone]) {
                grouped[zone] = [];
            }
            grouped[zone].push(place);
        });
        return grouped;
    };

    // Funzione per gestire la selezione della zona
    const handleZoneSelect = (category, zone) => {
        setSelectedZone(prev => ({
            ...prev,
            [category]: prev[category] === zone ? null : zone
        }));
    };

    // Funzione per ottenere i places da mostrare per una categoria
    const getPlacesToShow = (places, category) => {
        const grouped = groupPlacesByZone(places);
        const selected = selectedZone[category];
        
        // Se c'è una zona selezionata, mostra SOLO i places di quella zona
        if (selected && grouped[selected]) {
            return grouped[selected];
        }
        
        // Altrimenti mostra tutti i places (nessuna zona selezionata)
        return places;
    };


    return (
        <Container maxW="7xl" py={8}>
            <VStack gap={6} align="stretch">
                <Button onClick={onBack} alignSelf="flex-start" colorPalette="teal" variant="outline">
                    ← Torna ai viaggi
                </Button>

                <TripHeader
                    trip={trip}
                    tripDays={tripDays}
                    totalCost={totalCost}
                    isDarkMode={isDarkMode}
                />

                <Tabs.Root defaultValue="timeline" variant="enclosed" colorPalette="teal">
                    <Tabs.List 
                        bg={isDarkMode ? "gray.700" : "white"} 
                        borderColor={isDarkMode ? "gray.600" : "gray.300"}
                        flexWrap="wrap"
                        gap={0}
                    >
                        <Tabs.Trigger
                            value="timeline"
                            color={isDarkMode ? "white" : "gray.900"}
                            fontSize={{ base: "sm", md: "md" }}
                            px={{ base: 3, md: 4 }}
                            py={{ base: 2, md: 3 }}
                            flex={{ base: "1 1 calc(50% - 1px)", md: "none" }}
                            minW={{ base: "calc(50% - 1px)", md: "auto" }}
                            maxW={{ base: "calc(50% - 1px)", md: "none" }}
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
                            fontSize={{ base: "sm", md: "md" }}
                            px={{ base: 3, md: 4 }}
                            py={{ base: 2, md: 3 }}
                            flex={{ base: "1 1 calc(50% - 1px)", md: "none" }}
                            minW={{ base: "calc(50% - 1px)", md: "auto" }}
                            maxW={{ base: "calc(50% - 1px)", md: "none" }}
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
                            fontSize={{ base: "sm", md: "md" }}
                            px={{ base: 3, md: 4 }}
                            py={{ base: 2, md: 3 }}
                            flex={{ base: "1 1 calc(50% - 1px)", md: "none" }}
                            minW={{ base: "calc(50% - 1px)", md: "auto" }}
                            maxW={{ base: "calc(50% - 1px)", md: "none" }}
                            _selected={{
                                bg: isDarkMode ? "teal.700" : "teal.50",
                                color: isDarkMode ? "cyan.200" : "teal.900",
                                fontWeight: "bold"
                            }}
                        >
                            🗺️ Mappa
                        </Tabs.Trigger>
                        <Tabs.Trigger
                            value="checklist"
                            color={isDarkMode ? "white" : "gray.900"}
                            fontSize={{ base: "sm", md: "md" }}
                            px={{ base: 3, md: 4 }}
                            py={{ base: 2, md: 3 }}
                            flex={{ base: "1 1 calc(50% - 1px)", md: "none" }}
                            minW={{ base: "calc(50% - 1px)", md: "auto" }}
                            maxW={{ base: "calc(50% - 1px)", md: "none" }}
                            _selected={{
                                bg: isDarkMode ? "teal.700" : "teal.50",
                                color: isDarkMode ? "cyan.200" : "teal.900",
                                fontWeight: "bold"
                            }}
                        >
                            ✅ Checklist
                        </Tabs.Trigger>
                        <Tabs.Trigger
                            value="links"
                            color={isDarkMode ? "white" : "gray.900"}
                            fontSize={{ base: "sm", md: "md" }}
                            px={{ base: 3, md: 4 }}
                            py={{ base: 2, md: 3 }}
                            flex={{ base: "1 1 calc(50% - 1px)", md: "none" }}
                            minW={{ base: "calc(50% - 1px)", md: "auto" }}
                            maxW={{ base: "calc(50% - 1px)", md: "none" }}
                            _selected={{
                                bg: isDarkMode ? "teal.700" : "teal.50",
                                color: isDarkMode ? "cyan.200" : "teal.900",
                                fontWeight: "bold"
                            }}
                        >
                            🔗 Link Utili
                        </Tabs.Trigger>
                    </Tabs.List>

                    <Tabs.Content value="timeline" py={4}>
                        <VStack gap={6} align="stretch">
                            {!selectedCity && (
                                <>
                                    <Heading size="lg" mb={4} color={isDarkMode ? "white" : "gray.900"}>
                                        Seleziona una città per vedere i dettagli
                                    </Heading>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                                        <For each={trip.cities}>
                                            {(cityData) => {
                                                const startDate = cityData.days[0].date;
                                                const endDate = cityData.days[cityData.days.length - 1].date;

                                                return (
                                                    <CityCard
                                                        key={cityData.name}
                                                        name={cityData.name}
                                                        days={cityData.days}
                                                        startDate={startDate}
                                                        endDate={endDate}
                                                        hotel={cityData.hotel}
                                                        onClick={() => setSelectedCity(cityData)}
                                                        isDarkMode={isDarkMode}
                                                    />
                                                );
                                            }}
                                        </For>
                                    </div>
                                </>
                            )}
                            {selectedCity && (
                                <CityDetails
                                    trip={trip}
                                    city={selectedCity}
                                    onBack={() => setSelectedCity(null)}
                                    isDarkMode={isDarkMode}
                                />
                            )}
                        </VStack>
                    </Tabs.Content>

                    <Tabs.Content value="details" py={4}>
                        <VStack gap={6} align="stretch">
                            {/* Hotels */}
                            {trip.places?.hotels && trip.places.hotels.length > 0 && (() => {
                                const grouped = groupPlacesByZone(trip.places.hotels);
                                const zones = Object.keys(grouped);
                                const selected = selectedZone.hotels;
                                const placesToShow = getPlacesToShow(trip.places.hotels, 'hotels');
                                
                                return (
                                    <Box>
                                        <Heading size="md" mb={4} color={isDarkMode ? 'white' : 'gray.900'}>
                                            🏨 Hotel
                                        </Heading>
                                        {!selected && zones.length > 0 && (
                                            <Box mb={4}>
                                                <Text fontSize="sm" fontWeight="bold" mb={3} color={isDarkMode ? 'gray.300' : 'gray.700'}>
                                                    Seleziona una zona:
                                                </Text>
                                                <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} gap={3}>
                                                    {zones.map((zone) => (
                                                        <Card.Root
                                                            key={zone}
                                                            cursor="pointer"
                                                            onClick={() => handleZoneSelect('hotels', zone)}
                                                            bg={isDarkMode ? 'gray.700' : 'white'}
                                                            borderWidth="1px"
                                                            borderColor={isDarkMode ? 'gray.600' : 'gray.200'}
                                                            _hover={{
                                                                bg: isDarkMode ? 'gray.650' : 'gray.50',
                                                                borderColor: isDarkMode ? 'teal.600' : 'teal.300'
                                                            }}
                                                            transition="all 0.2s"
                                                        >
                                                            <Card.Body>
                                                                <VStack gap={1}>
                                                                    <Text fontWeight="bold" color={isDarkMode ? 'white' : 'gray.900'}>
                                                                        {zone}
                                                                    </Text>
                                                                    <Text fontSize="sm" color={isDarkMode ? 'gray.400' : 'gray.600'}>
                                                                        {grouped[zone].length} {grouped[zone].length === 1 ? 'hotel' : 'hotels'}
                                                                    </Text>
                                                                </VStack>
                                                            </Card.Body>
                                                        </Card.Root>
                                                    ))}
                                                </SimpleGrid>
                                            </Box>
                                        )}
                                        {selected && (
                                            <>
                                                <Box mb={4}>
                                                    <HStack gap={2} mb={3}>
                                                        <Button
                                                            onClick={() => handleZoneSelect('hotels', selected)}
                                                            size="sm"
                                                            colorPalette="teal"
                                                            variant="outline"
                                                        >
                                                            ← Torna alle zone
                                                        </Button>
                                                        <Text fontWeight="bold" color={isDarkMode ? 'white' : 'gray.900'}>
                                                            Zona: {selected}
                                                        </Text>
                                                    </HStack>
                                                </Box>
                                                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                                                    {placesToShow.map((place, idx) => {
                                                        const links = [];
                                                        if (place.bookingLink) {
                                                            links.push({
                                                                label: '📅 Booking',
                                                                url: place.bookingLink,
                                                                colorPalette: 'blue'
                                                            });
                                                        }
                                                        if (place.mapsLink) {
                                                            links.push({
                                                                label: '🗺️ Maps',
                                                                url: place.mapsLink,
                                                                colorPalette: 'green'
                                                            });
                                                        }
                                                        return (
                                                            <PlaceCard
                                                                key={idx}
                                                                title={place.name}
                                                                address={place.address}
                                                                image={place.image}
                                                                rating={place.rating}
                                                                price={place.price}
                                                                notes={place.notes}
                                                                links={links}
                                                                isDarkMode={isDarkMode}
                                                                priceFormat="pernight"
                                                            />
                                                        );
                                                    })}
                                                </SimpleGrid>
                                            </>
                                        )}
                                    </Box>
                                );
                            })()}

                            {/* Restaurants */}
                            {trip.places?.restaurants && trip.places.restaurants.length > 0 && (() => {
                                const grouped = groupPlacesByZone(trip.places.restaurants);
                                const zones = Object.keys(grouped);
                                const selected = selectedZone.restaurants;
                                const placesToShow = getPlacesToShow(trip.places.restaurants, 'restaurants');
                                
                                return (
                                    <Box>
                                        <Heading size="md" mb={4} color={isDarkMode ? 'white' : 'gray.900'}>
                                            🍽️ Ristoranti
                                        </Heading>
                                        {!selected && zones.length > 0 && (
                                            <Box mb={4}>
                                                <Text fontSize="sm" fontWeight="bold" mb={3} color={isDarkMode ? 'gray.300' : 'gray.700'}>
                                                    Seleziona una zona:
                                                </Text>
                                                <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} gap={3}>
                                                    {zones.map((zone) => (
                                                        <Card.Root
                                                            key={zone}
                                                            cursor="pointer"
                                                            onClick={() => handleZoneSelect('restaurants', zone)}
                                                            bg={isDarkMode ? 'gray.700' : 'white'}
                                                            borderWidth="1px"
                                                            borderColor={isDarkMode ? 'gray.600' : 'gray.200'}
                                                            _hover={{
                                                                bg: isDarkMode ? 'gray.650' : 'gray.50',
                                                                borderColor: isDarkMode ? 'teal.600' : 'teal.300'
                                                            }}
                                                            transition="all 0.2s"
                                                        >
                                                            <Card.Body>
                                                                <VStack gap={1}>
                                                                    <Text fontWeight="bold" color={isDarkMode ? 'white' : 'gray.900'}>
                                                                        {zone}
                                                                    </Text>
                                                                    <Text fontSize="sm" color={isDarkMode ? 'gray.400' : 'gray.600'}>
                                                                        {grouped[zone].length} {grouped[zone].length === 1 ? 'ristorante' : 'ristoranti'}
                                                                    </Text>
                                                                </VStack>
                                                            </Card.Body>
                                                        </Card.Root>
                                                    ))}
                                                </SimpleGrid>
                                            </Box>
                                        )}
                                        {selected && (
                                            <>
                                                <Box mb={4}>
                                                    <HStack gap={2} mb={3}>
                                                        <Button
                                                            onClick={() => handleZoneSelect('restaurants', selected)}
                                                            size="sm"
                                                            colorPalette="teal"
                                                            variant="outline"
                                                        >
                                                            ← Torna alle zone
                                                        </Button>
                                                        <Text fontWeight="bold" color={isDarkMode ? 'white' : 'gray.900'}>
                                                            Zona: {selected}
                                                        </Text>
                                                    </HStack>
                                                </Box>
                                                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                                                    {placesToShow.map((place, idx) => {
                                                        const links = [];
                                                        if (place.link) {
                                                            links.push({
                                                                label: '🔗 Sito web',
                                                                url: place.link,
                                                                colorPalette: 'blue'
                                                            });
                                                        }
                                                        if (place.mapsLink) {
                                                            links.push({
                                                                label: '🗺️ Maps',
                                                                url: place.mapsLink,
                                                                colorPalette: 'green'
                                                            });
                                                        }
                                                        return (
                                                            <PlaceCard
                                                                key={idx}
                                                                title={place.name}
                                                                address={place.address}
                                                                image={place.image}
                                                                rating={place.rating}
                                                                price={place.price}
                                                                specialty={place.specialty}
                                                                notes={place.notes}
                                                                links={links}
                                                                isDarkMode={isDarkMode}
                                                            />
                                                        );
                                                    })}
                                                </SimpleGrid>
                                            </>
                                        )}
                                    </Box>
                                );
                            })()}

                            {/* Attractions */}
                            {trip.places?.attractions && trip.places.attractions.length > 0 && (() => {
                                const grouped = groupPlacesByZone(trip.places.attractions);
                                const zones = Object.keys(grouped);
                                const selected = selectedZone.attractions;
                                const placesToShow = getPlacesToShow(trip.places.attractions, 'attractions');
                                
                                return (
                                    <Box>
                                        <Heading size="md" mb={4} color={isDarkMode ? 'white' : 'gray.900'}>
                                            🏛️ Attrazioni
                                        </Heading>
                                        {!selected && zones.length > 0 && (
                                            <Box mb={4}>
                                                <Text fontSize="sm" fontWeight="bold" mb={3} color={isDarkMode ? 'gray.300' : 'gray.700'}>
                                                    Seleziona una zona:
                                                </Text>
                                                <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} gap={3}>
                                                    {zones.map((zone) => (
                                                        <Card.Root
                                                            key={zone}
                                                            cursor="pointer"
                                                            onClick={() => handleZoneSelect('attractions', zone)}
                                                            bg={isDarkMode ? 'gray.700' : 'white'}
                                                            borderWidth="1px"
                                                            borderColor={isDarkMode ? 'gray.600' : 'gray.200'}
                                                            _hover={{
                                                                bg: isDarkMode ? 'gray.650' : 'gray.50',
                                                                borderColor: isDarkMode ? 'teal.600' : 'teal.300'
                                                            }}
                                                            transition="all 0.2s"
                                                        >
                                                            <Card.Body>
                                                                <VStack gap={1}>
                                                                    <Text fontWeight="bold" color={isDarkMode ? 'white' : 'gray.900'}>
                                                                        {zone}
                                                                    </Text>
                                                                    <Text fontSize="sm" color={isDarkMode ? 'gray.400' : 'gray.600'}>
                                                                        {grouped[zone].length} {grouped[zone].length === 1 ? 'attrazione' : 'attrazioni'}
                                                                    </Text>
                                                                </VStack>
                                                            </Card.Body>
                                                        </Card.Root>
                                                    ))}
                                                </SimpleGrid>
                                            </Box>
                                        )}
                                        {selected && (
                                            <>
                                                <Box mb={4}>
                                                    <HStack gap={2} mb={3}>
                                                        <Button
                                                            onClick={() => handleZoneSelect('attractions', selected)}
                                                            size="sm"
                                                            colorPalette="teal"
                                                            variant="outline"
                                                        >
                                                            ← Torna alle zone
                                                        </Button>
                                                        <Text fontWeight="bold" color={isDarkMode ? 'white' : 'gray.900'}>
                                                            Zona: {selected}
                                                        </Text>
                                                    </HStack>
                                                </Box>
                                                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                                                    {placesToShow.map((place, idx) => {
                                                        const links = [];
                                                        if (place.link) {
                                                            links.push({
                                                                label: '🔗 Sito web',
                                                                url: place.link,
                                                                colorPalette: 'blue'
                                                            });
                                                        }
                                                        if (place.mapsLink) {
                                                            links.push({
                                                                label: '🗺️ Maps',
                                                                url: place.mapsLink,
                                                                colorPalette: 'green'
                                                            });
                                                        }
                                                        return (
                                                            <PlaceCard
                                                                key={idx}
                                                                title={place.name}
                                                                address={place.address}
                                                                image={place.image}
                                                                rating={place.rating}
                                                                price={place.price}
                                                                hours={place.hours}
                                                                notes={place.notes}
                                                                links={links}
                                                                isDarkMode={isDarkMode}
                                                            />
                                                        );
                                                    })}
                                                </SimpleGrid>
                                            </>
                                        )}
                                    </Box>
                                );
                            })()}

                            {/* Excursions */}
                            {trip.places?.excursions && trip.places.excursions.length > 0 && (() => {
                                const grouped = groupPlacesByZone(trip.places.excursions);
                                const zones = Object.keys(grouped);
                                const selected = selectedZone.excursions;
                                const placesToShow = getPlacesToShow(trip.places.excursions, 'excursions');
                                
                                return (
                                    <Box>
                                        <Heading size="md" mb={4} color={isDarkMode ? 'white' : 'gray.900'}>
                                            🏛️ Escursioni
                                        </Heading>
                                        {!selected && zones.length > 0 && (
                                            <Box mb={4}>
                                                <Text fontSize="sm" fontWeight="bold" mb={3} color={isDarkMode ? 'gray.300' : 'gray.700'}>
                                                    Seleziona una zona:
                                                </Text>
                                                <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} gap={3}>
                                                    {zones.map((zone) => (
                                                        <Card.Root
                                                            key={zone}
                                                            cursor="pointer"
                                                            onClick={() => handleZoneSelect('excursions', zone)}
                                                            bg={isDarkMode ? 'gray.700' : 'white'}
                                                            borderWidth="1px"
                                                            borderColor={isDarkMode ? 'gray.600' : 'gray.200'}
                                                            _hover={{
                                                                bg: isDarkMode ? 'gray.650' : 'gray.50',
                                                                borderColor: isDarkMode ? 'teal.600' : 'teal.300'
                                                            }}
                                                            transition="all 0.2s"
                                                        >
                                                            <Card.Body>
                                                                <VStack gap={1}>
                                                                    <Text fontWeight="bold" color={isDarkMode ? 'white' : 'gray.900'}>
                                                                        {zone}
                                                                    </Text>
                                                                    <Text fontSize="sm" color={isDarkMode ? 'gray.400' : 'gray.600'}>
                                                                        {grouped[zone].length} {grouped[zone].length === 1 ? 'escursione' : 'escursioni'}
                                                                    </Text>
                                                                </VStack>
                                                            </Card.Body>
                                                        </Card.Root>
                                                    ))}
                                                </SimpleGrid>
                                            </Box>
                                        )}
                                        {selected && (
                                            <>
                                                <Box mb={4}>
                                                    <HStack gap={2} mb={3}>
                                                        <Button
                                                            onClick={() => handleZoneSelect('excursions', selected)}
                                                            size="sm"
                                                            colorPalette="teal"
                                                            variant="outline"
                                                        >
                                                            ← Torna alle zone
                                                        </Button>
                                                        <Text fontWeight="bold" color={isDarkMode ? 'white' : 'gray.900'}>
                                                            Zona: {selected}
                                                        </Text>
                                                    </HStack>
                                                </Box>
                                                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                                                    {placesToShow.map((place, idx) => {
                                                        const links = [];
                                                        if (place.link) {
                                                            links.push({
                                                                label: '🔗 Sito web',
                                                                url: place.link,
                                                                colorPalette: 'blue'
                                                            });
                                                        }
                                                        if (place.mapsLink) {
                                                            links.push({
                                                                label: '🗺️ Maps',
                                                                url: place.mapsLink,
                                                                colorPalette: 'green'
                                                            });
                                                        }
                                                        return (
                                                            <PlaceCard
                                                                key={idx}
                                                                title={place.name}
                                                                address={place.address}
                                                                image={place.image}
                                                                rating={place.rating}
                                                                price={place.price}
                                                                hours={place.hours}
                                                                notes={place.notes}
                                                                links={links}
                                                                isDarkMode={isDarkMode}
                                                            />
                                                        );
                                                    })}
                                                </SimpleGrid>
                                            </>
                                        )}
                                    </Box>
                                );
                            })()}
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

                    <Tabs.Content value="checklist" py={4}>
                        <VStack gap={6} align="stretch">
                            <TodoGrid
                                title="✅ Checklist Preparazione"
                                todos={trip.todos}
                                completedTodos={completedTodos}
                                onToggleTodo={toggleTodo}
                                isDarkMode={isDarkMode}
                            />
                        </VStack>
                    </Tabs.Content>

                    <Tabs.Content value="links" py={4}>
                        <VStack gap={6} align="stretch">
                            <LinkGrid
                                title="🔗 Link Utili"
                                links={trip.utilsLinks}
                                isDarkMode={isDarkMode}
                            />
                        </VStack>
                    </Tabs.Content>
                </Tabs.Root>
            </VStack>
        </Container>
    );
}