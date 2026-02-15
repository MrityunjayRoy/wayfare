'use client';

import { motion } from 'framer-motion';
import { Memory } from '@/lib/types';
import { format } from 'date-fns';
import { FiTrash2 } from 'react-icons/fi';

interface MemoryCardProps {
    memory: Memory;
    index: number;
    side: 'left' | 'right';
    onDelete: (id: string) => void;
}

export default function MemoryCard({ memory, index, side, onDelete }: MemoryCardProps) {
    return (
        <motion.div
            id={`memory-${memory.assigned_date}`}
            initial={{ opacity: 0, x: side === 'left' ? -40 : 40, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`relative w-full max-w-sm ${side === 'left' ? 'mr-auto' : 'ml-auto'
                }`}
        >
            <div className="group bg-white/70 backdrop-blur-md rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 border border-sage-100/40">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                        src={memory.image_url}
                        alt={memory.message || 'Memory'}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Delete button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(memory.id);
                        }}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-50 hover:text-red-500 cursor-pointer text-slate-400"
                    >
                        <FiTrash2 size={14} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-sage-400" />
                        <time className="text-xs font-medium text-sage-600 tracking-wide uppercase">
                            {format(new Date(memory.assigned_date), 'MMM d, yyyy')}
                        </time>
                    </div>
                    {memory.message && (
                        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                            {memory.message}
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
