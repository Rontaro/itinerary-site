import {
    Box,
    Button,
    Container,
    For,
    Heading,
    VStack,
    Tabs
} from "@chakra-ui/react";
import {MapContainer, Marker, Polyline, Popup, TileLayer} from "react-leaflet";
import React, {useState, useMemo} from "react";
import CityDetails from "../CityDetails";
import TripHeader from "../components/TripHeader";
import CityCard from "../components/CityCard";
import PlaceGrid from "../components/PlaceGrid";
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
                        <Tabs.Trigger
                            value="checklist"
                            color={isDarkMode ? "white" : "gray.900"}
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
                            <PlaceGrid
                                title="🏨 Hotel"
                                places={trip.places.hotels}
                                isDarkMode={isDarkMode}
                                priceFormat="pernight"
                            />
                            <PlaceGrid
                                title="🍽️ Ristoranti"
                                places={trip.places.restaurants}
                                isDarkMode={isDarkMode}
                            />
                            <PlaceGrid
                                title="🏛️ Attrazioni"
                                places={trip.places.attractions}
                                isDarkMode={isDarkMode}
                            />
                            <PlaceGrid
                                title="🏛️ Escursioni"
                                places={trip.places.excursions}
                                isDarkMode={isDarkMode}
                            />
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