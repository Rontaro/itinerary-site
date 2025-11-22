import React, { useState } from 'react';
import {Badge, Box, Button, Card, Container, For, Heading, HStack, Text, VStack} from '@chakra-ui/react';
import 'leaflet/dist/leaflet.css';
import SafeImage from "../utils/SafeImage";

export default function CityDetails({city, trip, onBack, isDarkMode}) {
    // Stato per tracciare l'opzione selezionata per ogni giorno
    const [selectedOptions, setSelectedOptions] = useState({});

    // Funzione per raggruppare le attività per multipleOption
    const groupActivitiesByOption = (activities) => {
        const grouped = {
            regular: [], // Attività senza multipleOption
            options: {} // Attività raggruppate per opzione
        };

        activities.forEach(activity => {
            if (activity.multipleOption) {
                const option = activity.multipleOption;
                if (!grouped.options[option]) {
                    grouped.options[option] = [];
                }
                grouped.options[option].push(activity);
            } else {
                grouped.regular.push(activity);
            }
        });

        return grouped;
    };

    // Funzione per ottenere il nome dell'opzione
    const getOptionName = (activities) => {
        if (activities.length === 0) return '';
        const firstActivity = activities[0];
        return `Opzione ${firstActivity.multipleOption}`;
    };

    // Funzione per gestire la selezione dell'opzione
    const handleOptionSelect = (dayIndex, option) => {
        setSelectedOptions(prev => ({
            ...prev,
            [dayIndex]: option
        }));
    };

    // Funzione per ottenere le attività da mostrare per un giorno
    const getActivitiesToShow = (day, dayIndex) => {
        const grouped = groupActivitiesByOption(day.activities);
        const selectedOption = selectedOptions[dayIndex];

        // Se c'è un'opzione selezionata, mostra SOLO le attività di quell'opzione
        if (selectedOption && grouped.options[selectedOption]) {
            return grouped.options[selectedOption];
        }

        // Se ci sono opzioni multiple ma nessuna è selezionata, mostra solo le attività regolari
        if (Object.keys(grouped.options).length > 0) {
            return grouped.regular;
        }

        // Altrimenti mostra tutte le attività (giorni senza opzioni multiple)
        return day.activities;
    };

    return (
        <Container maxW="7xl" py={8}>
            <VStack gap={6} align="stretch">
                <Button onClick={onBack} alignSelf="flex-start" colorPalette="teal" variant="outline">
                    ← Torna alle città
                </Button>

                <Box bg={isDarkMode ? "gray.700" : "blue.50"} p={6} borderRadius="lg">
                    <Heading size="xl" mb={4} color={isDarkMode ? "cyan.200" : "gray.900"}>{city.name}</Heading>

                    {city.hotel && (
                        <Card.Root bg={isDarkMode ? "gray.600" : "white"} mb={4}>
                            <Card.Body>
                                <HStack justify="space-between" align="start">
                                    <VStack align="stretch" gap={2}>
                                        <Heading size="md" color={isDarkMode ? "white" : "gray.900"}>🏨 {city.hotel.name}</Heading>
                                        <Text color={isDarkMode ? "gray.300" : "gray.600"}>{city.hotel.address}</Text>
                                        {(city.hotel.rating !== 0 || city.hotel.price !== 0) && (
                                            <HStack>
                                                {city.hotel.rating !== 0 && (
                                                    <Badge colorPalette="yellow">⭐ {city.hotel.rating}</Badge>
                                                )}
                                                {city.hotel.price !== 0 && (
                                                    <Text fontWeight="bold" color={isDarkMode ? "cyan.300" : "teal.700"}>€{city.hotel.price}/notte</Text>
                                                )}
                                            </HStack>
                                        )}
                                        {city.hotel.notes && (
                                            <Text fontSize="sm" fontStyle="italic"
                                                  color={isDarkMode ? "gray.300" : "gray.600"}>{city.hotel.notes}</Text>
                                        )}
                                    </VStack>
                                    <VStack gap={2}>
                                        {city.hotel.bookingLink && (
                                            <Button
                                                as="a"
                                                href={city.hotel.bookingLink}
                                                target="_blank"
                                                size="sm"
                                                colorPalette="blue"
                                            >
                                                📅 Booking
                                            </Button>
                                        )}
                                        {city.hotel.mapsLink && (
                                            <Button
                                                as="a"
                                                href={city.hotel.mapsLink}
                                                target="_blank"
                                                size="sm"
                                                colorPalette="green"
                                            >
                                                🗺️ Maps
                                            </Button>
                                        )}
                                    </VStack>
                                </HStack>
                            </Card.Body>
                        </Card.Root>
                    )}
                </Box>

                <VStack gap={6} align="stretch">
                    <For each={city.days}>
                        {(day, idx) => {
                            const grouped = groupActivitiesByOption(day.activities);
                            const hasMultipleOptions = Object.keys(grouped.options).length > 0;
                            const activitiesToShow = getActivitiesToShow(day, idx);
                            
                            return (
                            <Box key={idx} borderWidth="1px" borderRadius="lg" p={4} bg={isDarkMode ? "gray.700" : "white"} borderColor={isDarkMode ? "gray.600" : "gray.200"}>
                                <Heading size="md" mb={4} color={isDarkMode ? "cyan.300" : "teal.700"}>
                                    {new Date(day.date).toLocaleDateString('it-IT', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })} - Giorno {idx + 1}
                                </Heading>

                                {hasMultipleOptions && (
                                    <Box mb={4} p={3} bg={isDarkMode ? "gray.600" : "gray.50"} borderRadius="md">
                                        <Text fontSize="sm" fontWeight="bold" mb={2} color={isDarkMode ? "gray.300" : "gray.700"}>
                                            Seleziona un'opzione:
                                        </Text>
                                        <HStack gap={2} flexWrap="wrap">
                                            {Object.entries(grouped.options).map(([option, activities]) => {
                                                const optionName = getOptionName(activities);
                                                const isSelected = selectedOptions[idx] === option;
                                                return (
                                                    <Button
                                                        key={option}
                                                        onClick={() => handleOptionSelect(idx, option)}
                                                        colorPalette={isSelected ? "teal" : "gray"}
                                                        variant={isSelected ? "solid" : "outline"}
                                                        size="sm"
                                                    >
                                                        {optionName}
                                                    </Button>
                                                );
                                            })}
                                        </HStack>
                                    </Box>
                                )}

                                <VStack gap={3} align="stretch">
                                    <For each={activitiesToShow}>
                                        {(activity, i) => (
                                            activity.type === "transport" && activity.from ?
                                                <Box bg="blue.100" p={4} borderRadius="md" borderWidth="2px"
                                                     borderColor="blue.300">
                                                    <HStack justify="space-between">
                                                        <HStack gap={3}>
                                                            <Text fontSize="2xl">🚄</Text>
                                                            <VStack align="start" gap={0}>
                                                                <Text fontWeight="bold" fontSize="lg" color="gray.900">
                                                                    Trasferimento: {activity.from} → {activity.to}
                                                                </Text>
                                                                {activity.distance && <Text fontSize="sm" color="gray.700">
                                                                    Distanza: {activity.distance}
                                                                </Text>}
                                                                {activity.timeS && <Text fontSize="sm" color="gray.700">
                                                                    Orario partenza: {activity.timeS}
                                                                </Text>}
                                                                {activity.timeE && <Text fontSize="sm" color="gray.700">
                                                                    Orario arrivo: {activity.timeE}
                                                                </Text>}
                                                                {activity.name && (
                                                                    <Text fontSize="sm" fontStyle="italic"
                                                                          color="gray.600">{activity.name}</Text>
                                                                )}
                                                                {activity.notes && (
                                                                    <Text fontSize="sm" fontStyle="italic"
                                                                          color="gray.600">{activity.notes}</Text>
                                                                )}
                                                                {activity.link && (
                                                                    <Button
                                                                        as="a"
                                                                        href={activity.link}
                                                                        target="_blank"
                                                                        size="xs"
                                                                        colorPalette="blue"
                                                                        variant="outline"
                                                                        alignSelf="flex-start"
                                                                    >
                                                                        🔗 Link
                                                                    </Button>
                                                                )}
                                                            </VStack>
                                                        </HStack>
                                                        {activity.cost && activity.cost !== 0 && <Badge colorPalette="green"
                                                               fontSize="lg">€{activity.cost}</Badge>}
                                                    </HStack>
                                                </Box>
                                                : <Box
                                                    key={i}
                                                    p={3}
                                                    borderWidth="1px"
                                                    borderRadius="md"
                                                    bg={isDarkMode ? "gray.700" : "gray.50"}
                                                    _hover={{bg: isDarkMode ? "gray.650" : "gray.100"}}
                                                    transition="all 0.2s"
                                                    borderColor={isDarkMode ? "gray.600" : "gray.200"}
                                                >
                                                    <HStack align="start" gap={4}>
                                                        {activity.image && (
                                                            <Box
                                                                w="80px"
                                                                h="80px"
                                                                borderRadius="md"
                                                                overflow="hidden"
                                                                flexShrink={0}
                                                            >
                                                                <SafeImage
                                                                    src={activity.image}
                                                                    alt={activity.name}
                                                                    style={{
                                                                        width: '100%',
                                                                        height: '100%',
                                                                        objectFit: 'cover'
                                                                    }}
                                                                />
                                                            </Box>
                                                        )}
                                                        <VStack align="stretch" gap={1} flex={1}>
                                                            <HStack justify="space-between">
                                                                <HStack>
                                                                    <Text fontWeight="bold" fontSize="sm"
                                                                          color={isDarkMode ? "gray.400" : "gray.600"}>{activity.time}</Text>
                                                                    <Badge colorPalette={
                                                                        activity.type === 'food' ? 'orange' :
                                                                            activity.type === 'accommodation' ? 'purple' :
                                                                                activity.type === 'transport' ? 'blue' :
                                                                                    activity.type === 'shopping' ? 'pink' :
                                                                                        'green'
                                                                    }>
                                                                        {activity.type}
                                                                    </Badge>
                                                                </HStack>
                                                                {activity.cost !== 0 && <Text fontWeight="bold"
                                                                      color={isDarkMode ? "cyan.300" : "teal.700"}>€{activity.cost}</Text>}
                                                            </HStack>
                                                            <Text fontWeight="bold" color={isDarkMode ? "white" : "gray.900"}>{activity.name}</Text>
                                                            {activity.notes && (
                                                                <Text fontSize="sm" color={isDarkMode ? "gray.300" : "gray.600"}>{activity.notes}</Text>
                                                            )}
                                                            {activity.link && (
                                                                <Button
                                                                    as="a"
                                                                    href={activity.link}
                                                                    target="_blank"
                                                                    size="xs"
                                                                    colorPalette="blue"
                                                                    variant="outline"
                                                                    alignSelf="flex-start"
                                                                >
                                                                    🔗 Link
                                                                </Button>
                                                            )}
                                                        </VStack>
                                                    </HStack>
                                                </Box>
                                        )}
                                    </For>
                                </VStack>

                            </Box>
                            );
                        }}
                    </For>
                </VStack>
            </VStack>
        </Container>
    );
}
