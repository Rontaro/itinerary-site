import React from 'react';
import { Card, HStack, Heading, Text, Button } from '@chakra-ui/react';
import SimpleCheckbox from './SimpleCheckbox';

/**
 * Componente per una singola todo/checklist card riutilizzabile
 */
export default function TodoCard({
    title,
    note,
    url,
    isCompleted,
    onToggle,
    isDarkMode = false,
    onCardClick = null
}) {
    return (
        <Card.Root
            bg={isDarkMode ? 'gray.700' : 'white'}
            borderColor={isDarkMode ? 'gray.600' : 'gray.300'}
            cursor="pointer"
            onClick={onCardClick || (() => onToggle())}
            _hover={{ bg: isDarkMode ? 'gray.600' : 'gray.50' }}
        >
            <Card.Body>
                <HStack gap={3} mb={2}>
                    <SimpleCheckbox
                        isChecked={isCompleted}
                        onChange={(e) => {
                            e.stopPropagation();
                            onToggle(e.target.checked);
                        }}
                        isDarkMode={isDarkMode}
                        size="lg"
                    />
                    <Heading
                        size="sm"
                        color={isDarkMode ? 'white' : 'gray.900'}
                        textDecoration={isCompleted ? 'line-through' : 'none'}
                        opacity={isCompleted ? 0.6 : 1}
                        transition="all 0.2s"
                    >
                        {title}
                    </Heading>
                </HStack>

                {note && (
                    <Text fontSize="sm" color={isDarkMode ? 'gray.300' : 'gray.600'} ml={8}>
                        📝 {note}
                    </Text>
                )}

                {url && (
                    <Button
                        as="a"
                        href={url}
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
                        onClick={(e) => e.stopPropagation()}
                    >
                        🌐 Visita Link
                    </Button>
                )}
            </Card.Body>
        </Card.Root>
    );
}
