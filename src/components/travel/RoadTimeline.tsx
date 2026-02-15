'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Memory } from '@/lib/types';
import { format } from 'date-fns';
import { FiTrash2, FiChevronDown, FiMapPin, FiMessageSquare } from 'react-icons/fi';

interface RoadTimelineProps {
    memories: Memory[];
    onDelete: (id: string) => void;
}

export default function RoadTimeline({ memories, onDelete }: RoadTimelineProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    if (memories.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 rounded-full bg-sage-100 dark:bg-dark-300 flex items-center justify-center mb-4">
                    <span className="text-3xl">🛤️</span>
                </div>
                <h3 className="text-lg font-medium text-slate-600 dark:text-slate-300 mb-2">
                    Your journey begins here
                </h3>
                <p className="text-sm text-slate-400 dark:text-slate-500 max-w-xs">
                    Tap the + button to add your first memory and start building your road trip.
                </p>
            </div>
        );
    }

    // Group memories by month
    const grouped: { month: string; memories: Memory[] }[] = [];
    let currentMonth = '';
    memories.forEach((m) => {
        const month = format(new Date(m.assigned_date), 'MMMM yyyy');
        if (month !== currentMonth) {
            currentMonth = month;
            grouped.push({ month, memories: [m] });
        } else {
            grouped[grouped.length - 1].memories.push(m);
        }
    });

    return (
        <div className="relative py-8 px-4 max-w-4xl mx-auto">
            {/* Central road line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-gradient-to-b from-sage-200 dark:from-dark-400 via-sage-300 dark:via-dark-500 to-sage-200 dark:to-dark-400" />

            {/* Start marker */}
            <div className="relative flex justify-center mb-8">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-sage-300 to-sage-500 flex items-center justify-center shadow-fab z-10"
                >
                    <FiMapPin className="text-white" size={18} />
                </motion.div>
            </div>

            {grouped.map((group, groupIndex) => (
                <div key={group.month}>
                    {/* Month label */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: groupIndex * 0.1 }}
                        className="relative flex justify-center mb-6 mt-4"
                    >
                        <span className="relative z-10 px-4 py-1.5 rounded-full bg-sage-100 dark:bg-dark-300 text-xs font-semibold text-sage-700 dark:text-sage-300 tracking-wider uppercase shadow-soft border border-sage-200/50 dark:border-dark-400/50">
                            {group.month}
                        </span>
                    </motion.div>

                    {group.memories.map((memory, index) => {
                        const globalIndex = memories.indexOf(memory);
                        const side = globalIndex % 2 === 0 ? 'left' : 'right';
                        const isExpanded = expandedId === memory.id;
                        const isHovered = hoveredId === memory.id;

                        return (
                            <div key={memory.id} className="relative mb-10">
                                {/* Road dot on the center line */}
                                <div className="absolute left-1/2 top-6 -translate-x-1/2 z-20">
                                    <motion.div
                                        animate={{
                                            scale: isHovered ? 1.5 : 1,
                                            backgroundColor: isHovered ? '#5f8a5f' : '#7a9e7a',
                                        }}
                                        className="w-3 h-3 rounded-full shadow-sm ring-4 ring-cream-50 dark:ring-dark-50"
                                    />
                                </div>

                                {/* Connector line from dot to card */}
                                <div
                                    className={`absolute top-7 h-px w-[calc(50%-40px)] ${side === 'left' ? 'right-1/2 mr-2' : 'left-1/2 ml-2'
                                        }`}
                                >
                                    <motion.div
                                        animate={{ scaleX: isHovered ? 1 : 0.6, opacity: isHovered ? 1 : 0.4 }}
                                        className={`h-full bg-gradient-to-r ${side === 'left'
                                            ? 'from-sage-300 to-sage-400 origin-right'
                                            : 'from-sage-400 to-sage-300 origin-left'
                                            }`}
                                    />
                                </div>

                                {/* Card */}
                                <div
                                    className={`flex ${side === 'left' ? 'justify-start pr-[52%]' : 'justify-end pl-[52%]'}`}
                                >
                                    <motion.div
                                        id={`memory-${memory.assigned_date}`}
                                        initial={{ opacity: 0, x: side === 'left' ? -30 : 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.08 + groupIndex * 0.1 }}
                                        onHoverStart={() => setHoveredId(memory.id)}
                                        onHoverEnd={() => setHoveredId(null)}
                                        onClick={() => setExpandedId(isExpanded ? null : memory.id)}
                                        className="group relative w-full max-w-sm cursor-pointer"
                                    >
                                        <motion.div
                                            layout
                                            className="bg-white/80 dark:bg-dark-200/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-shadow duration-300 border border-sage-100/40 dark:border-dark-400/40"
                                        >
                                            {/* Image */}
                                            <motion.div layout="position" className="relative overflow-hidden">
                                                <motion.div
                                                    animate={{ height: isExpanded ? 280 : 160 }}
                                                    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                                                    className="overflow-hidden"
                                                >
                                                    <img
                                                        src={memory.image_url}
                                                        alt={memory.message || 'Memory'}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        style={{ minHeight: isExpanded ? 280 : 160 }}
                                                    />
                                                </motion.div>

                                                {/* Image overlay gradient */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                                {/* Delete button */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDelete(memory.id);
                                                    }}
                                                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/80 dark:bg-dark-300/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 cursor-pointer text-slate-400"
                                                >
                                                    <FiTrash2 size={12} />
                                                </button>

                                                {/* Expand indicator */}
                                                <motion.div
                                                    animate={{ rotate: isExpanded ? 180 : 0 }}
                                                    className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-white/70 dark:bg-dark-300/70 backdrop-blur-sm flex items-center justify-center text-sage-600 dark:text-sage-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                >
                                                    <FiChevronDown size={14} />
                                                </motion.div>
                                            </motion.div>

                                            {/* Content */}
                                            <div className="p-3.5">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-sage-400" />
                                                        <time className="text-[11px] font-semibold text-sage-600 dark:text-sage-400 tracking-wide uppercase">
                                                            {format(new Date(memory.assigned_date), 'MMM d, yyyy')}
                                                        </time>
                                                    </div>
                                                    {memory.message && !isExpanded && (
                                                        <FiMessageSquare size={12} className="text-sage-300 dark:text-sage-600" />
                                                    )}
                                                </div>

                                                {/* Expanded message */}
                                                <AnimatePresence>
                                                    {isExpanded && memory.message && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2.5 pt-2.5 border-t border-sage-100/50 dark:border-dark-400/50">
                                                                {memory.message}
                                                            </p>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}

            {/* End marker */}
            <div className="relative flex justify-center mt-4">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="w-6 h-6 rounded-full bg-sage-200 dark:bg-dark-400 ring-4 ring-sage-100/50 dark:ring-dark-300/50 z-10 flex items-center justify-center"
                >
                    <div className="w-2 h-2 rounded-full bg-sage-400" />
                </motion.div>
            </div>

            {/* Memory count */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4"
            >
                {memories.length} {memories.length === 1 ? 'memory' : 'memories'} along the road
            </motion.p>
        </div>
    );
}
