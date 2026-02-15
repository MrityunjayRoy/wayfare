'use client';

import ModeToggle from './ModeToggle';
import { ViewMode } from '@/lib/types';

interface HeaderProps {
    mode: ViewMode;
    onModeChange: (mode: ViewMode) => void;
}

export default function Header({ mode, onModeChange }: HeaderProps) {
    return (
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-cream-50/80 border-b border-sage-100/50">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center shadow-sm">
                        <span className="text-white text-sm font-bold">W</span>
                    </div>
                    <h1 className="text-xl font-semibold text-slate-800 tracking-tight">
                        Wayfare
                    </h1>
                </div>
                <ModeToggle mode={mode} onChange={onModeChange} />
            </div>
        </header>
    );
}
