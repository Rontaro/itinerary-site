import React from 'react';
import { SimpleGrid, Heading, Box } from '@chakra-ui/react';
import PlaceCard from './PlaceCard';

/**
 * Componente per visualizzare una griglia di posti (hotel, ristoranti, attrazioni, escursioni)
 */
export default function PlaceGrid({
    title,
    places = [],
    isDarkMode = false,
    priceFormat = 'full'
}) {
    if (!places || places.length === 0) return null;

    return (
        <Box>
            <Heading size="md" mb={4} color={isDarkMode ? 'white' : 'gray.900'}>
                {title}
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                {places.map((place, idx) => {
                    // Costruisci dinamicamente l'array di link basato sul tipo di posto
                    const links = [];
                    if (place.bookingLink) {
                        links.push({
                            label: '📅 Booking',
                            url: place.bookingLink,
                            colorPalette: 'blue'
                        });
                    }
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
                            hours={place.hours}
                            notes={place.notes}
                            links={links}
                            isDarkMode={isDarkMode}
                            priceFormat={priceFormat}
                        />
                    );
                })}
            </SimpleGrid>
        </Box>
    );
}

