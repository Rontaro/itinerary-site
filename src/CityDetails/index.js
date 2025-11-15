import React from 'react';
import {Badge, Box, Button, Card, Container, For, Heading, HStack, Text, VStack} from '@chakra-ui/react';
import 'leaflet/dist/leaflet.css';
import SafeImage from "../utils/SafeImage";

export default function CityDetails({city, trip, onBack}) {
    return (
        <Container maxW="7xl" py={8}>
            <VStack gap={6} align="stretch">
                <Button onClick={onBack} alignSelf="flex-start" colorPalette="teal" variant="outline">
                    ← Torna alle città
                </Button>

                <Box bg="teal.50" p={6} borderRadius="lg">
                    <Heading size="xl" mb={4}>{city.name}</Heading>

                    {city.hotel && (
                        <Card.Root bg="white" mb={4}>
                            <Card.Body>
                                <HStack justify="space-between" align="start">
                                    <VStack align="stretch" gap={2}>
                                        <Heading size="md">🏨 {city.hotel.name}</Heading>
                                        <Text color="gray.600">{city.hotel.address}</Text>
                                        <HStack>
                                            <Badge colorPalette="yellow">⭐ {city.hotel.rating}</Badge>
                                            <Text fontWeight="bold" color="teal.600">€{city.hotel.price}/notte</Text>
                                        </HStack>
                                        {city.hotel.notes && (
                                            <Text fontSize="sm" fontStyle="italic"
                                                  color="gray.600">{city.hotel.notes}</Text>
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
                        {(day, idx) => (
                            <Box key={idx} borderWidth="1px" borderRadius="lg" p={4} bg="white">
                                <Heading size="md" mb={4} color="teal.600">
                                    {new Date(day.date).toLocaleDateString('it-IT', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })} - Giorno {idx + 1}
                                </Heading>

                                <VStack gap={3} align="stretch">
                                    <For each={day.activities}>
                                        {(activity, i) => (
                                            activity.type === "transport" && activity.from ?
                                                <Box bg="blue.100" p={4} borderRadius="md" borderWidth="2px"
                                                     borderColor="blue.300">
                                                    <HStack justify="space-between">
                                                        <HStack gap={3}>
                                                            <Text fontSize="2xl">🚄</Text>
                                                            <VStack align="start" gap={0}>
                                                                <Text fontWeight="bold" fontSize="lg">
                                                                    Trasferimento: {activity.from} → {activity.to}
                                                                </Text>
                                                                <Text fontSize="sm" color="gray.700">
                                                                    Distanza: {activity.distance}
                                                                </Text>
                                                                {activity.notes && (
                                                                    <Text fontSize="sm" fontStyle="italic"
                                                                          color="gray.600">{activity.notes}</Text>
                                                                )}
                                                            </VStack>
                                                        </HStack>
                                                        <Badge colorPalette="green"
                                                               fontSize="lg">€{activity.cost}</Badge>
                                                    </HStack>
                                                </Box> : <Box
                                                    key={i}
                                                    p={3}
                                                    borderWidth="1px"
                                                    borderRadius="md"
                                                    bg="gray.50"
                                                    _hover={{bg: "gray.100"}}
                                                    transition="all 0.2s"
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
                                                                          color="gray.600">{activity.time}</Text>
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
                                                                      color="teal.600">€{activity.cost}</Text>}
                                                            </HStack>
                                                            <Text fontWeight="bold">{activity.name}</Text>
                                                            {activity.notes && (
                                                                <Text fontSize="sm" color="gray.600">{activity.notes}</Text>
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
                                                                    🔗 Sito web
                                                                </Button>
                                                            )}
                                                        </VStack>
                                                    </HStack>
                                                </Box>
                                        )}
                                    </For>
                                </VStack>

                            </Box>
                        )}
                    </For>
                </VStack>
            </VStack>
        </Container>
    );
}
