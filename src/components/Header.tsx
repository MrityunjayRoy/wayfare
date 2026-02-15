'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiLogOut, FiSun, FiMoon } from 'react-icons/fi';
import ModeToggle from './ModeToggle';
import ConfirmDialog from './ConfirmDialog';
import { useTheme } from '@/context/ThemeContext';
import { ViewMode } from '@/lib/types';

interface HeaderProps {
    mode: ViewMode;
    onModeChange: (mode: ViewMode) => void;
}

export default function Header({ mode, onModeChange }: HeaderProps) {
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();
    const [username, setUsername] = useState<string | null>(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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
        setShowLogoutConfirm(false);
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
        <>
            <header className="sticky top-0 z-40 backdrop-blur-xl bg-cream-50/80 dark:bg-dark-100/80 border-b border-sage-100/50 dark:border-dark-400/50 transition-colors duration-300">
                <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2">
                    <h1 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-100 tracking-tight shrink-0">
                        Wayfare
                    </h1>

                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <ModeToggle mode={mode} onChange={onModeChange} />

                        {/* Theme toggle */}
                        <button
                            onClick={toggleTheme}
                            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-dark-400 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-sage-100 dark:hover:bg-dark-500 hover:text-sage-600 dark:hover:text-sage-400 transition-colors cursor-pointer"
                            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {theme === 'dark' ? <FiSun size={14} /> : <FiMoon size={14} />}
                        </button>

                        {username && (
                            <div className="flex items-center gap-1.5 sm:gap-2 pl-2 sm:pl-3 border-l border-sage-200/60 dark:border-dark-400/60 shrink-0">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sage-300 to-sage-500 flex items-center justify-center">
                                    <span className="text-white text-xs font-semibold uppercase">
                                        {username.charAt(0)}
                                    </span>
                                </div>
                                <span className="text-sm text-slate-600 dark:text-slate-400 font-medium hidden md:inline max-w-[100px] truncate">
                                    {username}
                                </span>
                                <button
                                    onClick={() => setShowLogoutConfirm(true)}
                                    disabled={isLoggingOut}
                                    className="w-7 h-7 rounded-full bg-slate-100 dark:bg-dark-400 flex items-center justify-center text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 transition-colors cursor-pointer disabled:opacity-50"
                                    title="Sign out"
                                >
                                    <FiLogOut size={13} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <ConfirmDialog
                isOpen={showLogoutConfirm}
                title="Sign Out"
                message="Are you sure you want to sign out of your account?"
                confirmLabel="Sign Out"
                cancelLabel="Stay"
                variant="warning"
                onConfirm={handleLogout}
                onCancel={() => setShowLogoutConfirm(false)}
            />
        </>
    );
}
