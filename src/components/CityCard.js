import React from 'react';
import { Box, Card, HStack, VStack, Badge, Text, Heading, Button } from '@chakra-ui/react';

/**
 * Componente per la card della città nella timeline
 */
export default function CityCard({
    name,
    days,
    startDate,
    endDate,
    hotel,
    onClick,
    isDarkMode = false
}) {
    const startDateFormatted = new Date(startDate).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
    const endDateFormatted = new Date(endDate).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' });
    const daysCount = days.length;

    return (
        <Card.Root
            cursor="pointer"
            onClick={onClick}
            _hover={{ transform: 'scale(1.02)', shadow: 'lg' }}
            transition="all 0.2s"
            bg={isDarkMode ? 'gray.700' : 'white'}
            borderColor={isDarkMode ? 'gray.600' : 'gray.300'}
        >
            <Card.Body>
                <VStack align="stretch" gap={3}>
                    <HStack justify="space-between">
                        <Heading size="md" color={isDarkMode ? 'white' : 'gray.900'}>
                            {name}
                        </Heading>
                        <Badge colorPalette="teal">
                            {daysCount} {daysCount === 1 ? 'giorno' : 'giorni'}
                        </Badge>
                    </HStack>

                    <Text fontSize="sm" color={isDarkMode ? 'gray.300' : 'gray.600'}>
                        {startDateFormatted} - {endDateFormatted}
                    </Text>

                    {hotel && hotel.name && hotel.address && (
                        <Box bg={isDarkMode ? 'gray.600' : 'blue.50'} p={2} borderRadius="md">
                            <Text fontSize="sm" fontWeight="bold" color={isDarkMode ? 'white' : 'gray.900'}>
                                🏨 {hotel.name}
                            </Text>
                            <Text fontSize="xs" color={isDarkMode ? 'gray.300' : 'gray.600'}>
                                {hotel.address}
                            </Text>
                        </Box>
                    )}

                    <Button size="sm" colorPalette="teal" variant="outline">
                        Vedi dettagli →
                    </Button>
                </VStack>
            </Card.Body>
        </Card.Root>
    );
}
