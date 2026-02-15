'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiImage, FiCalendar, FiMessageSquare } from 'react-icons/fi';

interface AddMemoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (file: File, date: string, message?: string) => Promise<void>;
}

export default function AddMemoryModal({ isOpen, onClose, onSubmit }: AddMemoryModalProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [message, setMessage] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = useCallback((file: File) => {
        if (!file.type.startsWith('image/')) return;
        setSelectedFile(file);
        setError(null);
        // Create preview URL
        const url = URL.createObjectURL(file);
        setImagePreview(url);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFileSelect(file);
        },
        [handleFileSelect]
    );

    const handleSubmit = async () => {
        if (!selectedFile) return;
        setIsSubmitting(true);
        setError(null);
        try {
            await onSubmit(selectedFile, date, message.trim() || undefined);
            // Reset
            setSelectedFile(null);
            setImagePreview(null);
            setDate(new Date().toISOString().split('T')[0]);
            setMessage('');
            onClose();
        } catch {
            setError('Failed to save memory. Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setSelectedFile(null);
        setImagePreview(null);
        setDate(new Date().toISOString().split('T')[0]);
        setMessage('');
        setError(null);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center p-4"
                    onClick={handleClose}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative bg-cream-50 rounded-3xl shadow-elevated w-full max-w-md overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-sage-100/50">
                            <h2 className="text-lg font-semibold text-slate-800">New Memory</h2>
                            <button
                                onClick={handleClose}
                                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors cursor-pointer"
                            >
                                <FiX size={16} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-5 space-y-5">
                            {/* Error message */}
                            {error && (
                                <div className="px-4 py-2.5 rounded-xl bg-red-50 border border-red-200/60 text-sm text-red-600">
                                    {error}
                                </div>
                            )}

                            {/* Image upload */}
                            <div
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setIsDragging(true);
                                }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden ${isDragging
                                    ? 'border-sage-400 bg-sage-50'
                                    : imagePreview
                                        ? 'border-transparent'
                                        : 'border-sage-200 hover:border-sage-300 bg-sage-50/50'
                                    }`}
                            >
                                {imagePreview ? (
                                    <div className="relative aspect-video">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover rounded-xl"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity rounded-xl">
                                            <span className="text-white text-sm font-medium bg-black/40 px-3 py-1 rounded-full">
                                                Change image
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-10">
                                        <div className="w-12 h-12 rounded-full bg-sage-100 flex items-center justify-center mb-3">
                                            <FiImage className="text-sage-500" size={20} />
                                        </div>
                                        <p className="text-sm font-medium text-slate-600">Drop an image here</p>
                                        <p className="text-xs text-slate-400 mt-1">or click to browse</p>
                                    </div>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleFileSelect(file);
                                    }}
                                />
                            </div>

                            {/* Date picker */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-2">
                                    <FiCalendar size={14} className="text-sage-500" />
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white rounded-xl border border-sage-200/60 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sage-300 focus:border-transparent transition-all"
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-2">
                                    <FiMessageSquare size={14} className="text-sage-500" />
                                    Note <span className="text-slate-400 font-normal">(optional)</span>
                                </label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="What makes this moment special?"
                                    rows={3}
                                    className="w-full px-4 py-2.5 bg-white rounded-xl border border-sage-200/60 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-sage-300 focus:border-transparent transition-all resize-none"
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-5 pt-0">
                            <button
                                onClick={handleSubmit}
                                disabled={!selectedFile || isSubmitting}
                                className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${selectedFile && !isSubmitting
                                    ? 'bg-gradient-to-r from-sage-400 to-sage-500 text-white shadow-md hover:shadow-lg hover:from-sage-500 hover:to-sage-600 active:scale-[0.98]'
                                    : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                                    }`}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <motion.span
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block"
                                        />
                                        Uploading...
                                    </span>
                                ) : (
                                    'Save Memory'
                                )}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
