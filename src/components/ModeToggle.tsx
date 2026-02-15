'use client';

import { motion } from 'framer-motion';
import { ViewMode } from '@/lib/types';

interface ModeToggleProps {
    mode: ViewMode;
    onChange: (mode: ViewMode) => void;
}

export default function ModeToggle({ mode, onChange }: ModeToggleProps) {
    return (
        <div className="relative flex items-center bg-cream-200/80 dark:bg-dark-300/80 backdrop-blur-sm rounded-full p-1 shadow-soft">
            <motion.div
                className="absolute top-1 bottom-1 rounded-full bg-sage-500 shadow-md"
                layout
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                style={{
                    width: 'calc(50% - 4px)',
                    left: mode === 'travel' ? '4px' : 'calc(50%)',
                }}
            />
            <button
                onClick={() => onChange('travel')}
                className={`relative z-10 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors duration-200 cursor-pointer ${mode === 'travel' ? 'text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
            >
                ✦ Travel
            </button>
            <button
                onClick={() => onChange('static')}
                className={`relative z-10 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors duration-200 cursor-pointer ${mode === 'static' ? 'text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
            >
                ◈ Gallery
            </button>
        </div>
    );
}
