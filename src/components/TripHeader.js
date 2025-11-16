import React from 'react';
import { Box, HStack, SimpleGrid, Stat, Heading, Text, Badge, Separator } from '@chakra-ui/react';

/**
 * Componente header per il trip con info principali e stats
 */
export default function TripHeader({
    trip,
    tripDays,
    totalCost,
    isDarkMode = false
}) {
    return (
        <Box bg={isDarkMode ? 'gray.700' : 'blue.50'} p={6} borderRadius="lg">
            <HStack justify="space-between" mb={4}>
                <Heading size="2xl" color={isDarkMode ? 'cyan.200' : 'gray.900'}>
                    {trip.image} {trip.name}
                </Heading>
                {trip.isPrivate && (
                    <Badge colorPalette="purple" fontSize="md">
                        🔒 Viaggio Privato
                    </Badge>
                )}
            </HStack>

            <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                <Box>
                    <Text fontWeight="bold" color={isDarkMode ? 'gray.400' : 'gray.600'}>
                        Destinazione
                    </Text>
                    <Text fontSize="lg" color={isDarkMode ? 'white' : 'gray.900'}>
                        {trip.destination}
                    </Text>
                </Box>
                <Box>
                    <Text fontWeight="bold" color={isDarkMode ? 'gray.400' : 'gray.600'}>
                        Periodo
                    </Text>
                    <Text fontSize="lg" color={isDarkMode ? 'white' : 'gray.900'}>
                        {new Date(trip.startDate).toLocaleDateString('it-IT')} -{' '}
                        {new Date(trip.endDate).toLocaleDateString('it-IT')}
                    </Text>
                </Box>
                <Box>
                    <Text fontWeight="bold" color={isDarkMode ? 'gray.400' : 'gray.600'}>
                        Durata
                    </Text>
                    <Text fontSize="lg" color={isDarkMode ? 'white' : 'gray.900'}>
                        {tripDays} giorni
                    </Text>
                </Box>
            </SimpleGrid>

            {trip.budget !== 0 && <Separator my={4} />}

            {trip.budget !== 0 && (
                <HStack gap={8}>
                    <Stat.Root>
                        <Stat.Label>Budget Previsto</Stat.Label>
                        <Stat.ValueText>€{trip.budget}</Stat.ValueText>
                    </Stat.Root>
                    <Stat.Root>
                        <Stat.Label>Spesa Stimata</Stat.Label>
                        <Stat.ValueText
                            color={totalCost > trip.budget ? 'red.500' : 'green.500'}
                        >
                            €{totalCost.toFixed(2)}
                        </Stat.ValueText>
                    </Stat.Root>
                    <Stat.Root>
                        <Stat.Label>Differenza</Stat.Label>
                        <Stat.ValueText
                            color={totalCost > trip.budget ? 'red.500' : 'green.500'}
                        >
                            €{(trip.budget - totalCost).toFixed(2)}
                        </Stat.ValueText>
                    </Stat.Root>
                </HStack>
            )}
        </Box>
    );
}

