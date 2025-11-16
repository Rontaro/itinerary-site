import React from 'react';
import { Button, HStack, VStack, Badge, Text, Heading, Box } from '@chakra-ui/react';
import SafeImage from '../utils/SafeImage';

/**
 * Componente riutilizzabile per card di posti (hotel, ristorante, attrazione, escursione)
 */
export default function PlaceCard({
    title,
    address,
    image,
    rating,
    price,
    specialty,
    hours,
    notes,
    links = [],
    isDarkMode = false,
    priceFormat = 'full' // 'full' per €price, 'pernight' per €price/notte, 'free' se price === 0
}) {
    const formatPrice = () => {
        if (!price || price === 0) {
            if (priceFormat === 'free') return 'Gratuito';
            return null;
        }
        if (priceFormat === 'pernight') return `€${price}/notte`;
        return `€${price}`;
    };

    const priceDisplay = formatPrice();

    return (
        <div style={{
            background: isDarkMode ? '#2D3748' : '#ffffff',
            border: `1px solid ${isDarkMode ? '#4A5568' : '#E2E8F0'}`,
            borderRadius: '0.5rem',
            overflow: 'hidden'
        }}>
            {image && (
                <Box overflow="hidden">
                    <SafeImage
                        src={image}
                        alt={title}
                        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    />
                </Box>
            )}
            <div style={{ padding: '1rem' }}>
                {title && (
                    <Heading size="sm" mb={2} color={isDarkMode ? 'white' : 'gray.900'}>
                        {title}
                    </Heading>
                )}

                {address && (
                    <Text fontSize="sm" color={isDarkMode ? 'gray.300' : 'gray.600'} mb={2}>
                        {address}
                    </Text>
                )}

                {specialty && (
                    <Text fontSize="sm" mb={2} color="orange.600" fontWeight="bold">
                        {specialty}
                    </Text>
                )}

                {hours && (
                    <Text fontSize="sm" mb={2} color="blue.600">
                        🕐 {hours}
                    </Text>
                )}

                {(rating !== undefined && rating !== 0) || priceDisplay ? (
                    <HStack justify="space-between" mb={2}>
                        {rating !== undefined && rating !== 0 && (
                            <Badge colorPalette="yellow">⭐ {rating}</Badge>
                        )}
                        {priceDisplay && (
                            <Text fontWeight="bold" color={isDarkMode ? 'cyan.300' : 'teal.700'}>
                                {priceDisplay}
                            </Text>
                        )}
                    </HStack>
                ) : null}

                {notes && (
                    <Text fontSize="sm" mt={2} mb={3} fontStyle="italic" color={isDarkMode ? 'gray.300' : 'gray.600'}>
                        {notes}
                    </Text>
                )}

                {links && links.length > 0 && (
                    <VStack gap={2}>
                        {links.map((link, idx) => (
                            <Button
                                key={idx}
                                as="a"
                                href={link.url}
                                target="_blank"
                                size="sm"
                                colorPalette={link.colorPalette || 'blue'}
                                variant={isDarkMode ? 'solid' : 'outline'}
                                w="full"
                                bg={isDarkMode ? `${link.colorPalette || 'blue'}.600` : undefined}
                                color={isDarkMode ? 'white' : undefined}
                                _hover={{
                                    bg: isDarkMode ? `${link.colorPalette || 'blue'}.700` : undefined,
                                    opacity: isDarkMode ? 1 : undefined
                                }}
                            >
                                {link.label || '🔗 Link'}
                            </Button>
                        ))}
                    </VStack>
                )}
            </div>
        </div>
    );
}

