'use client';

import { useCallback } from 'react';
import { Memory } from '@/lib/types';
import VibeMap from './VibeMap';
import RoadTimeline from './RoadTimeline';

interface TravelViewProps {
    memories: Memory[];
    onDelete: (id: string) => void;
}

export default function TravelView({ memories, onDelete }: TravelViewProps) {
    const handleDateClick = useCallback((dateKey: string) => {
        const el = document.getElementById(`memory-${dateKey}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('ring-2', 'ring-sage-400', 'ring-offset-2');
            setTimeout(() => {
                el.classList.remove('ring-2', 'ring-sage-400', 'ring-offset-2');
            }, 2000);
        }
    }, []);

    return (
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
            {/* Vibe Map */}
            <VibeMap memories={memories} onDateClick={handleDateClick} />

            {/* Road Timeline */}
            <RoadTimeline memories={memories} onDelete={onDelete} />
        </div>
    );
}
