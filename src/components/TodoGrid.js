import React from 'react';
import { SimpleGrid, Heading, Box } from '@chakra-ui/react';
import TodoCard from './TodoCard';

/**
 * Componente per visualizzare una griglia di todo/checklist items
 */
export default function TodoGrid({
    title,
    todos = [],
    completedTodos = {},
    onToggleTodo,
    isDarkMode = false
}) {
    if (!todos || todos.length === 0) return null;

    return (
        <Box>
            <Heading size="md" mb={4} color={isDarkMode ? 'white' : 'gray.900'}>
                {title}
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                {todos.map((todo, idx) => (
                    <TodoCard
                        key={idx}
                        title={todo.title}
                        note={todo.note}
                        url={todo.url}
                        isCompleted={completedTodos[todo.title] || false}
                        onToggle={(value) => onToggleTodo(todo.title, value)}
                        isDarkMode={isDarkMode}
                    />
                ))}
            </SimpleGrid>
        </Box>
    );
}

