import { Memory } from './types';

const STORAGE_KEY = 'wayfare_memories';

export function getMemories(): Memory[] {
    if (typeof window === 'undefined') return [];
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

export function saveMemories(memories: Memory[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
}

export function addMemory(memory: Memory): Memory[] {
    const memories = getMemories();
    memories.push(memory);
    memories.sort((a, b) => new Date(a.assigned_date).getTime() - new Date(b.assigned_date).getTime());
    saveMemories(memories);
    return memories;
}

export function deleteMemory(id: string): Memory[] {
    const memories = getMemories().filter(m => m.id !== id);
    saveMemories(memories);
    return memories;
}

export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
