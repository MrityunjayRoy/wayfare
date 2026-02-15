'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Memory } from '@/lib/types';
import { format } from 'date-fns';
import { FiChevronLeft, FiChevronRight, FiTrash2, FiX, FiCalendar } from 'react-icons/fi';

interface StaticViewProps {
    memories: Memory[];
    onDelete: (id: string) => void;
}

export default function StaticView({ memories, onDelete }: StaticViewProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [direction, setDirection] = useState(0);
    const [touchStart, setTouchStart] = useState(0);

    // Build masonry columns
    const columns = useMemo(() => {
        const cols: Memory[][] = [[], [], []];
        memories.forEach((m, i) => {
            cols[i % 3].push(m);
        });
        return cols;
    }, [memories]);

    // Lightbox keyboard nav
    useEffect(() => {
        if (selectedIndex === null) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelectedIndex(null);
            if (e.key === 'ArrowLeft') paginate(-1);
            if (e.key === 'ArrowRight') paginate(1);
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [selectedIndex, memories.length]);

    const paginate = useCallback(
        (newDirection: number) => {
            setDirection(newDirection);
            setSelectedIndex((prev) => {
                if (prev === null) return null;
                const next = prev + newDirection;
                if (next < 0) return memories.length - 1;
                if (next >= memories.length) return 0;
                return next;
            });
        },
        [memories.length]
    );

    const openLightbox = (memoryId: string) => {
        const idx = memories.findIndex((m) => m.id === memoryId);
        if (idx >= 0) setSelectedIndex(idx);
    };

    if (memories.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] text-center px-4">
                <div className="w-20 h-20 rounded-full bg-sage-100 flex items-center justify-center mb-4">
                    <span className="text-3xl">🖼️</span>
                </div>
                <h3 className="text-lg font-medium text-slate-600 mb-2">
                    Your gallery is empty
                </h3>
                <p className="text-sm text-slate-400 max-w-xs">
                    Add your first memory to see it showcased here in a beautiful gallery.
                </p>
            </div>
        );
    }

    const selectedMemory = selectedIndex !== null ? memories[selectedIndex] : null;

    const lightboxVariants = {
        enter: (d: number) => ({
            opacity: 0,
            scale: 1.05,
            x: d > 0 ? 80 : -80,
        }),
        center: {
            opacity: 1,
            scale: 1,
            x: 0,
        },
        exit: (d: number) => ({
            opacity: 0,
            scale: 0.95,
            x: d > 0 ? -80 : 80,
        }),
    };

    return (
        <>
            {/* Pinterest-style masonry gallery */}
            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="flex gap-4">
                    {columns.map((col, colIndex) => (
                        <div key={colIndex} className="flex-1 flex flex-col gap-4">
                            {col.map((memory, i) => (
                                <motion.div
                                    key={memory.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: (colIndex * col.length + i) * 0.04,
                                        ease: [0.25, 0.46, 0.45, 0.94],
                                    }}
                                    onClick={() => openLightbox(memory.id)}
                                    className="group relative cursor-pointer rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 bg-white border border-sage-100/30"
                                >
                                    <div className="overflow-hidden">
                                        <img
                                            src={memory.image_url}
                                            alt={memory.message || 'Memory'}
                                            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>

                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    {/* Info on hover */}
                                    <div className="absolute bottom-0 inset-x-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <FiCalendar size={10} className="text-white/70" />
                                            <span className="text-[11px] font-medium text-white/80">
                                                {format(new Date(memory.assigned_date), 'MMM d, yyyy')}
                                            </span>
                                        </div>
                                        {memory.message && (
                                            <p className="text-xs text-white/90 line-clamp-2 leading-relaxed">
                                                {memory.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Delete button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(memory.id);
                                        }}
                                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-50 hover:text-red-500 cursor-pointer text-slate-400"
                                    >
                                        <FiTrash2 size={12} />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedMemory && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center"
                        onClick={() => setSelectedIndex(null)}
                        onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
                        onTouchEnd={(e) => {
                            const diff = e.changedTouches[0].clientX - touchStart;
                            if (Math.abs(diff) > 50) paginate(diff > 0 ? -1 : 1);
                        }}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setSelectedIndex(null)}
                            className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/80 hover:bg-white/20 transition-colors cursor-pointer"
                        >
                            <FiX size={20} />
                        </button>

                        {/* Image */}
                        <AnimatePresence initial={false} custom={direction} mode="wait">
                            <motion.div
                                key={selectedMemory.id}
                                custom={direction}
                                variants={lightboxVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                                className="relative max-w-5xl max-h-[85vh] mx-4"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <img
                                    src={selectedMemory.image_url}
                                    alt={selectedMemory.message || 'Memory'}
                                    className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl"
                                />

                                {/* Caption overlay */}
                                <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-black/70 to-transparent rounded-b-xl">
                                    <time className="text-xs font-medium text-white/60 tracking-widest uppercase mb-1.5 block">
                                        {format(new Date(selectedMemory.assigned_date), 'MMMM d, yyyy')}
                                    </time>
                                    {selectedMemory.message && (
                                        <p className="text-white/90 text-base leading-relaxed font-light">
                                            {selectedMemory.message}
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation arrows */}
                        {memories.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        paginate(-1);
                                    }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/80 hover:bg-white/20 hover:text-white transition-all duration-200 cursor-pointer"
                                >
                                    <FiChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        paginate(1);
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/80 hover:bg-white/20 hover:text-white transition-all duration-200 cursor-pointer"
                                >
                                    <FiChevronRight size={24} />
                                </button>
                            </>
                        )}

                        {/* Dot indicators */}
                        {memories.length > 1 && memories.length <= 20 && (
                            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                                {memories.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDirection(i > (selectedIndex ?? 0) ? 1 : -1);
                                            setSelectedIndex(i);
                                        }}
                                        className={`rounded-full transition-all duration-300 cursor-pointer ${i === selectedIndex
                                            ? 'w-6 h-2 bg-white/90'
                                            : 'w-2 h-2 bg-white/30 hover:bg-white/50'
                                            }`}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Counter for many images */}
                        {memories.length > 20 && (
                            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm">
                                <span className="text-sm text-white/80 font-medium">
                                    {(selectedIndex ?? 0) + 1} / {memories.length}
                                </span>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
