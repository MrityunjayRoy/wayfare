'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { Memory, ViewMode } from '@/lib/types';

interface MemoryState {
    memories: Memory[];
    viewMode: ViewMode;
    isLoaded: boolean;
}

type MemoryAction =
    | { type: 'HYDRATE'; payload: Memory[] }
    | { type: 'ADD_MEMORY'; payload: Memory }
    | { type: 'DELETE_MEMORY'; payload: string }
    | { type: 'SET_VIEW_MODE'; payload: ViewMode };

function memoryReducer(state: MemoryState, action: MemoryAction): MemoryState {
    switch (action.type) {
        case 'HYDRATE':
            return { ...state, memories: action.payload, isLoaded: true };
        case 'ADD_MEMORY': {
            const newMemories = [...state.memories, action.payload].sort(
                (a, b) => new Date(a.assigned_date).getTime() - new Date(b.assigned_date).getTime()
            );
            return { ...state, memories: newMemories };
        }
        case 'DELETE_MEMORY': {
            const filtered = state.memories.filter(m => m.id !== action.payload);
            return { ...state, memories: filtered };
        }
        case 'SET_VIEW_MODE':
            return { ...state, viewMode: action.payload };
        default:
            return state;
    }
}

interface MemoryContextType {
    state: MemoryState;
    addMemory: (file: File, assignedDate: string, message?: string) => Promise<void>;
    deleteMemory: (id: string) => Promise<void>;
    setViewMode: (mode: ViewMode) => void;
}

const MemoryContext = createContext<MemoryContextType | undefined>(undefined);

export function MemoryProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(memoryReducer, {
        memories: [],
        viewMode: 'travel',
        isLoaded: false,
    });

    // Fetch memories from API on mount
    useEffect(() => {
        async function fetchMemories() {
            try {
                const res = await fetch('/api/memories');
                if (res.ok) {
                    const memories: Memory[] = await res.json();
                    dispatch({ type: 'HYDRATE', payload: memories });
                } else {
                    dispatch({ type: 'HYDRATE', payload: [] });
                }
            } catch {
                dispatch({ type: 'HYDRATE', payload: [] });
            }
        }
        fetchMemories();
    }, []);

    const addMemory = useCallback(async (file: File, assignedDate: string, message?: string) => {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('assigned_date', assignedDate);
        if (message) formData.append('message', message);
        formData.append('mode_type', state.viewMode);

        const res = await fetch('/api/memories', {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) {
            throw new Error('Failed to save memory');
        }

        const memory: Memory = await res.json();
        dispatch({ type: 'ADD_MEMORY', payload: memory });
    }, [state.viewMode]);

    const deleteMemory = useCallback(async (id: string) => {
        // Optimistic update
        dispatch({ type: 'DELETE_MEMORY', payload: id });

        const res = await fetch(`/api/memories/${id}`, {
            method: 'DELETE',
        });

        if (!res.ok) {
            // Re-fetch on failure
            const refetch = await fetch('/api/memories');
            if (refetch.ok) {
                const memories: Memory[] = await refetch.json();
                dispatch({ type: 'HYDRATE', payload: memories });
            }
        }
    }, []);

    const setViewMode = useCallback((mode: ViewMode) => {
        dispatch({ type: 'SET_VIEW_MODE', payload: mode });
    }, []);

    return (
        <MemoryContext.Provider value={{ state, addMemory, deleteMemory, setViewMode }}>
            {children}
        </MemoryContext.Provider>
    );
}

export function useMemory() {
    const context = useContext(MemoryContext);
    if (!context) {
        throw new Error('useMemory must be used within a MemoryProvider');
    }
    return context;
}
