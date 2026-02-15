'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiLock, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Registration failed');
                return;
            }

            router.push('/');
            router.refresh();
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-full max-w-md"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center shadow-card mx-auto mb-4">
                        <span className="text-white text-2xl font-bold">W</span>
                    </div>
                    <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">Create an account</h1>
                    <p className="text-sm text-slate-400 mt-1">Start your Wayfare journey</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-card p-8 space-y-5">
                    {error && (
                        <div className="px-4 py-2.5 rounded-xl bg-red-50 border border-red-200/60 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-2">
                            <FiUser size={14} className="text-sage-500" />
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Choose a username"
                            required
                            minLength={3}
                            maxLength={30}
                            className="w-full px-4 py-3 bg-cream-50 rounded-xl border border-sage-200/60 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-sage-300 focus:border-transparent transition-all"
                        />
                        <p className="text-xs text-slate-400 mt-1">3-30 characters</p>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-2">
                            <FiLock size={14} className="text-sage-500" />
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create a password"
                            required
                            minLength={6}
                            className="w-full px-4 py-3 bg-cream-50 rounded-xl border border-sage-200/60 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-sage-300 focus:border-transparent transition-all"
                        />
                        <p className="text-xs text-slate-400 mt-1">Minimum 6 characters</p>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-2">
                            <FiLock size={14} className="text-sage-500" />
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your password"
                            required
                            minLength={6}
                            className="w-full px-4 py-3 bg-cream-50 rounded-xl border border-sage-200/60 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-sage-300 focus:border-transparent transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer bg-gradient-to-r from-sage-400 to-sage-500 text-white shadow-md hover:shadow-lg hover:from-sage-500 hover:to-sage-600 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block"
                            />
                        ) : (
                            <>
                                Create Account
                                <FiArrowRight size={16} />
                            </>
                        )}
                    </button>

                    <p className="text-center text-sm text-slate-400">
                        Already have an account?{' '}
                        <Link href="/login" className="text-sage-600 font-medium hover:text-sage-700 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
}
