import React from 'react';
import { SimpleGrid, Heading, Box, Card } from '@chakra-ui/react';
import SafeImage from '../utils/SafeImage';
import { Button } from '@chakra-ui/react';

/**
 * Componente per visualizzare una griglia di link utili
 */
export default function LinkGrid({
    title,
    links = [],
    isDarkMode = false
}) {
    if (!links || links.length === 0) return null;

    return (
        <Box>
            <Heading size="md" mb={4} color={isDarkMode ? 'white' : 'gray.900'}>
                {title}
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                {links.map((link, idx) => (
                    <Card.Root
                        key={idx}
                        bg={isDarkMode ? 'gray.700' : 'white'}
                        borderColor={isDarkMode ? 'gray.600' : 'gray.300'}
                    >
                        {link.imageUrl && (
                            <Box overflow="hidden">
                                <SafeImage
                                    src={link.imageUrl}
                                    alt={link.title}
                                    style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                                />
                            </Box>
                        )}
                        <Card.Body>
                            {link.title && (
                                <Heading size="sm" mb={2} color={isDarkMode ? 'white' : 'gray.900'}>
                                    {link.title}
                                </Heading>
                            )}
                            {link.summary && (
                                <div style={{ fontSize: '0.875rem', marginBottom: '0.75rem', color: isDarkMode ? '#A0AEC0' : '#4A5568' }}>
                                    {link.summary}
                                </div>
                            )}
                            {link.url && (
                                <Button
                                    as="a"
                                    href={link.url}
                                    target="_blank"
                                    size="sm"
                                    colorPalette="blue"
                                    variant={isDarkMode ? 'solid' : 'outline'}
                                    w="full"
                                    bg={isDarkMode ? 'blue.600' : undefined}
                                    color={isDarkMode ? 'white' : undefined}
                                    _hover={{
                                        bg: isDarkMode ? 'blue.700' : undefined,
                                        opacity: isDarkMode ? 1 : undefined
                                    }}
                                >
                                    🌐 Visita Link
                                </Button>
                            )}
                        </Card.Body>
                    </Card.Root>
                ))}
            </SimpleGrid>
        </Box>
    );
}

