'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiLogOut } from 'react-icons/fi';
import ModeToggle from './ModeToggle';
import { ViewMode } from '@/lib/types';

interface HeaderProps {
    mode: ViewMode;
    onModeChange: (mode: ViewMode) => void;
}

export default function Header({ mode, onModeChange }: HeaderProps) {
    const router = useRouter();
    const [username, setUsername] = useState<string | null>(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const data = await res.json();
                    setUsername(data.username);
                }
            } catch {
                // Silently fail
            }
        }
        fetchUser();
    }, []);

    const handleLogout = async () => {
        const confirmed = window.confirm('Are you sure you want to sign out?');
        if (!confirmed) return;

        setIsLoggingOut(true);
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/login');
            router.refresh();
        } catch {
            setIsLoggingOut(false);
        }
    };

    return (
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-cream-50/80 border-b border-sage-100/50">
            <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2">
                <h1 className="text-lg sm:text-xl font-semibold text-slate-800 tracking-tight shrink-0">
                    Wayfare
                </h1>

                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <ModeToggle mode={mode} onChange={onModeChange} />

                    {username && (
                        <div className="flex items-center gap-1.5 sm:gap-2 pl-2 sm:pl-3 border-l border-sage-200/60 shrink-0">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sage-300 to-sage-500 flex items-center justify-center">
                                <span className="text-white text-xs font-semibold uppercase">
                                    {username.charAt(0)}
                                </span>
                            </div>
                            <span className="text-sm text-slate-600 font-medium hidden md:inline max-w-[100px] truncate">
                                {username}
                            </span>
                            <button
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer disabled:opacity-50"
                                title="Sign out"
                            >
                                <FiLogOut size={13} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
