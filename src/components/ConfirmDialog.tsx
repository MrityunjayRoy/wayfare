'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle } from 'react-icons/fi';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning';
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'danger',
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    const confirmColors =
        variant === 'danger'
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-amber-500 hover:bg-amber-600 text-white';

    const iconColors =
        variant === 'danger'
            ? 'bg-red-100 dark:bg-red-900/30 text-red-500'
            : 'bg-amber-100 dark:bg-amber-900/30 text-amber-500';

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
                    onClick={onCancel}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" />

                    {/* Dialog */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative bg-white dark:bg-dark-200 rounded-2xl shadow-elevated w-full max-w-sm overflow-hidden"
                    >
                        <div className="p-6">
                            {/* Icon */}
                            <div className={`w-12 h-12 rounded-full ${iconColors} flex items-center justify-center mx-auto mb-4`}>
                                <FiAlertTriangle size={22} />
                            </div>

                            {/* Content */}
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 text-center mb-2">
                                {title}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 text-center leading-relaxed">
                                {message}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 px-6 pb-6">
                            <button
                                onClick={onCancel}
                                className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-slate-100 dark:bg-dark-400 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-dark-500 transition-colors cursor-pointer"
                            >
                                {cancelLabel}
                            </button>
                            <button
                                onClick={onConfirm}
                                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${confirmColors}`}
                            >
                                {confirmLabel}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
